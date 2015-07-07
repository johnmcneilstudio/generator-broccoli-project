var generators = require('yeoman-generator');
var slug = require('slug');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var encrypt = require('./encrypt');
var isUrl = require('is-url-superb');

module.exports = generators.Base.extend({
  initializing: {
    init: function() {
      this.log('\n' +
        chalk.bgBlack(
          chalk.cyan('JMS') + ' + ' + chalk.green('Broccoli') + ' + ' + chalk.cyan('YOU') + ' = ' + chalk.bold.white('GREATNESS')
        ) +
        '\n'
      );
    }
  },

  prompting: {
    askProjectName: function() {
      var done = this.async();

      var prompts = [{
        type    : 'input',
        name    : 'name',
        message : 'Project name?',
        validate: function(input) {
          return input.length > 3 || 'Project name is invalid (minimum 3 characters)';
        }
      },{
        type    : 'input',
        name    : 'description',
        message : 'Description of the project?'
      },{
        type    : 'input',
        name    : 'repository',
        message : 'URL of origin git remote? (optional)',
        validate: function(input) {
          return input === '' || isUrl(input) || input.substr(0, 4) === 'git@' || 'Remote URL should look like `git@site.com:user/project.git` or `https://site.com/project.git`';
        }
      },{
        type    : 'confirm',
        name    : 'useHeroku',
        default : true,
        message : 'Staging on heroku?'
      },{
        type    : 'input',
        name    : 'herokuAppName',
        message : 'Heroku app name in kebab case? (Ex. app-name-on-heroku)',
        when    : function(val) {
          return val.useHeroku;
        },
        validate: function(input) {
          return input.length > 2 || 'Heroku app name is invalid (minimum 3 characters)';
        }
      },{
        type    : 'input',
        name    : 'restrictedAccessUsername',
        message : 'Heroku restricted access username?',
        when    : function(val) {
          return val.useHeroku;
        },
        validate: function(input) {
          return input.length > 2 || 'Username is invalid (minimum 3 characters)'
        }
      },{
        type    : 'password',
        name    : 'restrictedAccessPassword',
        message : 'Heroku restricted access password?',
        when    : function(val) {
          return val.useHeroku;
        },
        validate: function(input) {
          return input.length > 5 || 'Password is invalid (minimum 6 characters)'
        }
      },{
        type    : 'confirm',
        name    : 'pushToOrigin',
        message : 'Automatically push first initial commit to origin remote?',
        default : true,
        when    : function(val) {
          return val.repository.length > 0;
        }
      }];

      this.prompt(prompts, function (answers) {
        this.opts = answers;
        this.opts.slugifiedName = slug(answers.name);

        if (this.opts.useHeroku) {
          this.opts.herokuUrl = 'https://git.heroku.com/' + this.opts.herokuAppName + '.git';
          this.opts.restrictedAccess = {
            username: answers.restrictedAccessUsername,
            password: '{SHA}' + encrypt.sha1(this.opts.restrictedAccessPassword)
          };
        }
        done();
      }.bind(this));
    }
  },

  configuring: {
    copyFiles: function() {
      this.log(chalk.cyan(
        '\nCreating config files...'
      ));

      this.copy('editorconfig', '.editorconfig');
      this.copy('gitignore', '.gitignore');
      this.copy('jshintrc', '.jshintrc');
      this.copy('Brocfile.js', 'Brocfile.js');
      this.template('README.md', 'README.md');
      this.template('CHANGELOG.md', 'CHANGELOG.md');
      this.copy('_package.json', 'package.json');

      if (this.opts.useHeroku) {
        this.copy('Procfile', 'Procfile');
        this.copy('npmrc', '.npmrc');
        this.template('_server.js', 'server.js');
        this.template('_password', 'password');
      }
    }
  },

  install: {
    projectFiles: function() {
      this.log(chalk.cyan(
        '\nCopying app source files...'
      ));

      mkdirp('src');

      this.directory('_sass', 'src/sass');
      this.directory('_img', 'src/img');
      this.directory('_app', 'src/app');
      this.directory('_tpl', 'src/tpl');
    },

    git: function() {
      // Init git
      this.log(chalk.cyan('\nGit initialization...'));
      child = execSync('git init');

      // Create develop branch
      this.log(chalk.cyan('\nCreating `develop` branch...'));
      child = execSync('git checkout -b develop');

      // Add remote origin
      if (this.opts.repository.length > 0) {
        this.log(chalk.cyan('\nAdding git origin remote...'));
        child = execSync('git remote add origin ' + this.opts.repository);
      }

      // Initial commit
      child = execSync('git add --all && git commit -am "Initial Commit"');

      // Push to origin
      if (this.opts.pushToOrigin) {
        this.log(chalk.cyan('\nPushing to origin remote...'));
        child = execSync('git push origin develop');
      }

      // Add Heroku remote
      if (this.opts.useHeroku) {
        this.log(chalk.cyan('\nAdded git heroku remote...'));
        child = exec('git remote add heroku ' + this.opts.herokuUrl);
      }
    },

    npm: function() {
      this.log('\n' + chalk.cyan('Installing NPM packages...'));
      child = execSync('npm install');
    }
  },

  end: function() {
    this.log(
      '\n' + chalk.green('✔ Broccoli project set up') +
      '\nRun ' + chalk.bold.blue('`npm run dev`') + ' to start working.'
    );
  }
});

