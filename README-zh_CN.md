<div align="center"><a name="readme-top"></a>
<img height="180" src="https://cdn.qnets.cn/logo.svg" />
<h1 style="margin-top: 1.5rem">Qnets 轻动漫</h1>

Qnets 轻动漫后台管理系统, 基于 React 实现

[English](./README.md) · 中文

</div>

## 简介

-   前后台分离式开发，本项目仅为后台管理系统。前台详见 [qnets-anime](https://github.com/hzh11012/qnets-anime)，服务端详见 [qnets-anime-koa2](https://github.com/hzh11012/qnets-anime-koa2)
-   本项目几乎借助于 `shadcn/ui` 这个优秀的 UI 组件库，主打简约风格。
-   登录服务由 [qnets-sso](https://github.com/hzh11012/qnets-sso)、[qnets-sso-koa2](https://github.com/hzh11012/qnets-sso-koa2) 提供支持，用户只需要登录一次就可以访问所有Qnets的项目。

### 实现功能

-   [ ] 仪表盘：直观展示整个项目的各项数据信息
-   [x] 新番导视：管理每周的新番更新
-   [x] 轮播图：管理前台首页的大屏轮播图
-   [x] 公告：管理前台的系统公告通知
-   [x] 留言：管理前台的用户留言信息
-   [x] 视频：管理视频相关信息
    -   [x] 系列管理
    -   [x] 视频管理
        -   [x] 视频详情
    -   [x] 分类管理
    -   [x] 弹幕管理
-   [x] 用户：管理用户相关信息
    -   [x] 用户管理
    -   [x] 收藏管理
    -   [x] 评分管理
-   [ ] 评论：
    -   [ ] 评论详情
-   [ ] 设置：暂定

### 技术栈

-   基于 `npm create vite` 后的配置

    -   react v18 (`hooks` + `zustand` + `react-router v6`)
    -   shadcn/ui UI 组件库
    -   zod 规则校验
    -   i18next 国际化
    -   tailwind 样式
    -   eslint + prettier 格式化

## 项目结构

### 目录结构

```js
│
└─src
   ├─apis               // 接口
      ├─models          // 接口类型定义
      └─...
   ├─components         // 组件
      ├─custom          // 自定义组件
      ├─layout          // 布局组件
      └─ui              // shadcn/ui组件
   ├─context
   ├─hooks              // 自定义hooks
   ├─img                // 图片
   ├─lib                // 工具包
   ├─locale             // 国际化
   ├─pages              // 页面
   ├─store              // 状态
   ├─style              // 全局样式
   ├─  layout.tsx       // 布局框架
   ├─  links.tsx        // 菜单定义
   ├─  main.tsx         // 主入口
   ├─  routes.tsx       // 路由定义
   └─...
```

## 配置

> 仅列举需要修改的部分

### `lib/config.ts` 文件

```ts
// 登录地址 需修改为部署/本地qnets-sso服务的地址
const LOGIN_URL = '//localhost:5173';
// PHP弹幕播放器 需修改为部署/本地PHP弹幕播放器服务的地址
const PLAYER_BASE_URL = '//localhost:8888';
```

### `vite.config.ts` 文件（开发环境）

```ts
...
server: {
   ...
   // 这里配置了代理，需要配合后端的set-cookie的domain，例如localhost.qnets.cn
   host: '0.0.0.0',
   proxy： {
      '/v1': {
         // 项目接口地址 需修改为部署/本地qnets-anime-koa2服务的地址
         target: 'http://localhost:5200'
         ...
      },
      '/auth': {
         // 认证接口地址 需修改为部署/本地qnets-sso-koa2服务的地址
         target: 'http://localhost:4800'
         ...
      }
   }
   ...
}
...
```

### `lib/refresherRequest.ts` 文件（开发环境）

这里需要

```ts
...
await this.request({
    url,
    method: 'post',
    headers: {
        Authorization: token,
        // headers需要添加 x-forwarded-for，ip地址需要与后端认证服务qnets-sso-koa2中获取的地址相同，否则7天免登录会失效
        'x-forwarded-for': '0.0.0.0'
    }
});
...
```

## 快速开始

```bash
$ git clone https://github.com/hzh11012/qnets-anime-admin.git

## 安装依赖以及开启开发模式
$ yarn
$ yarn dev

## 安装依赖以及开启开发模式 注意必须先配置好server端
## 可参考 https://github.com/hzh11012/qnets-anime-koa2

## 打包
$ yarn build
```

## 星历史

[![Star History Chart](https://api.star-history.com/svg?repos=hzh11012/qnets-anime-admin&type=Date)](https://star-history.com/#hzh11012/qnets-anime-admin)

## 贡献者

<a href="https://github.com/hzh11012/qnets-anime-admin/graphs/contributors"><img src="https://contrib.rocks/image?repo=hzh11012/qnets-anime-admin"></a>

## 许可证

[MIT](https://github.com/hzh11012/qnets-anime-admin/blob/master/LICENSE)
