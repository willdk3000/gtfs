/* gulpfile */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gsass = require('gulp-sass'),
    gconcat = require('gulp-concat'),
    gconnect = require('gulp-connect');

gulp.task('default', function() {
    return gutil.log('Gulp is running!')
});

