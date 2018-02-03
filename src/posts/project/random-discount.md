---
title: 实现过的功能（五）：随机立减
date: 2017-12-23
tags: 功能,后端,PHP
description: 随机立减
sort: 7
---

为了推广，提出的可控条件的随机立减需求。

## 随机的概率区间，随机的价格

结构大概如下。

```PHP
$rondomDis = [
    [
        'min' => ...,
        'max' => ...,
        'probability' => ..., // 概率
        ...
    ],
    ...
];
```

定义一个按概率随机获取区间的函数。

```PHP
/**
 * 获取随机的 key
 * @param  array $proArr 所有概率的数组
 * @return  key
 */
function getRandomKey($proArr) {
    $randomKey = '';

    // 概率数组的总概率精度
    $proSum = array_sum($proArr);

    // 概率数组循环
    foreach ($proArr as $k => $v) {
        $randNum = mt_rand(1, $proSum);

        if ($randNum <= $v) {
            $randomKey = $k;
            break;
        } else {
            $proSum -= $v;
        }
    }

    return $randomKey;
}
```

使用。

```PHP
...
$proArr = [];

foreach ($rondomDis as $k => $v) {
    $proArr[$k] = $v['probability'];
}

$randomKey = getRandomKey($proArr);
$randomArr = $randomDis[$randomKey]; // 获取到的区间数组
$randomPrice = mt_rand($random['min'] * 100,$random['max'] * 100) / 100; // 随机立减价格
...
```
