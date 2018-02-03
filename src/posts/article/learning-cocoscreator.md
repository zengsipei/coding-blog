---
title: 学习 Cocos Creator
date: 2018-01-20
tags: 游戏,JavaScript
description: 学习 Cocos Creator
sort: 20
---

前段时间看 MySQL 有点打瞌睡，便找了个自己感兴趣的来玩玩。（当然是游戏）

## Cocos Creator

* <a href="http://docs.cocos.com/creator/manual/zh/" target="_blank">手册文档</a>
* <a href="http://docs.cocos.com/creator/api/zh/" target="_blank">API</a>
* <a href="http://forum.cocos.com/" target="_blank">论坛</a>

## 开整

其实有毛毛看一遍官方的文档、视频、例子（大概有一周的样子），然而（╮(╯▽╰)╭）整个人还是懵的。

虽然 <a href="http://docs.cocos.com/creator/manual/zh/" target="_blank">手册文档</a> 和 <a href="http://docs.cocos.com/creator/api/zh/" target="_blank">API</a> 都有了，新手还是会没有头绪。于是将时间转移到实践上，然后在 <a href="http://forum.cocos.com/" target="_blank">论坛</a> 找到一个 <a href="http://forum.cocos.com/t/creator/44782" target="_blank">汇总贴</a> ，跟着老司机的教学进行练习。

看一遍视频，自己做一遍，不懂的函数或方法，对比查文档及`API`，感觉棒棒哒。

## 记录

#### 1、键盘事件

<a href="https://github.com/cocos-creator/creator-docs/issues/256" target="_blank">玩家输入事件和 EventListener 的键盘事件的疑问</a>（官方已解答）。

#### 2、直接访问

节点（`node`）可以直接通过 `this.node.xxx` 访问属性（`position`,`x`,`y`,...），而预置资源（`Prefab`）不能（其实属性 `data` 下面有）。

#### 3. 关于坐标定位

一般结构：画布（`Canvas`） > 节点（`node`） > ... ，画布是从起始坐标（0,0）开始，锚点（`Anchor`）为基准点（可调节）。其它子节点的锚点与画布锚点成同心，以画布锚点为起始坐标（0,0），而不是画布的起始坐标（0,0）。（自己也不知道在说什么。。。）

![大概](/image/learning-cocoscreator/probably.png)

上图的画布位置（`position`）（250,250），节点的位置（0,0）

## 待更新。。。