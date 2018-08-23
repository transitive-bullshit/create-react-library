# create-react-library

> CLI for easily publishing modern React libraries with Rollup and example usage via create-react-app.

[![NPM](https://img.shields.io/npm/v/create-react-library.svg)](https://www.npmjs.com/package/create-react-library) [![Build Status](https://travis-ci.com/transitive-bullshit/create-react-library.svg?branch=master)](https://travis-ci.com/transitive-bullshit/create-react-library) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Intro

**The purpose of this CLI is to make publishing your own React components as simple as possible.**

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/transitive-bullshit/create-react-library/master/media/demo.svg">
</p>


## Features

- Easy-to-use CLI
- Handles all modern JS features
- Bundles `cjs` and `es` module formats
- [create-react-app](https://github.com/facebookincubator/create-react-app) for example usage and local dev
- [Rollup](https://rollupjs.org/) for build process
- [Babel](https://babeljs.io/) for transpilation
- [Jest](https://facebook.github.io/jest/) for testing
- Supports [Storybook](https://storybook.js.org/) for UI development environment
- Supports complicated peer-dependencies
- Supports CSS modules
- Optional support for TypeScript
- Sourcemap creation
- Hundreds of public modules created
- Thorough documentation :heart_eyes:
- [Chinese docs](./readme.zh-CN.md) by [@monsterooo](https://github.com/monsterooo)


## Install

This package requires `node >= 4`, but we recommend `node >= 8`.

```bash
npm install -g create-react-library
```


## Creating a New Module

```bash
create-react-library
```

Answer some basic prompts about your module, and then the CLI will perform the following steps:
- copy over the template to a new folder in the current directory
- install dependencies via yarn or npm
- link packages together for local development
- initialize local git repo

At this point, your new module should resemble this screenshot and is all setup for local development.

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/transitive-bullshit/create-react-library/master/media/tree.svg">
</p>


## Development

Local development is broken into two parts.

First, you'll run rollup to watch your `src/` module and automatically recompile it into `dist/` whenever you make changes.

```bash
npm start # runs rollup with watch flag
```

The second part will be running the `example/` create-react-app that's linked to the local version of your module.

```bash
# (in another tab)
cd example
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your library in `src/` or to the example app's `example/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

![](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)


#### Using storybook

To run storybook use the command:

```bash
npm storybook # runs storybook server in the port 9001
```

to add new stories create a new `stories.js` file:



```jsx
// MyComponent.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import { MyComponent } from '../MyComponent';

let stories = storiesOf('MyComponent', module);

stories.add('Default', () => <MyComponent/> );
```

you could also adding many plugins and addons to the `config.js` on `.storybook` folder
for more information please visit the addons [page](https://storybook.js.org/addons/introduction/)

#### Publishing to NPM

The only difference when publishing your library to **npm** is to make sure that any npm modules you want as peer dependencies are properly marked as `peerDependencies` in `package.json`. The rollup config will automatically recognize them as peers and not try to bundle them in your module.

Then publish as per usual.

```bash
# note this will build `commonjs` and `es`versions of your module to dist/
npm publish
```


#### Github Pages

Deploying the example to github pages is simple. We create a production build of our example `create-react-app` that showcases your library and then run `gh-pages` to deploy the resulting bundle. This can be done as follows:

```bash
npm run deploy
```


## Examples

### Multiple Named Exports

Here is a [branch](https://github.com/transitive-bullshit/react-modern-library-boilerplate/tree/feature/multiple-exports) which demonstrates how to use multiple named exports. The module in this branch exports two components, `Foo` and `Bar`, and shows how to use them from the example app.

### Material-UI

Here is a [branch](https://github.com/transitive-bullshit/react-modern-library-boilerplate/tree/feature/material-ui) which demonstrates how to make use of a relatively complicated peer dependency, [material-ui](https://github.com/mui-org/material-ui). It shows the power of [rollup-plugin-peer-deps-external](https://www.npmjs.com/package/rollup-plugin-peer-deps-external) which makes it a breeze to create reusable modules that include complicated material-ui subcomponents without having them bundled as a part of your module.

### Boilerplate

The CLI is based on this [boilerplate](https://github.com/transitive-bullshit/react-modern-library-boilerplate), which you can optionally read about [here](https://hackernoon.com/publishing-baller-react-modules-2b039d84bce7).

### Libraries

Here are some example libraries that have been bootstrapped with `create-react-library`.

- [tabler-react](https://github.com/tabler/tabler-react) - React components and demo for the Tabler UI theme.
- [react-background-slideshow](https://github.com/transitive-bullshit/react-background-slideshow) - Sexy tiled background slideshow for React 🔥
- [react-starfield-animation](https://github.com/transitive-bullshit/react-starfield-animation) -Canvas-based starfield animation for React ✨
- [react-particle-effect-button](https://github.com/transitive-bullshit/react-particle-effect-button) - Bursting particle effect buttons for React 🎉
- [react-particle-animation](https://github.com/transitive-bullshit/react-particle-animation) - Canvas-based particle animation for React 🌐
- [react-block-image](https://github.com/transitive-bullshit/react-block-image) - React replacement for img with more control + fallback support 🌃
- [react-mp3-recorder](https://github.com/transitive-bullshit/react-mp3-recorder) - Microphone recorder for React that captures mp3 audio 🎵
- [react-before-after-slider](https://github.com/transitive-bullshit/react-before-after-slider) - A sexy image comparison slider for React.
- [worldwind-react-globe](https://github.com/emxsys/worldwind-react-globe) - NASA WorldWind globe component for React.
- [react-shimmer](https://github.com/gokcan/react-shimmer) - Shimmer effect for loading images.
- [react-login-modal-sm](https://github.com/Silind/react-login-modal-sm) - Customizable React social media login modal.
- [react-gradient-scroll-indicator](https://github.com/jbccollins/react-gradient-scroll-indicator) - Wrapper for scrollable content with gradients.
- ... and hundreds more!

Want to add yours to the list? Submit an [issue](https://github.com/transitive-bullshit/create-react-library/issues/new).

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
