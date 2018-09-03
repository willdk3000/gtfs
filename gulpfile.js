/* gulpfile */

const gulp = require('gulp'),
    //gutil = require('gulp-util'),
    knex = require('./config/knex'),
    //shell = require('gulp-shell'),
    //sass   = require('gulp-sass');

//Initialisation
//gulp.task('default', function() {
//    return gutil.log('Gulp is running!')
//});

//Importer tables
gulp.task('import_tables', gulp.series(function(done) {
    const path=__dirname+'/source/'+'20180820'
    return (knex.raw(
        `\COPY routes FROM '${path}/routes.txt' DELIMITER ',' CSV HEADER;
        \COPY shapes (shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled) 
        FROM '${path}/shapes.txt' DELIMITER ',' CSV HEADER;
        \COPY stop_times (trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,shape_dist_traveled,timepoint) FROM '${path}/stop_times.txt' DELIMITER ',' CSV HEADER;
        \COPY stops (stop_id,stop_code,stop_name,stop_lat,stop_lon,location_type,parent_station,wheelchair_boarding) 
        FROM '${path}/stops.txt' DELIMITER ',' CSV HEADER;
        \COPY trips FROM '${path}/trips.txt' DELIMITER ',' CSV HEADER;
        UPDATE "stops" SET point_geog = st_SetSrid(st_MakePoint(stop_lon, stop_lat), 4326);
        UPDATE shapes SET point_geog = st_SetSrid(st_MakePoint(shape_pt_lon, shape_pt_lat), 4326);
        UPDATE shapes SET point_geom = st_SetSrid(st_MakePoint(shape_pt_lon, shape_pt_lat), 4326);
        UPDATE stop_times SET hresecondes = 
        ((SUBSTRING(departure_time FROM 1 FOR 2)::int)*60*60)+
        ((SUBSTRING(departure_time FROM 4 FOR 2)::int)*60)+
        ((SUBSTRING(departure_time FROM 7 FOR 2)::int));
        REFRESH MATERIALIZED VIEW traces WITH DATA;
        REFRESH MATERIALIZED VIEW stop_traces WITH DATA;
        REFRESH MATERIALIZED VIEW stop_triptimes WITH DATA;`)
        , done())
}))


//gulp.task('build-css', function() {
//    return gulp.src('./public/assets/stylesheets/scss/**/*.scss')
//      .pipe(sass())
//      .pipe(gulp.dest('./public/assets/stylesheets/css'));
//  });

//gulp.task('watch', function() {
//    gulp.watch('./public/assets/stylesheets/scss/**/*.scss', ['build-css']);
//  });



