# 蒙外贸科技官网

这是一个支持中文 / 蒙古文切换的外贸官网，前台和后台共用 Vercel Postgres 数据库。

## 线上访问

部署后可通过你的 Vercel 域名访问：

- 首页：`/`
- 后台：`/admin`

## 部署前准备

1. 在 Vercel 项目中绑定 Postgres 数据库
2. 设置环境变量：
   - `POSTGRES_URL`
   - 或 `DATABASE_URL`
   - `ADMIN_PASSWORD`
3. 部署项目
4. 首次部署后访问 `/api/init` 初始化默认数据

## 文件说明

- `index.html`：前台官网
- `admin.html`：后台管理
- `data.js`：前后台数据访问层
- `api/`：服务端接口
- `vercel.json`：路由配置

## 后台密码

默认初始化口令为 `mongol-admin-2026`，建议部署后立刻修改 `ADMIN_PASSWORD`。
