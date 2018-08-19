
exports.up = function(knex, Promise) {
    
    return knex.raw(
        `ALTER TABLE "shapes" ADD COLUMN point_geog geography(Point,4326);
        UPDATE "shapes" SET point_geog = st_SetSrid(st_MakePoint(shape_pt_lon, shape_pt_lat), 4326);
        ALTER TABLE "shapes" ADD COLUMN point_geom geometry(Point,4326);
        UPDATE "shapes" SET point_geom = st_SetSrid(st_MakePoint(shape_pt_lon, shape_pt_lat), 4326);`   
    );  
};

exports.down = function(knex, Promise) {
    return knex.raw(
        `ALTER TABLE "shapes" DROP COLUMN point_geog;
        ALTER TABLE "shapes" DROP COLUMN point_geom;`);
};
