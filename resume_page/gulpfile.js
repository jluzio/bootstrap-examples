var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
//var sass = require('gulp-ruby-sass');
var zip = require('gulp-zip');
var watch = require('gulp-watch');

var config = {
  sassPath: './scss',
  cssPath: './css',
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
    gulp.start(['resources-css-bootstrap','css']);
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

gulp.task('resources-css-bootstrap', function () {
  return gulp.src(config.bowerDir + '/bootstrap-sass/assets/fonts/**/*')
      .pipe(debug({title: '[Import Bootstrap]'}))
      .pipe(gulp.dest(config.fontsPath));
});

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('zip', function() {
  return gulp.src(['./**'].concat(config.sourceExcludes))
      .pipe(zip('./archive.zip'))
      .pipe(gulp.dest(config.distDir));
});
