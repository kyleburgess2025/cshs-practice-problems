import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// create the users and products tables
try {
  const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;

  await connection.query(createUsersTable);
  console.log("created");

  const createProductsTable = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  isReleased BOOLEAN DEFAULT 0
)
`;

  await connection.query(createProductsTable);

  const flag = process.env.FLAG;
  const second_flag = process.env.SECOND_FLAG;
  const username = "admin";
  const password = second_flag;

  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
  await connection.query(query);
  const productName = "flag";
  const productDescription = flag;

  const query2 = `INSERT INTO products (name, description, isReleased) VALUES ('${productName}', '${productDescription}', 0)`;
  await connection.query(query2);
  console.log("flag inserted");

  // add a few other users and products
  const users = [
    { username: "alice", password: "password" },
    { username: "bob", password: "password" },
    { username: "charlie", password: "password" },
  ];

  const products = [
    { name: "apple", description: "a fruit", isReleased: 1 },
    { name: "banana", description: "a fruit", isReleased: 1 },
    { name: "carrot", description: "a vegetable", isReleased: 1 },
  ];

  for (const user of users) {
    const query = `INSERT INTO users (username, password) VALUES ('${user.username}', '${user.password}')`;
    await connection.query(query);
  }

  for (const product of products) {
    const query = `INSERT INTO products (name, description, isReleased) VALUES ('${product.name}', '${product.description}', ${product.isReleased})`;
    await connection.query(query);
  }
} catch (e) {
  console.log(e);
}
process.exit(0);
