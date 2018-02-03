---
title: 重装 Windows 10 的坎坷之旅
date: 2017-12-25
tags: Windows
description: 重装 Windows 10 的坎坷之旅
sort: 9
---

大概用掉了两天左右，整理一下成功之路。

## 重装的起因

买不起正版，又有强迫症想要永久激活，而不是无限 180 天循环激活（不想看弹窗）。还有就是以前给老爸的笔记本最近总是提示他激活过期，然后他就找我了。这次重装也是为了探探路。

## 官方提供的免费升级服务

* <a href="http://www.microsoft.com/zh-cn/accessibility/windows10upgrade" target="_blank">面向使用辅助技术的客户的 Windows 10 升级</a>（2017 年 12 月 31 日结束）

## 过程（理论上）

* 下载 Windows 7 旗舰版镜像
* 重装 Windows 7 旗舰版
* 升级 Windows 10

## 那么问题来了

在 <a href="https://msdn.itellyou.cn/" target="_blank">MSDN, 我告诉你</a> 上面下载的 Windows 7 旗舰版镜像没有驱动。（经过各种安装失败之后的悲伤体验，还有好像也不支持 USB 3.0 ，最后去网上随便搜了一个）

Windows 7 旗舰版激活失败。（最后发现是因为 UEFI + GPT 安装导致的）

Windows 7 旗舰版激活成功后（网上找的 GPT 安装激活），使用上面提到的官方提供的升级辅助，总是提示没有激活。

## 正确姿势（自己使用的方法）

* PE 中将硬盘重分区为 MBR
* MBR 下安装 Windows 7 旗舰版
* 永久激活
* 使用官方提供的升级辅助
* 升级成功后 Windows 10 绑定 Microsoft 账号（获得与账户关联的数字许可证激活）
* PE 中将硬盘转为 GPT

需要注意，重分区会清空硬盘数据，MBR 启动需要修改 BIOS 相关。

## 猜想

因为辅助升级马上就要结束了，那以后不能使用这种方式，但是。

仔细看了下 <a href="https://support.microsoft.com/zh-cn/help/12440/windows-10-activation" target="_blank">Windows 10 中的激活</a> ，第四个数字许可证。衍生了一些想法（没实践）。

将上面的「使用官方的升级辅助」这一步换成安装 <a href="https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewiso" target="_blank">Windows Insider Preview</a>（需要注册加入内部体验），是不是也能成功呢？
