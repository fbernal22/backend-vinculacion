const sql = require('mssql/msnodesqlv8');

const config = {
  database: 'vinculacion_consultores_martin_db',
  server: 'ANALISTAFB', // tu servidor (confírmalo en SSMS)
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conexión a SQL Server exitosa');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error al conectar:', err);
  });

module.exports = { sql, poolPromise };

