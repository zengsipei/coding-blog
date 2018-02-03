---
title: 实现过的功能（十一）：微信扫码绑定
date: 2017-12-29
tags: 后端,PHP
description: 微信扫码绑定
sort: 16
---

用于微信用户扫码绑定对应店铺的管理账号（一次性使用）。

## 流程

* 创建账号
* 生成二维码
* 微信扫码绑定

## 生成二维码

使用的 <a href="/batch-qrcode">实现过的功能（一）：二维码批量生成及打包下载</a> 中提到的库

```PHP
$accId = ...; // 创建的账号 id
$shopId = ...;
$dir = '.../' . $shopId; // 每个店铺一个文件夹
$returnData = [
    'state' => 200,
    'message' => 'ok',
    'data' => []
];

if (is_dir($dir)) { // 是否有目录
    $filesArr = scandir($dir); // 遍历目录

    foreach ($filesArr as $v) {
        $fileAccId = explode('|', $v, -1);

        if ($fileAccId && Intval($fileAccId[0]) === $accId) {
            $returnData['data']['QRcode'] = trim($dir, '.') . '/' . $v;

            $this->response($returnData,'json',$returnData['state']); // ThinkPHP 的 RESTFul
            exit();
        }
    }
} else {
    mkdir($dir, 0777);
}

// 创建新二维码
...; // 引用库
$QRcode = new \QRcode();

// 生成二维码变量
$errorCorrectionLevel = 'L'; // 容错级别
$matrixPointSize = 15; // 生成图片大小
$margin = 1; // 边距
$mtRand = mt_rand(10000, 99999); // 随机5位数
$qrcodeId = $accId . '|' . $mtRand; // 组合
$url = '...' . $shopId . '/' . $qrcodeId; // 二维码链接
...

for ($i = 0; $i < 2; $i++) {

    if (0 == $i) { // 生成二维码
        // 这里是改过，见上方链接，不加 logo 就不用改，可以直接用完整文件名替换 false
        $QR = $QRcode->png($url, false, $errorCorrectionLevel, $matrixPointSize, $margin);
        ... // 这里加入 logo

        // 生成图片
        header('content-type: image/png'); // 输出图片格式为png
        imagepng($QR, $dir . '/' . $qrcodeId . '.png'); // 输出或保存到xxx
        imagedestroy($QR); // 销毁创建的图片
    } else {
        $saveQrcodeIdWhere['id'] = $accId;
        $saveQrcodeIdData = [
            'qrcode_id' => $qrcodeId
        ];

        $saveQrcodeId = M(...)
                        ->where($saveQrcodeIdWhere)
                        ->setField($saveQrcodeIdData);

        if ($saveQrcodeId === false) {
            $returnData['message'] = '保存二维码失败';
            @unlink($dir . '/' . $qrcodeId . '.png');
        } else {
            $returnData['data']['QRcode'] = trim($dir, '.') . '/' . $qrcodeId . '.png';
        }
    }
}

$this->response($returnData,'json');
exit();
```

## 微信扫码绑定

```PHP
$shopId = I('get.shopId',0,'intval');
$qrcodeId = I('get.qrcodeId','','htmlspecialchars');
$accId = explode('|', $qrcodeId, -1);
$userId = ...;

// 返回数据
$returnData = [
    'state' => 200,
    'message' => '绑定成功',
    'data' => []
];

if ($qrcodeId && $accId) {
    $accQrcodeWhere['id'] = $accId[0];

    $accQrcode = M(...)
                 ->where($accQrcodeWhere)
                 ->field('user_id,qrcode_id')
                 ->find();

    if ($accQrcode['user_id'] > 0) {
        $returnData['message'] = '二维码已失效';

        // $this->response($returnData,'json'); // 本来是准备写成 API
        echo '二维码已失效';
        exit();
    }
    if ($qrcodeId == $accQrcode['qrcode_id']) {
        $saveAccountWhere['id'] = $accId[0];
        $saveAccountData = [
            'user_id' => $userId,
            'qrcode_id' => ''
        ];

        $saveAccount = M(...)
                       ->where($saveAccountWhere)
                       ->setField($saveAccountData);

        if ($saveAccount === false) {
            $returnData['message'] = '绑定失败';

            echo '绑定失败';
            exit();
        } else {
            $dir = '.../' . $shopId;
            $filesArr = scandir($dir); // 遍历目录

            foreach ($filesArr as $v) {
                $qrcode = explode('.png', $v, -1);

                if ($qrcode && $qrcodeId === $qrcode[0]) { // 筛选文件
                    @unlink($dir.'/'.$v); // 删除二维码
                    break;
                }
            }

            redirect(...); // 绑定成功后跳转
            exit();
        }
    } else {
        $returnData['message'] = '二维码已失效';

        echo '二维码已失效';
        exit();
    }
```

## 完成

总的来说没什么难点，值得注意的是创建文件夹需要权限。