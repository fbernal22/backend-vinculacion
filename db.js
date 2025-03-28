const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'ANALISTAFB', // O tu instancia, por ejemplo: 'ANALISTAFB\\SQLEXPRESS'
  database: 'vinculacion_consultores_martin_db',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conectado a SQL Server con autenticación de Windows');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error al conectar:', err);
    throw err;
  });

module.exports = {
  sql, poolPromise
};
