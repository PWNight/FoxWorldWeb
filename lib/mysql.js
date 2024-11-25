import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql4.joinserver.xyz',
  user: 'u79998_rJ6Q7KFcEw',
  password: 'U2hqoKdA9V=z.Bz+i5j@J6ie',
  database: 's79998_maincore',
});

export const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};