---
title: 实现过的功能（四）：变更显示的顺序
date: 2017-12-22
tags: 功能,后端,PHP
description: 变更显示的顺序
sort: 6
---

变更分类中商品的显示顺序，以及变更分类的显示顺序，其实道理差不多。

## 更新排序

对于以前没有排序的，要先更新排序。

```PHP
...
$goods = M('goods')
         ->field('id,shop_id')
         ->order('id')
         ->select();
$newGoods = [];

foreach ($goods as $v) {
    $newGoods[$v['shop_id']][] = $v['id'];
}
$updateGoodsSql = "UPDATE `goods` SET `sort` = (CASE `id`";

foreach ($newGoods as $k => $v) {

    foreach ($v as $vk => $vv) {
        $updateGoodsSql .= " WHEN " . $vv . " THEN " . $vk;
    }
}
$updateGoodsSql .= " END) WHERE `id` IN (" . implode(',',array_column($goods, 'id')) . ")";

$updateGoods = M()->execute($updateGoodsSql);
...
```

## 上移

目前只用了循环上移（第一项上移成为最后一项），操作项与上一项交换顺序。如果加下移的话，还不如弄成任意拖动位置。（以前急着要，没研究）

```PHP
// 使用的 ThinkPHP 框架
// 上移分类中的商品显示顺序
...
$gid  = ...; // 上移商品
$sort  = ...; // 上移商品原排序
$gid2 = ...; // 上移商品的上一项
$sort2 = ...; // 上移商品的上一项原排序
$typeId  = ...; // 上移类型：0（非第一项上移）/1（第一项上移）
$shopId = ...; // 店铺标识
$goodsIds = $gid . "," . $gid2;

$updateGoodsSortSql = "UPDATE `goods` SET `sort` = (CASE `id`";

if ($typeId == 1) {
    $goodsSortWhere['shop_id'] = $shopId;
    $goodsSortWhere['type_id'] = $typeId;

    $goodsSort = M('goods')
                 ->where($goodsSortWhere)
                 ->field('id,sort')
                 ->order('sort')
                 ->select();
    $goodsIds = implode(',', array_column($goodsSort, 'id'));

    foreach ($goodsSort as $k => $v) {
        $updateGoodsSortSql .= " WHEN " . $v['id'] . " THEN ";

        if ($k != 0) {
            $updateGoodsSortSql .= $goodsSort[$k-1]['sort'];
        } else {
            $updateGoodsSortSql .= $goodsSort[count($goodsSort)-1]['sort'];
        }
    }
} else {
    $updateGoodsSortSql .= " WHEN " . $gid . " THEN " . $sort2;
    $updateGoodsSortSql .= " WHEN " . $gid2 . " THEN " . $sort;
}
$updateGoodsSortSql .= " END) WHERE `id` IN (" . $goodsIds . ")";

$updateGoodsSort = M()->execute($updateGoodsSortSql);
...
```

## 变更分类

变更分类的显示顺序和上面就类似了。

## 任意拖动位置（想法）

前端排列好需要的顺序，然后把顺序与标识传入后端，更新数据库。