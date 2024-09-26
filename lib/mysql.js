import mysql from 'mysql2';
const connection = mysql.createConnection({
  host: 'mysql3.joinserver.xyz',
  user: 'u79998_28B2CZ61g1',
  password: 'J9^E5=d^Xl.dyO@Fy4@LYi1f',
  database: 's79998_foxecosystem',
});
export default connection;

export async function getData(sql){
  const data = await connection.promise().query(sql);
  if(Object.keys(data).length === 0){
    return false;
  }
  return data;
}