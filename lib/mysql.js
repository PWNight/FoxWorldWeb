import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql.9fd803bac286.hosting.myjino.ru',
  //host: 'localhost',
  port: 3306,
  user: 'j88971792_pwn',
  password: 'yfMsb.qV26cN',
  database: 'j88971792_core',
});


export const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};