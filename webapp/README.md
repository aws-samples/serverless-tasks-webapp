# Tasks webapp

## Project setup

```sh
npm install
```

## Configure API Gateway endpoint URL

Edit `src/main.js` and set the value for `axios.defaults.baseURL` to your API Gateway endpoint. This value is output from the SAM template in the sibling project to this one.

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

### Install latest version of Amplify CLI

```sh
npm i -g @aws-amplify/cli
```

### Initialize Amplify

```sh
amplify init
```

### Add hosting

```sh
amplify add hosting
```

### Publish app

```sh
amplify publish
```