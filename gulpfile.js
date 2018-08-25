/* gulpfile */

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    knex = require('./config/knex'),
    shell = require('gulp-shell')

//Initialisation
gulp.task('default', function() {
    return gutil.log('Gulp is running!')
});

gulp.task('migration_tables_1', shell.task('knex-migrate up --step 5'))

//Importer tables
gulp.task('import_tables', function() {
    return knex.raw(
        `\COPY routes FROM '/home/will/Webdev/gtfs/source/20180820/routes.txt' DELIMITER ',' CSV HEADER;
        \COPY shapes FROM '/home/will/Webdev/gtfs/source/20180820/shapes.txt' DELIMITER ',' CSV HEADER;
        \COPY stop_times FROM '/home/will/Webdev/gtfs/source/20180820/stop_times.txt' DELIMITER ',' CSV HEADER;
        \COPY stops FROM '/home/will/Webdev/gtfs/source/20180820/stops.txt' DELIMITER ',' CSV HEADER;
        \COPY trips FROM '/home/will/Webdev/gtfs/source/20180820/trips.txt' DELIMITER ',' CSV HEADER;
        `)
});

gulp.task('migration_tables_2', shell.task('knex-migrate up --step 10'))





