// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'abc123',
      database : 'gtfs-dev'
    },
    migrations: {
      directory: __dirname + '/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/migrations'
    }
  }

};
