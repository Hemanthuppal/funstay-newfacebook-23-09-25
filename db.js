const mysql = require('mysql2');

// Database configuration
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'funstay_db_02-06-2025',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };

const dbConfig = {
  host: 'localhost',
  user: 'nodeuser',
  password: 'Root@1234',
  database: 'funstay_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// const dbConfig = {
//   host: 'localhost',
//   user: 'nodeuser',
//   password: 'Root@1234',
//   database: 'funstay_db',
// };

// Create a pool
const pool = mysql.createPool(dbConfig);

// Wrapper to mimic old connection behavior safely
function createConnection() {
  const proxy = new Proxy(pool, {
    get(target, prop) {
      if (prop === 'end') {
        // Ignore any .end() calls to prevent pool shutdown
        return () => console.log('⚠️ Ignored db.end() — pool stays open.');
      }
      return target[prop];
    }
  });
  return proxy;
}

module.exports = { createConnection };
