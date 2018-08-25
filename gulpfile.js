/* gulpfile */

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    run = require('gulp-run'),
    knex = require('./config/knex')

//Initialisation
gulp.task('default', function() {
    return gutil.log('Gulp is running!')
});

//Importer tables
gulp.task('import', function() {
    return run(knex.raw(`\COPY test FROM '/home/will/Webdev/gtfs/source/datatest.txt' DELIMITER ',' CSV HEADER`)).exec()
})