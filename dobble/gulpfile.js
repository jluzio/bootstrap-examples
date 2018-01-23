var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
//var sass = require('gulp-ruby-sass');
var zip = require('gulp-zip');
var watch = require('gulp-watch');

var handlebars = require('gulp-handlebars');
var hb = require('handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var config = {
  sassPath: './scss',
  cssPath: './css',
  jsPath: './js' ,
  fontsPath: './fonts',
  distDir: './dist' ,
  bowerDir: './bower_components' ,
  nodeDir: './node_modules' ,
  sourceExcludes: [
    '!./node_modules{,/**}',
    '!./bower_components{,/**}',
    '!./dist{,/**}'
  ]
};

gulp.task('default', ['clean'], function() {
    gulp.start(['resources-bower','css', 'templates']);
});

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
});

gulp.task('clean', function() {
    return del([config.cssPath + '/**/*']);
});

gulp.task('css', function () {
  return gulp.src(config.sassPath + '/**/*.scss')
      .pipe(debug({title: '[CSS]'}))
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(gulp.dest(config.cssPath));
});

gulp.task('resources-bower', ['resources-bower-fonts']);

gulp.task('resources-bower-fonts', function () {
  return gulp.src([
        config.bowerDir + '/bootstrap-sass/assets/fonts/**/*',
        config.bowerDir + '/font-awesome/fonts/**/*',
      ])
      .pipe(debug({title: '[Import Bower Resources]'}))
      .pipe(gulp.dest(config.fontsPath));
});

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('templates', function() {
  return gulp.src('templates/*.hbs')
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'app.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(config.jsPath));
});

gulp.task('zip', function() {
  return gulp.src(['./**'].concat(config.sourceExcludes))
      .pipe(zip('./archive.zip'))
      .pipe(gulp.dest(config.distDir));
});
