var funnel = require('broccoli-funnel'),
  mergeTrees = require('broccoli-merge-trees'),
  autopref = require('broccoli-autoprefixer'),
  compileSass = require('broccoli-sass'),
  cleanCSS = require('broccoli-clean-css'),
  uglifyJS = require('broccoli-uglify-sourcemap'),
  jshint = require('broccoli-jshint'),
  concat = require('broccoli-concat'),
  minImg = require('broccoli-imagemin'),
  svgo = require('broccoli-svgo'),
  env = require('broccoli-env').getEnv(),
  zetzer = require('broccoli-zetzer');

var src = 'src',
  app = 'app',
  styles = 'sass',
  tpl = 'tpl',
  fonts = 'fonts',
  images = 'img';


/**************************************************
 * FONTS
 **************************************************/
var fontsTree = funnel(src+'/'+fonts);


/**************************************************
 * SASS
 **************************************************/
var sass = compileSass([src + '/' + styles], 'style.scss', 'style/style.min.css');
var autoprefixCSS = autopref(sass, {
  sourceMap: true,
  browsers: ['> 1%', 'last 2 versions', 'Chrome 5', 'Firefox 6']
});

var cssTree = cleanCSS(autoprefixCSS, {
  sourceMap: true,
  strict: true
});


/**************************************************
 * JAVASCRIPT
 **************************************************/
var app = funnel(src+'/'+app);
var hintJS = jshint(app, {
  disableTestGenerator: true
});
var concatJS = concat(app, {
  inputFiles: ['**/*.js'],
  outputFile: '/scripts/app.min.js'
});
var appJS = mergeTrees([hintJS, concatJS], { overwrite: true });
var jsTree = uglifyJS(appJS, {
  compress: true,
  mangle: true,
  sourceMapConfig: {
    enabled: true
  }
});


/**************************************************
 * IMAGES
 **************************************************/
var images = funnel(src + '/' + images, {
  destDir: 'img'
});
var svgsTree = svgo(images);
var imgsTree = minImg(images);
var imgTree = mergeTrees([svgsTree, imgsTree], {overwrite: true});


var assetsTree = mergeTrees([cssTree, jsTree, imgTree, fontsTree]);
// Funnel all assets to assets/ folder
assetsTree = funnel(assetsTree, {
  destDir: 'assets'
});


/**************************************************
 * TEMPLATES
 **************************************************/
var htmls = zetzer({
  pages:     src + '/tpl/pages',
  partials:  src + '/tpl/partials',
  templates: src + '/tpl/templates',
  dot_template_settings: {
    strip: false
  }
});
var htmlTree = funnel(htmls, {
  destDir: '/',
  getDestinationPath: function(relativePath) {
    // Remove path
    var levels = relativePath.split('/');
    // Change extensions
    return levels[levels.length - 1].replace('.dot', '');
  }
});


module.exports = mergeTrees([htmlTree, assetsTree]);
