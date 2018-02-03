---
title: 实现过的功能（一）：二维码批量生成及打包下载
date: 2017-12-19
tags: 功能,后端,PHP,前端,CSS,JavaScript
description: 二维码批量生成及打包下载
sort: 3
---

以前公司的需求，需要前端和后端方式。

## 后端 PHP 实现

* <a href="http://phpqrcode.sourceforge.net/" target="_blank">PHPQrcode</a> 库（网上找的，有挺多例子，没细看）

简单描述是循环生成到临时文件夹再将文件夹打包下载。先设置一下超时时间（以前超时过，生成太多了，又没有 loading 之类的明显提示，感觉很懵）。

```PHP
ini_set('max_execution_time', '0');
```

创建临时文件夹（需要权限的，可以再次判断下确认）。

```PHP
$dir = ...;

if (!is_dir($dir)) {
    mkdir($dir,0777);
}
```

生成和下载其实是不怎么相关的两个，要同时使用，用的是个笨办法，循环两次，第一次生成，第二次下载。

```PHP
for ($i = 0;$i < 2;$i++) { // 随意用了个计数循环

    if (0 === $i) { // 生成
        ...
    } else { // 下载
        ...
    }
}
```

#### 纯二维码

需要不同二维码图片，根据情况（需要生成多少）循环生成保存到临时目录就好。

```PHP
... // 引入库
$QRcode::png(..., $dir, ...); // 假如生成 png
...
```

完成之后将临时文件夹打包下载。

```PHP
...
$zip = new \ZipArchive();
$file_name = ...; // 需下载压缩包文件

if ($zip->open($filename, ZIPARCHIVE::CREATE ) === TRUE) {
    $handler = opendir($dir);

    while (($addfile = readdir($handler)) !== false) {

        if ($addfile != "." && $addfile != "..") { // 文件夹文件名字为'.'和'..'，不要对他们进行操作

            if (!is_dir($dir . "/" . $addfile)) { // 将文件加入zip对象并重命名
                $zip->addFile($dir . "/" . $addfile, $addfile);
            }
        }
    }
    @closedir($path); // 关闭文件夹
    $zip->close(); // 关闭处理的zip文件
}
$filesize = filesize($filename);

header("Cache-Control: max-age=0");
header ("Content-Description: File Transfer" );
header ('Content-disposition: attachment; filename=' . basename($filename)); // 文件名
header("Content-Type: application/download");
header("Content-Type: application/force-download");
header("Content-Type: application/zip" ); // zip格式
header("Content-Transfer-Encoding: binary" ); // 告诉浏览器，这是二进制文件
header('Content-Length: ' . $filesize ); // 告诉浏览器，文件大小
header("Content-Range: 0-" . ($filesize - 1) . "/" . $filesize); // 下载进度条
readfile($filename); // 输出创建的文件
@unlink($filename); // 删除创建的文件
deldir($dir); // 删除临时目录
...
```

#### 有模板

如下图所示，有统一的模板，只是需要不同的二维码。

![example](/image/batch-qrcode/example.png)

和第一种流程类似，不过需要修改一下 <a href="http://phpqrcode.sourceforge.net/" target="_blank">PHPQrcode</a> 扩展的对应源码。

```PHP
// 假如使用的是 QRcode::png(...)
// 需要修改扩展的 QRimage 类下的 png 方法
public static function png($frame, $filename = false, $pixelPerPoint = 4, $outerFrame = 4,$saveandprint=FALSE) {
    $image = self::image($frame, $pixelPerPoint, $outerFrame);

    return $image; // 直接将二维码图片返回
    // 以下原版
    // if ($filename === false) {
    //     Header("Content-type: image/png");
    //     ImagePng($image);
    // } else {
    //     if($saveandprint===TRUE){
    //         ImagePng($image, $filename);
    //         header("Content-type: image/png");
    //         ImagePng($image);
    //     }else{
    //         ImagePng($image, $filename);
    //     }
    // }

    // ImageDestroy($image);
}
```

将二维码放到模板所需的位置上，输出文件保存到临时文件夹。

```PHP
... // 引入库
$QR = $QRcode::png(...); // 上面修改的 png 返回的二维码图像
...
$im = imagecreatefrompng(...); // 根据模板图片（假设 png 格式）创建一张图像
imagecopyresampled($im, $QR, ...); // 固定二维码大小及位置
...

header('content-type: image/png'); // 最终输出图片格式为 png
imagepng($im, ...); // 输出或保存到相应位置
imagedestroy($im); // 销毁创建的图片
```

## 前端 CSS + JS 实现

* JSQRcode （网上找的，大家都是类似的）

这个有点记不住了，描述需求产生的大概和实现思路。

#### 需求产生

还是模板，不过变成了二维码可拆卸的那种模板，因此就只需要批量二维码了。虽然 PHP 已经实现了批量，但是最后结果是一张一张的二维码。这次的需求则是，批量二维码并排好版，然后直接可以打印。

#### 思路

利用 CSS 的打印样式，和 JS 的 `window.print()` 完成。
