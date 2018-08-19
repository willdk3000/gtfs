
exports.up = function(knex, Promise) {
    
    return knex.raw(
        `CREATE MATERIALIZED VIEW public.traces
        TABLESPACE pg_default
        AS
         WITH tableroutes AS (
                 SELECT st_makeline(bp.point_geom) AS routes,
                    bp.shape_id
                   FROM ( SELECT shapes.point_geom,
                            shapes.shape_id
                           FROM shapes
                          ORDER BY shapes.shape_pt_sequence) bp
                  GROUP BY bp.shape_id
                )
         SELECT DISTINCT ON (trips.shape_id) tableroutes.routes,
            tableroutes.shape_id,
            trips.route_id,
            trips.direction_id
           FROM tableroutes
             JOIN trips ON trips.shape_id = tableroutes.shape_id
        WITH NO DATA;
        
        ALTER TABLE public.traces
            OWNER TO postgres;
        REFRESH MATERIALIZED VIEW traces;`   
    );  
};

exports.down = function(knex, Promise) {
    return knex.raw(
        `DROP materialized view traces;`);
};


