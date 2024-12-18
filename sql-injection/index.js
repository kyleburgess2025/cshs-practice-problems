const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 8081;

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  } else {
    console.log("Connected to database");
  }
});

// Serve the homepage with a search bar
app.get("/", (req, res) => {
  const searchQuery = req.query.search || "";
  const query = `SELECT name, description, isReleased FROM products WHERE name LIKE '%${searchQuery}%' AND isReleased = 1`;

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error fetching products");
    } else {
      const tableRows = results
        .map(
          (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.isReleased}</td>
          </tr>
        `
        )
        .join("");

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Products</title>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-r4NyQEXoIH7P57Dn67qmk2eR7YyyPQUtc7G7MRrsUEegMb1R3R0pvhM7T0tWjx1k"
            crossorigin="anonymous"
          >
        </head>
        <body class="bg-light">
          <div class="container my-5">
            <h1 class="text-center mb-4">Products</h1>
            <form class="d-flex mb-4" method="get" action="/">
              <input
                class="form-control me-2"
                type="search"
                name="search"
                placeholder="Search for a product"
                aria-label="Search"
                value="${searchQuery}"
              >
              <button class="btn btn-primary" type="submit">Search</button>
            </form>
            <table class="table table-striped">
              <thead class="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Released</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-w76AqxarZtEVO4fMdKBOGVpHrIvZyyQo4SR9ABXYY3NpZ4+4KX4pH1ATeKlKmxj9"
            crossorigin="anonymous"
          ></script>
        </body>
        </html>
      `;

      res.send(html);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
