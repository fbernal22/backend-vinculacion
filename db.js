const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Fabian123*', // Reemplaza por la real
  server: 'ANALISTAFB', // Este es el tuyo
  database: 'vinculacion_consultores_martin_db',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server');
    return pool;
  })
  .catch(err => console.error('❌ Error al conectar a SQL Server:', err));

module.exports = {
  sql,
  poolPromise,
};
