var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var less = require('gulp-less');
var zip = require('gulp-zip');
var watch = require('gulp-watch');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

var handlebars = require('gulp-handlebars');
var hb = require('handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var config = {
  src: {
    js: './src/js',
    sass: './src/scss',
    less: './src/less',
  },
  cssPath: './css',
  jsPath: './js' ,
  fontsPath: './fonts',
  mapsDir: './maps' ,
  distDir: './dist' ,
  bowerDir: './bower_components' ,
  nodeDir: './node_modules' ,
  sourceExcludes: [
    '!./node_modules{,/**}',
    '!./bower_components{,/**}',
    '!./dist{,/**}'
  ]
};

gulp.task('default', function() {
    runSequence('clean', 'resources-bower', ['css']);
});

gulp.task('css', function() {
  runSequence('css-gen','css-min');
});

gulp.task('watch', ['watch-css', 'watch-js']);

gulp.task('css-gen', ['css-sass']);

gulp.task('watch-css', ['watch-sass']);

gulp.task('clean', function() {
    return del([
      config.cssPath + '/**/*',
      config.jsPath + '/**/*'
    ]);
});

gulp.task('css-sass', function () {
  return gulp.src(config.src.sass + '/**/*.scss')
      .pipe(debug({title: '[CSS]'}))
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(gulp.dest(config.cssPath));
});

gulp.task('css-less', function () {
  return gulp.src(config.src.less + '/**/*.less')
      .pipe(debug({title: '[CSS]'}))
      .pipe(less())
      .pipe(gulp.dest(config.cssPath));
});

gulp.task('css-min', function () {
  return gulp.src([config.cssPath + '/**/*.css', '!./**/*.min.css'])
      .pipe(debug({title: '[CSS-min]'}))
      .pipe(sourcemaps.init())
      .pipe(cleanCSS())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write(config.mapsDir))
      .pipe(gulp.dest(config.cssPath));
});

gulp.task('watch-sass', function() {
  // Watch .scss files
  return gulp.watch(config.src.sass + '/**/*.scss', ['css']);
});

gulp.task('watch-less', function() {
  // Watch .scss files
  return gulp.watch(config.src.less + '/**/*.less', ['css']);
});

gulp.task('watch-js', function() {
  // Watch .scss files
  return gulp.watch(config.src.js + '/**/*.js', ['js']);
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

gulp.task('js-min', function(){
  return gulp.src([config.jsPath + '/**/*.js', '!./**/*.min.js'])
      .pipe(debug({title: '[JS-min]'}))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write(config.mapsDir))
      .pipe(gulp.dest(config.jsPath));
});

gulp.task('js-src', function() {
  return gulp.src(config.src.js + '/**/*.js')
      .pipe(debug({title: '[JS-src]'}))
      .pipe(gulp.dest(config.jsPath));
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

gulp.task('js', function() {
  runSequence(['js-src','templates'], 'js-min');
});

gulp.task('zip', function() {
  return gulp.src(['./**'].concat(config.sourceExcludes))
      .pipe(zip('./archive.zip'))
      .pipe(gulp.dest(config.distDir));
});
