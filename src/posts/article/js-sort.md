---
title: 数组及对象的排序
date: 2017-12-23
tags: 功能,前端,JavaScript
description: 数组及对象排序
sort: 8
---

最近使用到了，觉得不错，记录。

## 数组排序 sort

<a href="http://www.w3school.com.cn/jsref/jsref_sort.asp" target="_blank">sort() 方法</a>（这个比较容易懂）

## 按对象的指定属性排序

大概的结构如下。

```JavaScript
let arr = [
    {
        ...
        'sort': 4,
        ...
    },
    {
        ...
        'sort': 2,
        ...
    },
    ...
];
```

#### 第一种方法

```
// 定义比较器
function compare(propertyName) {

    // 定义排序方式
    return function (object1, object2) {
        let value1 = object1[propertyName];
        let value2 = object2[propertyName];

        return value1 - value2;
    }
}

// 使用
arr.sort(compare('sort'));
```

#### 第二种方法

有点毛病，没有细究，推荐第一种。

```JavaScript
for (let j = 1;j < arr.length;j++) {
    let sort = arr[j].sort;
    let i = j - 1; // 上一个指标

    while (i > -1 && arr[i].sort > sort) {
        arr[i + 1].sort = arr[i].sort;
        i = i - 1; // i 可能等于 -1 ，上方需限制条件
    }
    arr[i + 1].sort = sort;
}
```

原理应该都是两两比较，按情况决定是否交换位置。
