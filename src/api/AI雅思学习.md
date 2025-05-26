---
title: AI雅思学习
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# AI雅思学习

Base URLs:

# Authentication

# 用户

## POST 注册接口

POST /user/register

> Body 请求参数

```json
{
  "password": "123456",
  "username": "admin"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 否 |none|
|password|query|string| 否 |none|
|body|body|object| 否 |none|
|» email|body|string| 是 |none|
|» password|body|string| 是 |none|
|» username|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 登录接口

POST /user/login

> Body 请求参数

```json
{
  "password": "123456",
  "username": "admin"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 否 |none|
|password|query|string| 否 |none|
|body|body|object| 否 |none|
|» password|body|string| 是 |none|
|» username|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 修改密码

POST /user/password

> Body 请求参数

```json
{
  "article_id": 56,
  "correct_count": 8,
  "course_id": 12,
  "exercise_count": 10,
  "mastered_count": 15,
  "study_time_minutes": 45,
  "study_type": "vocabulary",
  "word_count": 20
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» new_password|body|string| 是 |none|
|» old_password|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 更新当前登录用户的个人资料信息

POST /user/profile

> Body 请求参数

```json
{
  "article_id": 56,
  "correct_count": 8,
  "course_id": 12,
  "exercise_count": 10,
  "mastered_count": 15,
  "study_time_minutes": 45,
  "study_type": "vocabulary",
  "word_count": 20
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» email|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取用户信息

GET /user/info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取用户学习记录历史

GET /user/history

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|limit|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取用户的学习统计数据

GET /user/statistics

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 用户学习统计数据更新请求

POST /user/statistics

> Body 请求参数

```json
{
  "article_id": 56,
  "correct_count": 8,
  "course_id": 12,
  "exercise_count": 10,
  "mastered_count": 15,
  "study_time_minutes": 45,
  "study_type": "vocabulary",
  "word_count": 20
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|limit|query|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» article_id|body|integer| 是 |none|
|» correct_count|body|integer| 是 |none|
|» course_id|body|integer| 是 |none|
|» exercise_count|body|integer| 是 |none|
|» mastered_count|body|integer| 是 |none|
|» study_time_minutes|body|integer| 是 |none|
|» study_type|body|string| 是 |none|
|» word_count|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 单词

## GET 获取用户单词状态

GET /word/status

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|word_id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 更新单词状态

POST /word/status

> Body 请求参数

```json
{
  "status": 0,
  "wordId": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» status|body|integer| 是 |none|
|» wordId|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取所有单词

GET /words

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|word_id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取词汇学习进度

GET /vocabulary/progress

> Body 请求参数

```json
{
  "status": 0,
  "wordId": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|query|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 保存词汇学习进度

POST /vocabulary/progress

> Body 请求参数

```json
{
  "status": 0,
  "wordId": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» course_id|body|integer| 是 |none|
|» words|body|[object]| 是 |none|
|»» ease_factor|body|number| 否 |none|
|»» interval|body|integer| 否 |none|
|»» next_review_at|body|string| 否 |none|
|»» review_count|body|integer| 否 |none|
|»» status|body|integer| 否 |none|
|»» word_id|body|integer| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 单元

## GET 获取所有学习单元

GET /unit/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取单元详情

GET /unit/detail

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|unit_id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取单元进度

GET /unit/progress

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|unit_id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取单元单词列表

GET /unit/words

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|unit_id|query|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

