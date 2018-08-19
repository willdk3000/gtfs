const stopsController = require('../controllers').stops;
const tracesController = require('../controllers').traces;

module.exports = (app) => {

  //app.get('/api/stops', stopsController.list);
  app.post('/api/stops/:action', stopsController.requete);

  //app.get('/api/gtfsStoptimes', gtfsStoptimesController.list);
  //app.post('/api/gtfsStoptimes/:action', gtfsStoptimesController.requete);

  //app.get('/api/charge', chargeController.list);
  //app.post('/api/charge', chargeController.requete);

  //app.get('/api/traces', tracesController.list);
  app.post('/api/traces/:action', tracesController.requete);

};
