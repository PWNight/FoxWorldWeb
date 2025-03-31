import mysql from 'mysql2/promise';

export const query = async (sql, params) => {
  const pool = mysql.createPool({
    host: 'mysql.9fd803bac286.hosting.myjino.ru',
    port: 3306,
    user: 'j88971792_pwn',
    password: 'yfMsb.qV26cN',
    database: 'j88971792_core',
  });

  const [results] = await pool.execute(sql, params);
  await pool.end();
  return results;
};

export const permsQuery = async (sql, params) => {
  const pool = mysql.createPool({
    host: 'mysql.9fd803bac286.hosting.myjino.ru',
    port: 3306,
    user: 'j88971792_perms',
    password: 'fk{8H7hFbHyu',
    database: 'j88971792_perms',
  });

  const [results] = await pool.execute(sql, params);
  await pool.end();
  return results;
};

export const minecraftQuery = async (sql, params) => {
  const pool = mysql.createPool({
    host: 'mysql4.joinserver.xyz',
    port: 3306,
    user: 'u79998_jiFoTCUc01',
    password: 'af=cFurPtkdkIASZdittUId^',
    database: 's79998_minecraft',
  });

  const [results] = await pool.execute(sql, params);
  await pool.end();
  return results;
};