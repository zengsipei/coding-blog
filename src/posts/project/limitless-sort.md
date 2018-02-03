---
title: 实现过的功能（十三）：无限分类
date: 2018-01-13
tags: 后端,PHP
description: 无限分类
sort: 19
---

写 Auth 权限的时候有写过规则，然后有个比较粗糙的无限分类。

## 表结构

主要 id ，pid（父 id ，0 为顶级），status（0「禁用中」/ 1「启用中」），...

## 实现

使用的 ThinkPHP 3.2 。

```PHP
public function ... () {
    $authWhere = ...;

    // 查询权限
    $auth = M('auth_rule')
            ->where($authWhere)
            ->field('id,pid,...')
            ->select();

    $auth = $this->tree($auth); // 权限数据重组
    $auth = $this->authHtml($auth); // 当时是用的 MVC 的视图展示，为了方便就后端生成了。

    $this->assign('auth',$auth);
    $this->display();
}
```

权限数据重组。

```PHP
private function tree($data, $pkey = 'pid', $pid = 0) {
    $result = [];

    foreach ($data as $dk => $v) {

        if ($v[$pkey] == $pid) {
            unset($data[$dk]);
            $v['children'] = $this->tree($data, $pkey, $v['id']); // 遍历出子权限

            if (empty($v['children'])) {
                unset($v['children']);
            }
            unset($v['pid']);
            $result[] = $v;
        }
    }

    return $result;
}
```

生成前端。（以前用的 <a href="http://www.semantic-ui.cn/modules/accordion.html" target="_blank">Semantic UI > 折叠菜单</a>）

```PHP
private function authHtml($auth, $authHtml = '') {
    $flag = $authHtml == '' ? 0 : 1;

    if (empty($auth)) {
        return $authHtml;
    }

    foreach ($auth as $v) {

        if ($flag) { // 顶级权限
            $authHtml .= '<div class="title"><i class="dropdown icon"></i>' . $v['title'] . '</div>';
            $authHtml .= '<div class="content"><a class="ui small button" href="' . U('...',['id'=>$v['id']]) . '">修改</a>';

            if ($v['status']) {
                $authHtml .= '<button class="ui small red button enabledright" type="button" rid="' . $v[ 'id'] . '" status="' . $v['status'] .'">禁用</button>';
            } else {
                $authHtml .= '<button class="ui small green button enabledright" type="button" rid="' . $v[ 'id'] . '" status="' . $v['status'] .'">启用</button>';
            }
            if ($v['children']) {
                $authHtml .= '<div class="accordion">';
                $authHtml = $this->authHtml($v['children'],$authHtml);
                $authHtml .= '</div>';
            }
            $authHtml .= '</div>';
        } else {
            $authHtml .= '<div class="title"><i class="dropdown icon"></i>' . $v['title'] . '</div>';
            $authHtml .= '<div class="content"><a class="ui small button" href="' . U('...',['id'=>$v['id']]) . '">修改</a>';

            if ($v['status']) {
                $authHtml .= '<button class="ui small red button enabledright" type="button" rid="' . $v[ 'id'] . '" status="' . $v['status'] .'">禁用</button>';
            } else {
                $authHtml .= '<button class="ui small green button enabledright" type="button" rid="' . $v[ 'id'] . '" status="' . $v['status'] .'">启用</button>';
            }
            if ($v['children']) {
                $authHtml .= '<div class="accordion">';
                $authHtml = $this->authHtml($v['children'],$authHtml);
                $authHtml .= '</div>';
            }
            $authHtml .= '</div>';
        }
    }

    return $authHtml;
}
```

## 最后样子

![预览](/image/limitless-sort/preview.png)