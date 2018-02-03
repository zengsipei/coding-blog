---
title: MySQL 更新多条记录的多个字段
date: 2017-12-28
tags: 后端,MySQL
description: MySQL 更新多条记录的多个字段
sort: 14
---

觉得不错便记录下来。

```MySQL
UPDATE `表` SET
`字段1` = (CASE `id`
    WHEN 1 THEN '001'
    WHEN 2 THEN '002'
    ...
END),
`字段2` = (CASE ...
    WHEN ... THEN ...
    WHEN ... THEN ...
    ...
END)
WHERE `id` IN (...);
```

据说 `WHERE` 部分虽然不影响代码执行，但是会提高运行效率。