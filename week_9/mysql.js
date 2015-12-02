var mysql = require('mysql');
exports.pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});