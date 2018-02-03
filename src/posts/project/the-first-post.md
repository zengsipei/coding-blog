---
title: 谈谈首次搭建静态博客
date: 2017-12-17
tags: 前端,CSS,JavaScript
description: 谈谈首次搭建静态博客
sort: 1
---

国际惯例，哈哈哈。 `Hello World !`

## 首次写帖子

不知从何说起，就先谈谈为什么想搭个静态博客。

最主要的原因应该是辞职了，准备找个新工作。然后整理一下自己工作以来所学到、用到的。其次是以前没有过，又总觉得想尝试一下 Markdown。再就是想锻炼下自己的表达，怎么说，就是想打破那种「明明一肚子想法，却不知如何开口」的憋屈。

然而这个过程对于我这种「前端小白」+「英文渣」来说确实有点伤。

## 说到前端

虽然有粗略的去了解，却没有系统的去使用，工作使用的大都是框架，然后实在要写，都只是部分，不涉及到整体。这种情况上网查查，问问前端同事，很快就能搞定。

这次虽然也是拿 <a href="https://github.com/nshen/coding-blog" target="_blank">CodingBlog</a> 直接搭建的，但不得不说 「nshen」的看法我很赞同才用的，而不是随便看到就用起，使用的时候发现样式并不是很多，便根据自己的想法动手去改。

## Flex 弹性布局

参考：

* <a href="http://www.jianshu.com/p/9a504d3c18fc" target="_blank">Flex布局及在移动端的应用</a>（这个里面有阮一峰的教程链接，还有个小游戏，我就不再次引用了）
* <a href="http://www.runoob.com/w3cnote/flex-grammar.html" target="_blank">Flex 布局语法教程</a>（菜鸟我好像去的比较多，去参考其它，总觉名字与自己很搭）

<a href="https://github.com/nshen/coding-blog" target="_blank">CodingBlog</a> 本身是不采用 Flex 布局的，屏幕的兼容也做得很好了，但是还是想尝试下 Flex 布局，就在原来的基础上做了修改，将头部固定。

## CSS + JS 微动效

参考：

* <a href="http://isujin.com/" target="_blank">素锦</a>（参考的只有那个导航栏的标题淡入淡出，别的没学到，つ﹏⊂，还有里面的 Rainy 我很喜欢）
* <a href="https://www.cnblogs.com/libin-1/p/5836483.html" target="_blank">5种回到顶部的写法从实现到增强</a>（主要是参考的动画增强）

本来的 <a href="https://github.com/nshen/coding-blog" target="_blank">CodingBlog</a> 是没有自己写的 JS ，只有部分地方引用了两个。而我要多此一举的举动完全是个人喜好，就像我用 Flex 布局固定头部一样。我做了个回到顶部的微动效，毕竟一下上去太生硬，然后参考 ios 点击顶部回到顶部，将固定的头部标题拿来做回到顶部的触发，机智如我。当然相应的头部也加了写 CSS3 的过渡效果，不过最后在手机上看还是不怎么理想。

## 总结

看起来，搞了好几天只是弄了个不起眼的功能，但是学到了些东西还是聊表欣慰。
