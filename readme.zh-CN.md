# create-react-library

> 一个命令行(CLI)工具, 使用一个命令就可以为你创建一个基于 Rollup 的 React 库作为你开源项目的基础.

[![NPM](https://img.shields.io/npm/v/create-react-library.svg)](https://www.npmjs.com/package/create-react-library) [![Build Status](https://travis-ci.org/transitive-bullshit/create-react-library.svg?branch=master)](https://travis-ci.org/transitive-bullshit/create-react-library) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## 介绍

**这个命令行工具(CLI)目的是让你可以简单的制作你自己的 React 库或组件**

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/transitive-bullshit/create-react-library/master/media/demo.svg">
</p>

这个命令行工具(CLI)基于 [boilerplate](https://github.com/transitive-bullshit/react-modern-library-boilerplate), 相关文章在[这里](https://hackernoon.com/publishing-baller-react-modules-2b039d84bce7).

## 功能

- 基于 CLI 使用简单
- 创建了超过 2000 个公开的项目!!
- 包含了所有流行的 js 功能
- 同时支持`cjs`和`es`模块格式
- 使用[create-react-app](https://github.com/facebookincubator/create-react-app)为你的库创建示例相当容易
- [Rollup](https://rollupjs.org/)构建支持
- [Babel](https://babeljs.io/) 转换支持
- [Jest](https://facebook.github.io/jest/) 测试支持
- 支持复杂的 peer-dependencies 依赖
- 支持 CSS modules
- 支持 Sourcemap
- 完善的文档 :heart_eyes:

## 安装

这个包必须依赖 `node >= 4`, 但是我们推荐 `node >= 8`.

```bash
npm install -g create-react-library
```

## 创建一个新的模块

```bash
create-react-library
```

根据提示输入你模块的基本信息，然后 CLI 将会执行以下步骤

- 将模板复制到新创建的文件夹中
- 通过 yarn 或 npm 安装依赖
- 通过 npm 的 link 链接包到本地, 方便开发调用
- 初始化本地 git 仓库

这个时候，你的新模块目录应该和下面的截图差不多。这些所有的设置都是为了更友好的进行本地开发

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/transitive-bullshit/create-react-library/master/media/tree.svg">
</p>

## 开发

本地开发分为两个部分.

首先, 你可以运行 rollup 去监听你的`src/`模块, 当你有任何更改会自动编译到`dist/`

```bash
npm start # 运行rollup和监听更改
```

然后, 在本地开发中需要在`example/`目录中链接你的模块

```bash
# (打开新的终端窗口中)
cd example
npm link <your-module-name> # 如果使用yarn可以跳过这步
npm start # 运行 create-react-app dev server 可以开你的示例程序
```

现在, 当你对库的`src/`目录或演示程序的`example/src`目录有任何更改, `create-react-app`会重新加载本地开发服务, 这样就能很愉快的对你的组件进行快速开发迭代.

![](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)

#### 发布到 NPM

将库发布到 **npm** 时请务必要确保所有的依赖模块已经正确添加在了`peerDependencies`中, rollup 会自动识别`peerDependencies`配置选项, 而不会将它捆绑在你的模块中(或者可以叫他外部依赖).

然后就可以愉快的发布拉

```bash
# 注意下面的命令会编译`commonjs`和`es`的版本到你模块的dist/目录中
npm publish
```

#### Github Pages

将示例部署到 github pages 相当简单, 我们需要先给 example 编译一个生产版本, 这个 example 用于演示你的库. 然后运行 gh-pages 来部署生成的 bundle 文件到 github.

```bash
npm run deploy
```

## 使用例子

### 导出多个命名

这个[分支](https://github.com/transitive-bullshit/react-modern-library-boilerplate/tree/feature/multiple-exports)演示了如何导出多个命名的方法. 在这个分支的模块中导出了两个组件`Foo`和`Bar`, 然后展示他们怎么在 example 中进行调用的.

### Material-UI

这个分支[branch](https://github.com/transitive-bullshit/react-modern-library-boilerplate/tree/feature/material-ui)演示了如何使用`peerDependencies`来构建需要依赖外部[material-ui](https://github.com/mui-org/material-ui)的库. 它展示了[rollup-plugin-peer-deps-external](https://www.npmjs.com/package/rollup-plugin-peer-deps-external)强大的`peerDependencies`依赖功能. 它可以轻松的依赖 material-ui 但又无需将它绑定到当前模块中.

### 开源库

下面是一些使用`create-react-library`引导来创建的开源库的成功例子.

- [tabler-react](https://github.com/tabler/tabler-react) - React 实现的 Tabler UI 组件
- [react-background-slideshow](https://github.com/transitive-bullshit/react-background-slideshow) - React 创建背景性感的瓦片幻灯片效果 🔥
- [react-starfield-animation](https://github.com/transitive-bullshit/react-starfield-animation) - React 创建基于 Canvas 的星空动画 ✨
- [react-particle-effect-button](https://github.com/transitive-bullshit/react-particle-effect-button) - React 创建的爆破粒子按钮效果 🎉
- [react-particle-animation](https://github.com/transitive-bullshit/react-particle-animation) - React 创建基于 Canvas 的粒子动画 🌐
- [react-block-image](https://github.com/transitive-bullshit/react-block-image) - React 中通过使用`div`替换`img`来获得更多的控制 🌃
- [react-mp3-recorder](https://github.com/transitive-bullshit/react-mp3-recorder) - React 实现的使用麦克风来记录 mp3 音频 🎵
- [react-before-after-slider](https://github.com/transitive-bullshit/react-before-after-slider) - React 创建的两个图片比较的库.
- [worldwind-react-globe](https://github.com/emxsys/worldwind-react-globe) - React 实现的 NASA WorldWind
- [react-shimmer](https://github.com/gokcan/react-shimmer) - 加载图片时使用一个闪光的效果.

如果你想添加你的库到列表中, 欢迎提交 [issue](https://github.com/transitive-bullshit/create-react-library/issues/new)!

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
