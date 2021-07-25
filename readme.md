# App KeyPass

This application has been created with the Ionic framework v5.

With this app you can generate secure password settings, the generated password is never stored, only the password settings are stored. Using a secret word, the password can be retrieved when required.

## Getting Started

To begin using this app, choose one of the following options to get started:
* [Download the latest release here](https://github.com/igarciadev/app-keypass/archive/refs/heads/master.zip)
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

## Start the project

The project is started with the regular ionic commands.

1. Run `npm install` to install all dependencies.
2. Run `ionic serve` to start the development environment.
3. To build the project run `ionic build android` or `ionic build ios`. In order for you to build an iOS app, you need to run on MacOS.
4. To build the android apk run `ionic cordova build android` or `ionic cordova build android --prod`.
5. To start the app on an android device run `ionic cordova run android --consolelogs --livereload`.

## Bugs and Issues

Have a bug or an issue with this app? [Open a new issue](https://github.com/igarciadev/app-keypass/issues) here on Github.

## Creator

This app was created by and is maintained by **[Isaac García Sánchez](https://isaacgarciasanchez.es)**

## Copyright and License

Copyright 2021 Isaac García Sánchez. Code released under the [GNU General Public License v3.0](https://github.com/igarciadev/app-keypass/blob/master/LICENSE) license.
