---
title: 学习 PHP
date: 2018-01-26
tags: 后端,PHP
description: 学习 PHP
sort: 22
---

自己是个健忘的人，需要时常回去看看，促使自己不要忘记。

## 别人家

无意间看到的博客，还不错 <a href="http://blog.csdn.net/vitalewang/article/category/5790693" target="_blank">VitaleWang 的博客 > PHP</a>

## 记录

#### 1、逗号与点的区别

前者是拼接字符串，后者为分隔多个参数。（据说逗号比点要快）

验证 <a href="http://www.jb51.net/article/40306.htm" href="_blank">深入解析PHP中逗号与点号的区别</a>

#### 2、PDO 的 bindParam 与 bindValue 的区别

研究之后，发现，真·字面意思，前者将参数绑给占位符，后者是将值绑给占位符。（参数是可变的，而值是固定给的，这里为了区分变量 つ﹏⊂）

验证 <a href="https://segmentfault.com/a/1190000002968592" target="_blank">PDO 的 bindParam 与 bindValue 的区别</a> 。

PHP 手册其实也有说明，差别应该就是传值引用的问题。

#### 待更新。。。