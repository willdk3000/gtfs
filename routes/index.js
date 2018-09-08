const stopsController = require('../controllers').stops;
const tracesController = require('../controllers').traces;
const sommaireController = require('../controllers').sommaire;

module.exports = (app) => {

  //app.get('/api/stops', stopsController.list);
  app.post('/api/stops/:action', stopsController.requete);

  //app.get('/api/traces', tracesController.list);
  app.post('/api/traces/:action', tracesController.requete);

  //app.get('/api/sommaire', sommaireController.list);
  app.post('/api/sommaire/:action', sommaireController.requete);

};
