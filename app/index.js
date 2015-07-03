var generators = require('yeoman-generator');
var slug = require('slug');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

module.exports = generators.Base.extend({
  initializing: {
    init: function() {
      this.log('\n\n' +
        'JMS '.blue + '+' + ' Broccoli '.green + '+' + ' You'.blue + ' = ' + 'GREATNESS'.white +
        '\n\n');
    }
  },

  prompting: {
    askProjectName: function() {
      var done = this.async();

      var prompts = [{
        type    : 'input',
        name    : 'name',
        message : 'Project name?',
      },{
        type    : 'input',
        name    : 'description',
        message : 'Description of the project?'
      },{
        type    : 'input',
        name    : 'repository',
        message : 'Remote URL of the git repo?',
      },{
        type    : 'confirm',
        name    : 'useHeroku',
        message : 'Staging on heroku?'
      },{
        type    : 'input',
        name    : 'herokuUrl',
        message : 'What\'s Heroku\'s remote URL?',
        when    : function(val) {
          return val.useHeroku;
        }
      }];

      this.prompt(prompts, function (answers) {
        this.opts = answers;
        this.opts.slugifiedName = slug(answers.name);
        done();
      }.bind(this));
    }
  },

  configuring: {
    copyFiles: function() {
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
      }
    }
  },

  default: {
  
  },

  install: {
    projectFiles: function() {
      mkdirp('src/app');
      mkdirp('src/img');
      mkdirp('src/sass');
      mkdirp('src/templates');
    },

    exec: function() {
      child = exec('git init');
      child = exec('git remote add origin ' + this.opts.repository);
      if (this.opts.useHeroku) {
        child = exec('git remote add heroku ' + this.opts.herokuUrl);
      }
    }
  },

  end: function() {
    this.log();
  }
});

