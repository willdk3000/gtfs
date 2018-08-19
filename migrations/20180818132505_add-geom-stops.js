
exports.up = function(knex, Promise) {
    
    return knex.raw(
        `ALTER TABLE "stops" ADD COLUMN point_geog geography(Point,4326);
        UPDATE "stops" SET point_geog = st_SetSrid(st_MakePoint(stop_lon, stop_lat), 4326);`   
    );  
};

exports.down = function(knex, Promise) {
    return knex.raw(
        `ALTER TABLE "stops" DROP COLUMN point_geog;`);
};
