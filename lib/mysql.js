import mysql from 'mysql2/promise';

export const query = async (sql, params) => {
  const pool = mysql.createPool({
    host: 'mysql.9fd803bac286.hosting.myjino.ru',
    //host: 'localhost',
    port: 3306,
    user: 'j88971792_pwn',
    password: 'yfMsb.qV26cN',
    database: 'j88971792_core',
  });

  const [results] = await pool.execute(sql, params);
  return results;
};

export const permsQuery = async (sql, params) => {
  const pool = mysql.createPool({
    host: 'mysql4.joinserver.xyz',
    port: 3306,
    user: 'u79998_J0edIoldwJ',
    password: 'nx0W3w7bCe9TO=2F@dXp1UQ^',
    database: 's79998_luckperms',
  });

  const [results] = await pool.execute(sql, params);
  return results;
};