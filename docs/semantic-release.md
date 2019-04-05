# Automated Semantic Versioning

[`semantic-release`](https://semantic-release.gitbook.io/semantic-release/) is a fully automated version management and package publishing solution:

> semantic-release automates the whole package release workflow including: determining the next version number, generating the release notes and publishing the package.

In other words, in exchange for [structuring commit messages](https://semantic-release.gitbook.io/semantic-release/#commit-message-format) you never have to worry about the versioning again. The flow of generating a GitHub release, publishing to npm, and generating a changelog, will be taken care of.

## How to

1. Choose `y` when prompted about `semantic-release` in the `create-react-library` wizard.
1. On the CI, add two environment variables: [`GITHUB_TOKEN`](https://github.com/settings/tokens) and [`NPM_TOKEN`](https://docs.npmjs.com/about-authentication-tokens).

## Not publishing to npm

If you'd rather **not publish** to npm (only generate a GitHub release & changelog), add `plugins` key to the `release` section in package.json:

```
"plugins": [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  [
    "@semantic-release/npm",
    {
      "npmPublish": false
    }
  ],
  "@semantic-release/github"
]
```

## Read more

- [Semantic Versioning](https://semver.org/)
- [Configuring semantic-release step-by-step](https://blog.logrocket.com/never-guess-about-project-history-again-31f65091f668)
- [`commitizen`](https://github.com/commitizen/cz-cli), a tool for structuring commit messages
- [Angular commit message format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), the default format used by `semantic-release`
