const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();

const jsonParser = bodyParser.json();

// get URL from env
const url = process.env.ME_CONFIG_MONGODB_URL;
const client = new MongoClient(url);

const dbName = "goosemon";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/login.html"));
});

const filter = (input) => {
    if (typeof input === 'string') {
        return input.toLowerCase().includes('regex');
    }
  
    if (typeof input === 'object') {
        return JSON.stringify(input).toLowerCase().includes('regex');
    }
}

app.post("/login", jsonParser, async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send("Request body is missing");
      return;
    }
    if (filter(req.body)) {
        res.status(400).send("Nuh uh uh, no regex allowed!");
        return;
    }

    const db = client.db(dbName);
    const collection = db.collection("users");

    const data = collection.find(req.body);
    const result = await data.toArray();
    if (result.length > 0) {
      res.status(200).send("Login successful!");
    } else {
      res.status(400).send("Login failed!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(8080, async () => {
  await client.connect();
  console.log("Connected successfully to server");
  console.log("Server is running!");
});

app.get("/goosemon", (req, res) => {
    res.sendFile(path.join(__dirname, "/goosemon.html"));
});