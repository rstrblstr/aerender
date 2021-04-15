
## 简介
该项目是pcg变形金刚系统服务端代码

## 运行要求
- node v14
- mysql v8
- typescript v4

## 调试配置
- npm 调试ts项目
`npm run dev`

- 调试编译后的js文件
`npm run build`
`npm run start`

不用``npm run build`是为了避免流水线上的冲突（蓝盾trpc部署原子那里好像会出问题）

- vsc调试
> 推荐配置vscode的launch.json文件，方便快速启动，配置如下

```js
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "debug-js",
      "program": "${workspaceFolder}/build/index.js",
      "env": {
        "NODE_PATH": "${workspaceFolder}/build/",
        "IS_LOCAL_MODE": "true"
      }
    },
    {
      "name": "debug",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "outFiles": ["${workspaceFolder}/build/**/*.js"],
      "env": {
        "NODE_PATH": "${workspaceFolder}/build",
        "IS_LOCAL_MODE": "true"
      }
    }
  ]
}
```

## 词汇表
- IR (Information Retrieval)
