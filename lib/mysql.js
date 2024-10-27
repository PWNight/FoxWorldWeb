import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql-ru-br2.joinserver.xyz',
  user: 'u79998_Fa0GZwmyva',
  password: 'VcmPKlwnDl!kKdCqf3qFGUX+',
  database: 's79998_librelogin',
});

export const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};