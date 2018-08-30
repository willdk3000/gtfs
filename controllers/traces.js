const knex = require('../config/knex')

module.exports = {

    list(req, res) {
        return knex('routes')
        .then(routes => res.status(200).send(routes))
      },

    requete(req, res) {
        switch(req.params.action) {

            case ':getRoutes':
            return knex.raw(
                `SELECT DISTINCT route_id FROM "trips" WHERE service_id = '${req.body.service_id}' ORDER BY route_id`, 
            )
            .then(result => {
                res.json(result)
            })
            break;
      
            case ':showRoutes':
            return knex.raw(
                `SELECT jsonb_build_object(
                    'type',     'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM (
                  SELECT jsonb_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(routes_geom)::jsonb,
                    'properties', jsonb_build_object(
                                'ID', shape_id,
                                'ligne', route_id,
                                'direction', direction_id)        
                  ) AS feature
                 
                  FROM (SELECT * FROM traces WHERE route_id = ${req.body.requete}) inputs) features;`,   
            ).then(result => {
                res.json(result)
            });
            break;
      
            case ':getTraces':
            return knex.raw(
                `SELECT DISTINCT shape_id FROM "trips" WHERE route_id=${req.body.ligne} ORDER BY shape_id`, 
            )
            .then(result => {
                res.json(result)
            });
            break;
      
            case ':showTrace':
            return knex.raw(
                `SELECT jsonb_build_object(
                    'type',     'FeatureCollection',
                    'features', jsonb_agg(features.feature)
                )
                FROM (
                  SELECT jsonb_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(routes_geom)::jsonb,
                    'properties', jsonb_build_object(
                                'ID', shape_id,
                                'ligne', route_id,
                                'direction', direction_id)        
                  ) AS feature
                 
                  FROM (SELECT * FROM traces WHERE shape_id='${req.body.trace}') inputs) features;`,   
            ).then(result => {
                res.json(result)
            });
            break;

            case ':intersects':
            return knex.raw(
                `WITH tintersect AS(
                    (WITH tableroutesintersect AS (
                        SELECT *
                        FROM traces
                        WHERE st_intersects(ST_SetSRID(ST_GeomFromGeoJSON(
                            '{"coordinates":[[-73.46893400463986,45.52468112706461],[-73.46946393614215,45.52373437792377]],"type":"LineString"}'),4326),
                                traces.routes_geom) = true
                    ),
                    voyperiodes AS (
                    WITH depart_min AS (
                        SELECT
                        shape_id,
                        trip_id,
                            MIN(hresecondes) as hs
                        FROM
                            stop_traces
                        GROUP BY
                            trip_id, shape_id
                    )
                    SELECT
                        shape_id,
                        SUM(
                            CASE
                            WHEN depart_min.hs > 14400 AND depart_min.hs <= 21599 THEN 1 
                            ELSE 0
                            END
                        ) AS MA,
                        SUM(
                            CASE
                            WHEN depart_min.hs > 21600 AND depart_min.hs <= 32399 THEN 1 
                            ELSE 0
                            END
                        ) AS AM,
                        SUM(
                            CASE
                            WHEN depart_min.hs > 32400 AND depart_min.hs <= 55799 THEN 1 
                            ELSE 0
                            END
                        ) AS HP,
                        SUM(
                            CASE
                            WHEN depart_min.hs > 55800 AND depart_min.hs <= 66599 THEN 1 
                            ELSE 0
                            END
                        ) AS PM,
                        SUM(
                            CASE
                            WHEN depart_min.hs > 66600 AND depart_min.hs <= 93600 THEN 1 
                            ELSE 0
                            END
                        ) AS SO
                    FROM
                        depart_min
                    GROUP BY
                        shape_id
                    )
                    SELECT
                        tableroutesintersect.shape_id,
                        tableroutesintersect.route_id,
                        tableroutesintersect.direction_id,
                        voyperiodes.shape_id,
                        voyperiodes.MA,
                        voyperiodes.AM,
                        voyperiodes.HP,
                        voyperiodes.PM,
                        voyperiodes.SO
                    FROM tableroutesintersect
                    LEFT JOIN voyperiodes ON tableroutesintersect.shape_id = voyperiodes.shape_id
                    ORDER BY route_id, direction_id)
                    )
                    SELECT
                         route_id, 
                        direction_id,
                         SUM (ma) AS ma,
                        SUM (am) AS am,
                        SUM (hp) AS hp,
                        SUM (pm) AS pm,
                        SUM (so) AS so
                    FROM
                         tintersect
                    GROUP BY
                         route_id, direction_id
                    ORDER BY
                        route_id, direction_id
                    `,   
            ).then(result => {
                res.json(result)
            });
            break;

        }
    }
}