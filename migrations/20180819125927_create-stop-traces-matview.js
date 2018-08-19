exports.up = function(knex, Promise) {
    
    return knex.raw(
        `CREATE MATERIALIZED VIEW public.stop_traces
        TABLESPACE pg_default
        AS
        WITH tableshapearrets AS (
            SELECT stop_times.stop_id,
               stop_times.stop_sequence,
               stop_times.departure_time,
               trips.shape_id,
               trips.trip_id
              FROM trips
                JOIN stop_times ON stop_times.trip_id = trips.trip_id
           )
        SELECT tableshapearrets.stop_id,
            tableshapearrets.stop_sequence,
            tableshapearrets.shape_id,
            tableshapearrets.trip_id,
            stops.stop_name,
            stops.stop_code,
            stops.point_geog
        FROM tableshapearrets
            LEFT JOIN stops ON stops.stop_id = tableshapearrets.stop_id
        ORDER BY tableshapearrets.trip_id, tableshapearrets.shape_id, tableshapearrets.stop_sequence
        WITH DATA;
        
        ALTER TABLE public.stop_traces
            OWNER TO postgres;`   
    );  
};

exports.down = function(knex, Promise) {
    return knex.raw(
        `DROP materialized view stop_traces;`);
};