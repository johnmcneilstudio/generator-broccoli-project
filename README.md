# generator-broccoli-project

> A [Yeoman](http://yeoman.io/) generator for Broccoli projects (following `traditional` JMS configuration)

## Description

This generator aims to create a ready-to-code environment for front-end project using Broccoli as task runner.

The generator installs the following:  
- Broccoli configuration:  
  - Fonts  
  - Sass Compile  
  - Autoprefixer,  
  - CSS clean & minification  
  - JSHint  
  - JS concatenation  
  - JS uglification (including sourcemaps generation)  
  - images minification (png, jpg, gif, svg)  
  - Zetzer templating process  

- Code / Doc configuration:  
  - editorconfig  
  - jshintrc  
  - README Markdown  
  - CHANGELOG markdown  
  - package.json  

- Git configuration:  
  - initalizes git  
  - creates gitignore  
  - creates & checkouts `develop` branch  
  - adds origin remote  
  - pushes initial commit with skeleton  
  - installs NPM packages  

- Staging configuration on Heroku
  - sets up specific file for deployment on Heroku  
  - creates restricted access credentials (the generator asks you to enter credentials)


## INSTALLATION

### Install Yeoman  
```shell
$ npm install -g yo
```

### Install generator globally  
```shell
$ npm install -g generator-broccoli-project
```

### [Create bitbucket repo](https://bitbucket.org/repo/create)

### [Create Heroku app](https://dashboard.heroku.com/new) if needed (Heroku config setup is optional)

### Run generator inside your empty project folder  
```shell
$ mkdir project && cd project
$ yo broccoli-project
```

### Follow the step-by-step installation

*Note*: some steps are optional  
- the auto push of first commit to origin remote  
- the heroku setup config  


## COMMANDS

The generator automatically creates a bunch commands to simplify your dev process:

### dev
```shell
$ npm run dev
```

Runs the broccoli serve

### build
```shell
$ npm run build
```

Builds the project to a ``dist/``` folder.

### heroku
```shell
$ npm run heroku
```

Deploys code to Heroku env

### start
```shell
$ npm run start
```

Start node server. Mainly used for Heroku hosting, not needed in dev env.
