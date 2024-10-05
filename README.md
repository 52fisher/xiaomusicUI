# xmusic 前端页面

这是一个基于xiaomusic 的使用Vue.js的前端页面，用于展示小爱音箱的操控面板。页面包括设备控制、播放列表、账号设置和设置等功能。
![图片](https://github.com/user-attachments/assets/f52f829a-1851-4f32-a4fd-c538c6f5d501)

## 安装依赖

首先，确保已经安装了 Node.js 和 npm。然后，通过以下命令安装项目依赖：

```bash
npm install
```

## 运行项目

安装依赖后，通过以下命令运行项目：

```bash
npm run serve
```

这将启动一个开发服务器，并在浏览器中打开项目。

## 文件结构

项目文件结构如下：

```
xiaomusic-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── ...
│   │   
│   ├── components/
│   │   ├── NavMenu.vue
│   │   ├── ...
│   │   
│   ├── router/
│   │   └── index.js
│   │   
│   ├── store/
│   │   └── index.js
│   │   
│   ├── App.vue
│   ├── main.js
│   └── ...
├── .gitignore
├── README.md
├── package.json
└── ...
```

## 功能实现

### 设备控制

设备控制功能通过 `src/components/NavMenu.vue` 中的 `el-sub-menu` 实现。点击设备控制菜单，将显示小爱设备列表，用户可以选择设备进行控制。

### 播放列表

播放列表功能通过 `src/components/NavMenu.vue` 中的 `el-menu-item` 实现。点击播放列表菜单，将显示播放列表页面。

### 账号设置

账号设置功能通过 `src/components/NavMenu.vue` 中的 `el-menu-item` 实现。点击账号设置菜单，将显示账号设置页面。

### 设置

设置功能通过 `src/components/NavMenu.vue` 中的 `el-menu-item` 实现。点击设置菜单，将显示设置页面。


如果你对项目有任何问题，欢迎联系维护者。

