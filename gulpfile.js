var _ = require('lodash');
var gulp = require('gulp');
var touch = require('touch');
var del = require('del');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
var toFive = require('gulp-6to5');
var plumber = require('gulp-plumber');
var replace = require('gulp-regex-replace');
var stripDebug = require('gulp-strip-debug');

var isProduction = function(file) {
  return process.env.NODE_ENV === 'production';
};

gulp.task('lib-clean', function (done) {
  del('./lib', done);
});

gulp.task('lib-compile', [ 'lib-clean' ], function(){
  return gulp.src([
      './src/**/*.js',
      './src/**/*.jsx',
      '!./src/preprocessor.js',
      '!./src/__tests__/**'
    ])
    .pipe(plumber())
    .pipe(toFive({}))
    .pipe(replace({regex: "\\.jsx", replace: ''}))
    .pipe(rename({ extname: '.js' }))
    .pipe(gulpIf(isProduction, stripDebug()))
    .pipe(gulp.dest('./lib'))
  ;
});

gulp.task('touch', function() {
  touch.sync('package.json');
});

gulp.task('watch', ['lib'], function() {
  return gulp.watch(['src/**/*'], ['lib', 'touch']);
});

gulp.task('lib', ['lib-clean', 'lib-compile']);
gulp.task('default', ['lib']);