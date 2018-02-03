---
title: 实现过的功能（九）：多人拼单
date: 2017-12-26
tags: 功能,后端,PHP,前端,JavaScript
description: 多人拼单
sort: 12
---

多用户同时操作一个购物车。

## 主要使用

* <a href="http://www.runoob.com/html/html5-websocket.html" target="_blank">WebSocket</a> 即时通讯（<a href="http://www.workerman.net/" target="_blank">Workerman</a> 做服务端）
* <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/History_API" target="_blank">History API</a> 控制页面间的跳转

## 大概流程

* 多名用户加入拼单
* 分别选择商品
* 其中任意一名用户下单支付

![多人拼单](/image/multiplayer-order/probably.png)

## 服务端

<a href="http://www.workerman.net/" target="_blank">Workerman</a> 的 Windows 和 Linux 有所不同，需要注意。以下是 Windows 下开发。

创建 App 文件夹放工作文件，创建 websocket.php 文件（<a href="http://doc.workerman.net/315113" target="_blank">入门指引 > 简单的开发示例 > 实例二</a>）。

加入心跳检测。

```PHP
...
define('HEARTBEATTIME', 25); // 心跳间隔 25s ，视情况

$worker->onWorkerStart = function($worker) {
    ...

    // 心跳检测
    Timer::add(20, function()use($worker) {
        ...
        $now = time();

        foreach($worker->connections as $con) {
            // 发送给客户端验证心跳的信息
            $message = [
                ...
            ];

            $con->send(json_encode($message));

            // 有可能该connection还没收到过消息，则lastMessageTime设置为当前时间
            if (empty($con->lastMessageTime)) {
                $con->lastMessageTime = $now;
                continue;
            }
            // 上次通讯时间间隔大于心跳间隔，则认为客户端已经下线，关闭连接
            if (($now - $con->lastMessageTime) > HEARTBEATTIME) {
                $con->close();
            }
        }
    });
    ...
};
```

加入进程间的通讯（<a href="http://doc.workerman.net/346075" target="_blank">常用组件 > Channel 分布式通讯组件 > 例子-分组发送</a>）。个人理解：连接的进程，用户的连接。

```PHP
$worker->onWorkerStart = function($worker) {
    ...

    // 监听全局分组发送消息事件
    Channel\Client::on('sendToGroup', function($event_data) {
        global $group_con_map;
        $group_id = $event_data['group_id'];
        $message = $event_data['message'];
        $exclude = $event_data['exclude'];
        $close = $event_data['close'];

        if (isset($group_con_map[$group_id])) {

            // 循环对应组的连接数组
            foreach ($group_con_map[$group_id]['con'] as $id => $con) {

                if ($id != $exclude) { // 不发排除连接

                    $con->send(json_encode($message));
                }
            }

            if (1 == $close) { // 发送消息后删除群组
                ...
                unset($group_con_map[$group_id]);
            }
        }
    });
};
```

经过各种尝试（有可能脑袋没转过弯），还是决定加入数据库（<a href="http://doc.workerman.net/315205" target="_blank">常用组件 > MySQL组件 > Workerman/MySQL</a>），每个组一个购物车。

```PHP
$worker->onMessage = function($connection, $data)
{
    ...
    $group_con_map = []; // 全局群组到连接的映射数组
    $group_id = ...; // 根据获得值组合而成

    // 逻辑大概如下
    switch($data['cmd']) {
        case 'addGroup': // 加入对应组
            $message = [ // 加入成功或失败信息
                ...
            ];

            if (...) { // 加入失败
                ...
            } else {
                ...
                // 将连接加入到对应的组数组
                $group_con_map[$group_id]['con'][$con->id] = $con;
                ...
            }

            $con->send(json_encode($message));
            break;
        case 'getGroup': // 获取对应组购物车
            $cart = ...; // 数据库获取购物车
            $message = [
                'cart' => $cart,
                'lock' => $group_con_map[$group_id]['lock'], // 同时获取锁定状态
                ...
            ];

            $con->send(json_encode($message));
            break;
        case 'changeGroup': // 更改对应组购物车
            $message = [
                ...
            ];

            if (...) { // 更新数据库购物车失败
                ...

                $con->send(json_encode($message));
            } else {
                ...

                $con->send(json_encode($message)); // 回更新成功
                $message = [ // 发送对应组信息
                    ...
                ];

                // 通知待更新的群组的成员
                Channel\Client::publish('sendToGroup', [
                    'group_id' => $group_id,
                    'message' => $message,
                    'exclude' => $con->id,
                    'close' => 0
                ]);
            }
            break;
        case 'changeGroupLock': // 变更对应组锁定状态：0（解锁）/1（锁定）
            $group_con_map[$group_id]['lock'] = ...;

            if (1 == ...) { // 是锁定
                $message = [
                    ...
                ];

                // 通知待锁定的群组的成员
                Channel\Client::publish('sendToGroup', [
                    'group_id' => $group_id,
                    'message' => $message,
                    'exclude' => $con->id,
                    'close' => 0
                ]);
            }
            break;
        case 'exitGroup': // 退出对应组
            $group_con_map[$group_id]['lock'] = ...;
            $message = [
                ...
            ];

            ... // 删除数据库购物车

            // 通知待退出的群组的成员
            Channel\Client::publish('sendToGroup', [
                'group_id' => $group_id,
                'message' => $message,
                'exclude' => $con->id,
                'close' => 1
            ]);
            break;
        case 'heartbeat': // 心跳
            $con->lastMessageTime = $now;
            break;
    }
};
```

## 拼单购物车页面

根据情况建立连接。以下是使用 <a href="https://cn.vuejs.org/v2/guide/" target="_blank">Vue.js</a> 开发。

```JavaScript
...
methods: {
    ...
    webSocket () { // WebSocket 连接
        let vm = this
        if ('WebSocket' in window) {// 浏览器支持
            let sendMsg = {};
            // 线上与本地有区别
            vm.ws = new WebSocket('wss://' + location.host + ':...'); // 线上 https 需要一些处理（记不住了），使用 wss
            // vm.ws = new WebSocket('ws://' + location + ':...'); // 本地
            vm.ws.addEvenListener('open', () => { // 连接建立是加入对应组
                sendMsg = {
                    cmd: 'addGroup',
                    ...
                }
                vm.ws.send(JSON.stringify(sendMsg));
            }, false);
            vm.ws.addEvenListener('message', (e) => { // 客户端处理接收的服务端信息
                let data = JSON.parse(e.data);
                ...
            }, false);
            vm.ws.addEvenListener('err', (err) => { // 通信错误处理
                ...
            }, false);
            vm.ws.addEvenListener('close', () => { // 连接关闭处理
                ...
            }, false);
        } else {
            ...
        }
    },
    getInfo (...) { // 获取后台信息
        ...
        // 获取成功
        this.webSocket();
        ...
    },
    initPage () { // 初始化页面获取参数
        ...
        this.getInfo(...);
    },
    isCache (e) { // 是否浏览器缓存中读取
        ...
        if (e.persisted) {
            location.reload();
        } else {
            this.initPage();
        }
    },
},
created () {
    ...
    window.addEventListener('pageshow', this.isCache); // 解决ios返回不刷新问题
}
...
```

## 店铺首页

根据来源页，判断是多人拼单，还是正常下单，确认跳转下单还是回退拼单。

## 下单页

正常下单（非多人拼单）是不需要建立连接的，所以，在成功获取信息之后，判断来源页。

```JavaScript
...
methods: {
    ...
    webSocket () { ... },
    initPage () {
        let vm = this;
        ... // 成功获取信息
        if (document.referrer.indexOf(...) > -1) { // 判断来源页
            ...
            vm.webSocket();
            ...
        }
        ...
    },
    ...
},
...
```

## 关于数据同步流程

获取拼单购物车，合并用户购物车，同步拼单购物车，清空用户购物车。

## 关于锁定

功能是基于浏览器、多人，这点很糟心。你去下单了，我还在选购，这个时候就需要说明，就有了锁定（弹个遮罩层、提示窗）。

## 关于控制页面间的跳转

因为是网页，安卓的返回键，苹果的右滑都会直接返回到上一页，不确定性太强。加入 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/History_API" target="_blank">History API</a> 达到更好的体验，并且浏览历史变更之前还能发发数据什么的（解除锁定就是在下单者返回上一页的时候，发送通讯，通知相应组解锁）。

## 问题与猜想

并发高的时候，因为数据发送接收的时间差，会出现部分用户数据不正确，虽然刷新就好了，但是体验不好。

这个时候加入队列控制收发，可以解决上述问题。（这个还没弄出来就去弄小程序了，然后就辞职了。最主要的是，还没去研究呢╮(╯▽╰)╭）

