import mysql from "mysql2/promise";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = 8083;

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

console.log("working on it...");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.redirect("/login");
});

app.get("/login", async (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-r4NyQEXoIH7P57Dn67qmk2eR7YyyPQUtc7G7MRrsUEegMb1R3R0pvhM7T0tWjx1k"
        crossorigin="anonymous"
      >
    </head>
    <body class="bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-6">
            <h1 class="text-center mt-5">Login</h1>
            <form action="/login" method="post">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
            <p class="mt-3">Don't have an account? <a href="/register">Register</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  const [rows] = await connection.query(query);

  if (rows.length === 0) {
    res.send("Invalid username or password");
  } else {
    // add cookie and redirect to profile
    res.cookie("password", password);
    res.redirect("/profile/" + username);
  }
});

app.get("/register", async (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Register</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-r4NyQEXoIH7P57Dn67qmk2eR7YyyPQUtc7G7MRrsUEegMb1R3R0pvhM7T0tWjx1k"
        crossorigin="anonymous"
      >
    </head>
    <body class="bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-6">
            <h1 class="text-center mt-5">Register</h1>
            <form action="/register" method="post">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
            <p class="mt-3">Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;

  await connection.query(query);
  res.redirect("/login");
});

app.get("/profile/:profileName", async (req, res) => {
  const password = req.cookies.password;
  console.log("password", password);
  const profileName = req.params.profileName;

  // Query to verify user owns the profile
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const [rows] = await connection.query(query, [profileName, password]);
  const isOwnProfile = rows.length > 0;

  // Query to fetch the profile
  const secondQuery = `SELECT * FROM users WHERE username = ?`;
  const [secondRows] = await connection.query(secondQuery, [profileName]);

  if (secondRows.length === 0) {
    res.send("User not found");
    return;
  }

  const html = secondRows[0].html;

  // Dynamically build the HTML
  const profileHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Profile</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-r4NyQEXoIH7P57Dn67qmk2eR7YyyPQUtc7G7MRrsUEegMb1R3R0pvhM7T0tWjx1k"
        crossorigin="anonymous"
      >
    </head>
    <body class="bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-6">
            <h1 class="text-center mt-5">Profile</h1>
            <p class="text-center">Welcome, ${profileName}!</p>
            ${
              isOwnProfile
                ? `
            <div>
              <h2>Edit your account:</h2>
              <form action="/profile/${profileName}" method="post">
                <div class="mb-3">
                  <label for="html" class="form-label">HTML</label><br>
                  <textarea class="form-control" id="html" name="html"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
              </form>
            </div>`
                : ""
            }
            <h2>Profile:</h2>
            <div class="mt-3">
              ${html}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  res.send(profileHtml);
});

app.post("/profile/:profileName", async (req, res) => {
  const profileName = req.params.profileName;
  const { html } = req.body;
  const query = `UPDATE users SET html = '${html}' WHERE username = '${profileName}'`;
  await connection.query(query);
  res.redirect(`/profile/${profileName}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
