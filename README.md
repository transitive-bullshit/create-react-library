# create-react-library

> CLI for easily publishing modern React modules with Rollup and example usage via create-react-app.

[![NPM](https://img.shields.io/npm/v/create-react-library.svg)](https://www.npmjs.com/package/create-react-library) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Intro

**The purpose of this CLI is to make publishing your own React components as simple as possible.**

<p align="center">
  <img width="600" src="https://raw.githubusercontent.com/transitive-bullshit/create-react-library/master/media/demo.svg">
</p>

The CLI is based on this [boilerplate](https://github.com/transitive-bullshit/react-modern-library-boilerplate), which you can optionally read in-depth about [here](https://hackernoon.com/publishing-baller-react-modules-2b039d84bce7).

## Features

- Support all modern JS language features for component development out of the box
- Build process to convert source to `umd` and `es` module formats for publishing to npm
- Comes with an `example` app using a standard [create-react-app](https://github.com/facebookincubator/create-react-app), serving 2 purposes
  - Local, hot-reload server for developing your module
  - Easily publishable to github pages so users can quickly play with your module
- Use [Rollup](https://rollupjs.org/) for build process and [Babel](https://babeljs.io/) for transpilation
  - See the [blog post](https://hackernoon.com/publishing-baller-react-modules-2b039d84bce7) for an explanation of Rollup vs Webpack
- Allow the use of `npm` modules within your library, either as dependencies or peer-dependencies
- Support importing CSS in your components (with css modules enabled by default)
  - Note that CSS support will be a noop if you're using css-in-js
- Testing with [Jest](https://facebook.github.io/jest/), using `react-scripts` from `create-react-app`
- Sourcemap creation enabled by default
- Thorough documentation written by someone who cares :heart_eyes:

## Install

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
  <img width="600" src="https://raw.githubusercontent.com/transitive-bullshit/create-react-library/master/media/tree.svg">
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
npm link <your-module-name> # optional if using yarn
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your component in `src/` or to the example app's `example/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

![](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)

Note: if you're using yarn, there is no need to use `yarn link`, as the generated module's example includes a local-link by default.

#### NPM Stuffs

The only difference when publishing your component to **npm** is to make sure you add any npm modules you want as peer dependencies are properly marked as `peerDependencies` in `package.json`. The rollup config will automatically recognize them as peer dependencies and not try to bundle them in your module.

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

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
