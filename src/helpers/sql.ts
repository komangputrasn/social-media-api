import connection from "./db";

const querySql = (queryString: string) => {
  return new Promise((resolve, reject) => {
    connection.connect();
    connection.query(queryString, (error, results) => {
      if (error) {
        reject(error);
      }
      if (results) {
        resolve(results);
      }
    });
    connection.end();
  });
};

export default querySql;
