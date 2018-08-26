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
                `SELECT *
                FROM traces
                WHERE st_intersects(ST_SetSRID(ST_GeomFromGeoJSON(
                    '${req.body.intersect}'
                    ),4326), traces.routes_geom) = true`,   
            ).then(result => {
                res.json(result)
            });
            break;

        }
    }
}