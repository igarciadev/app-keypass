# App KeyPass

This application has been created with the Ionic framework v5.

With this app you can generate secure password settings, the generated password is never stored, only the password settings are stored. Using a secret word, the password can be retrieved when required.


## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [App Preview](#app-preview)
- [Download](#download)
- [Deploying](#deploying)
- [Bugs and Issues](#bugs-and-issues)
- [Creator](#creator)
- [Copyright and License](#copyright-and-license)


## Getting Started

To begin using this app, choose one of the following options to get started:
* [Download the latest release here](https://github.com/igarciadev/app-keypass/releases)
* Clone the repo: `git clone https://github.com/igarciadev/app-keypass.git`


## Project Structure

```
.
 ├── .devcontainer
 ├── resources
 ├── src
 ├── .browserslistrc
 ├── .eslintrc.json
 ├── .gitignore
 ├── angular.json
 ├── config.xml
 ├── ionic.config.json
 ├── package-lock.json
 ├── package.json
 ├── readme.md
 ├── tsconfig.app.json
 ├── tsconfig.json
 └── tsconfig.spec.json
```

### src directory

```
.
   ├── ...
   ├── src                       
   │   ├── app
   │   ├── assets
   |   ├── environments
   |   ├── theme
   |   ├── global.scss
   |   ├── index.html
   |   ├── main.ts
   |   ├── polyfills.ts
   |   ├── test.ts
   |   ├── zone-flags.ts
   └── ...
```


## App Preview

All app preview screenshots were taken by running app on an android device.

[List Tab](https://github.com/igarciadev/app-keypass/tree/master/src/app/pages/list-tab) | [Password Tab](https://github.com/igarciadev/app-keypass/tree/master/src/app/pages/password-tab)
 :-: | :-:
 <img src="resources/screenshots/screenshot list-tab.jpeg" alt="Schedule" width="250"/> | <img src="resources/screenshots/screenshot password-tab.jpeg" alt="Schedule" width="250"/>


[Search Page](https://github.com/igarciadev/app-keypass/tree/master/src/app/pages/search) | [View Page](https://github.com/igarciadev/app-keypass/tree/master/src/app/pages/view-pass-config) | [Edit Page](https://github.com/igarciadev/app-keypass/tree/master/src/app/pages/edit-pass-config)
 :-: | :-: | :-:
 <img src="resources/screenshots/screenshot search-page.jpeg" alt="Schedule" width="250"/> | <img src="resources/screenshots/screenshot view-page.jpeg" alt="Schedule" width="250"/> | <img src="resources/screenshots/screenshot edit-page.jpeg" alt="Schedule" width="250"/>

- To see more images of the app, check out the [screenshots directory](https://github.com/igarciadev/app-keypass/tree/master/resources/screenshots)!


## Download

Download the app to your Android device [APP KEYPASS APK](https://github.com/igarciadev/app-keypass/raw/master/resources/release/app-keypass-prod.apk)

[<img src="resources/release/app-keypass-prod.png" alt="Schedule" width="250"/>](https://github.com/igarciadev/app-keypass/raw/master/resources/release/app-keypass-prod.apk)

## Deploying

The project is started with the regular ionic commands.

1. Run `npm install` to install all dependencies.
2. Run `ionic serve` to start the development environment.
3. To build the project run `ionic build android` or `ionic build ios`. In order for you to build an iOS app, you need to run on MacOS.
4. To build the android apk run `ionic cordova build android`, `ionic cordova build android --prod` or `ionic cordova build --release android`.
5. To start the app on an android device run `ionic cordova run android --consolelogs --livereload`.
6. To create Karma code coverage report run `npm test --code-coverage`.
7. To run tests `npm run test`.


## Bugs and Issues

Have a bug or an issue with this app? [Open a new issue](https://github.com/igarciadev/app-keypass/issues) here on Github.


## Creator

This app was created by and is maintained by **[Isaac García Sánchez](https://isaacgarciasanchez.es)**


## Copyright and License

Copyright 2021 Isaac García Sánchez. Code released under the [GNU General Public License v3.0](https://github.com/igarciadev/app-keypass/blob/master/LICENSE) license.
