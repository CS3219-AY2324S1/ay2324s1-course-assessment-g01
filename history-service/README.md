# Prerequisites

Before you begin, ensure you have installed:

- Go
- Docker

## Instructions to initialize PostgreSQL database and history-service

1. Open Docker.
2. Run docker compose command from the root directory. After the container is up, the database will be listening on [http://localhost:5001](http://localhost:5001)
3. After the container is up, the history service will be listening on [http://localhost:3008](http://localhost:3008)

```bash
docker compose up -d
```

## Using the history service

### Get user attempts by user id

**Get <http://localhost:3008/api/v1/history/attempt?userId=1>**

Response:

```json
[
    {
        "attempt": {
            "attempt_id": 2,
            "question_id": "654b630f82d418c41d5734e4",
            "user_id": 1,
            "code": "print('bye world')",
            "language": "python",
            "passed": true,
            "attempted_on": "2023-11-08 18:39:01"
        },
        "question": {
            "_id": "654b630f82d418c41d5734e4",
            "title": "Path Crossing",
            "complexity": "Easy",
            "description": "<p>Given a string <code>path</code>, where <code>path[i] = &#39;N&#39;</code>, <code>&#39;S&#39;</code>, <code>&#39;E&#39;</code> or <code>&#39;W&#39;</code>, each representing moving one unit north, south, east, or west, respectively. You start at the origin <code>(0, 0)</code> on a 2D plane and walk on the path specified by <code>path</code>.</p>\n\n<p>Return <code>true</code> <em>if the path crosses itself at any point, that is, if at any time you are on a location you have previously visited</em>. Return <code>false</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/06/10/screen-shot-2020-06-10-at-123929-pm.png\" style=\"width: 400px; height: 358px;\" />\n<pre>\n<strong>Input:</strong> path = &quot;NES&quot;\n<strong>Output:</strong> false \n<strong>Explanation:</strong> Notice that the path doesn&#39;t cross any point more than once.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/06/10/screen-shot-2020-06-10-at-123843-pm.png\" style=\"width: 400px; height: 339px;\" />\n<pre>\n<strong>Input:</strong> path = &quot;NESWW&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Notice that the path visits the origin twice.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= path.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>path[i]</code> is either <code>&#39;N&#39;</code>, <code>&#39;S&#39;</code>, <code>&#39;E&#39;</code>, or <code>&#39;W&#39;</code>.</li>\n</ul>\n",
            "categories": [
                "Hash Table",
                "String"
            ]
        }
    }
]
```

### Add user attempt

**Post <http://localhost:3008/api/v1/history/attempt>**

Request:

```json
{
    "question_id": "654b152092f121fca77b623f", // string
    "user_id": 1, // uint
    "code": "print('hello world')",
    "language": "python", // python, javascript, java, c, c++, c#
    "passed": true, // failed - false, passed - true
}
```

Response:

```json
{
    "question_id": "654b152092f121fca77b623f", // string
    "user_id": 1, // uint
    "code": "print('hello world')",
    "language": "python", // python, javascript, java, c, c++, c#
    "passed": true, // failed - false, passed - true
    "attempted_on": "2023-11-12 15:32:25"
}
```

### Get user collaboration by user id

**Get <http://localhost:3008/api/v1/history/collaboration?userId=1>**

Response:

```json
[
    {
        "collaboration": {
            "room_id": 1,
            "question_id": "654b630f82d418c41d5734e4",
            "user_a_id": 1,
            "user_b_id": 2,
            "created_on": "2023-11-08 18:50:29"
        },
        "question": {
            "_id": "654b630f82d418c41d5734e4",
            "title": "Path Crossing",
            "complexity": "Easy",
            "description": "<p>Given a string <code>path</code>, where <code>path[i] = &#39;N&#39;</code>, <code>&#39;S&#39;</code>, <code>&#39;E&#39;</code> or <code>&#39;W&#39;</code>, each representing moving one unit north, south, east, or west, respectively. You start at the origin <code>(0, 0)</code> on a 2D plane and walk on the path specified by <code>path</code>.</p>\n\n<p>Return <code>true</code> <em>if the path crosses itself at any point, that is, if at any time you are on a location you have previously visited</em>. Return <code>false</code> otherwise.</p>\n\n<p>&nbsp;</p>\n<p><strong class=\"example\">Example 1:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/06/10/screen-shot-2020-06-10-at-123929-pm.png\" style=\"width: 400px; height: 358px;\" />\n<pre>\n<strong>Input:</strong> path = &quot;NES&quot;\n<strong>Output:</strong> false \n<strong>Explanation:</strong> Notice that the path doesn&#39;t cross any point more than once.\n</pre>\n\n<p><strong class=\"example\">Example 2:</strong></p>\n<img alt=\"\" src=\"https://assets.leetcode.com/uploads/2020/06/10/screen-shot-2020-06-10-at-123843-pm.png\" style=\"width: 400px; height: 339px;\" />\n<pre>\n<strong>Input:</strong> path = &quot;NESWW&quot;\n<strong>Output:</strong> true\n<strong>Explanation:</strong> Notice that the path visits the origin twice.</pre>\n\n<p>&nbsp;</p>\n<p><strong>Constraints:</strong></p>\n\n<ul>\n\t<li><code>1 &lt;= path.length &lt;= 10<sup>4</sup></code></li>\n\t<li><code>path[i]</code> is either <code>&#39;N&#39;</code>, <code>&#39;S&#39;</code>, <code>&#39;E&#39;</code>, or <code>&#39;W&#39;</code>.</li>\n</ul>\n",
            "categories": [
                "Hash Table",
                "String"
            ]
        }
    }
]
```
