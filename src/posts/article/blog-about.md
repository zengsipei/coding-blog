---
title: 搭博客学到的东西
date: 2017-12-18
tags: 前端,CSS,JavaScript
description: 搭博客学到的东西
sort: 2
---

记一下修改、用到、学到的一些东西。

## 记 CSS

* 全屏
* 固定头部及自适应
* 惯性滚动
* 隐藏滚动条

所有内容都在一个容器中，这是我认为挺好的一个东西，大家也都没有提，我这种前端半吊子，刚毕业的时候都是直接在 body 里面直接写，一堆 div ，之后接触到各种，才发觉先给定一个包含所有内容的容器挺方便。修改之后的布局如下图。

![layout](/image/blog-about/layout.png)

首先占满全部。

```CSS
html,body {
    height: 100%;
}
```

之后包含所有内容的 DIV 才能占满全部。

```CSS
#container {
    ...
    display: -webkit-flex;
    display: flex;
    flex-direction: column; /* 纵向排列 */
    height: 100%;
    ...
}
```

header 定高，main 自适应就完成了头部固定，滚动整个 main 容器，再加上 ios 惯性滚动。（惯性滚动时和 JS 的回到顶部有点小毛病。。。）

```CSS
#main {
    ...
    flex: 1; /* 自适应 */
    overflow-y: auto; /* 滚动 */
    -webkit-overflow-scrolling: touch; /* ios 惯性滚动 */
    ...
}
```

最后隐藏滚动条。

```CSS
#main::-webkit-scrollbar {
    display: none;
}
```

## 记 JS

* 滚动监听
* 回到顶部

因为 Flex 的原因，滚动变成了 main 容器，于是有些地方需要注意。

```JavaScript
let main = document.getElementById("main");
let offsetTop = main.offsetTop; // 这个值，也就是 main 的顶部离顶部的距离了

main.onscroll = function () { // 滚动监听的是 main 容器
    ...

    if (main.scrollTop > offsetTop) { // 滚动了大概一个 header 的高度，做处理
        ...
    } else {
        ...
    }
}
```

返回顶部有个过程，不要那么突兀。

```JavaScript
let timer = null;
let goTop = document.getElementById('change_title'); // 这个是标题

goTop.onclick = function () {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {

        if (main.scrollTop > 0) {
            main.scrollTop = main.scrollTop - 50; // 每次减 50
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}
```