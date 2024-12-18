const { MongoClient } = require('mongodb');

// add the flag to the database
const url = process.env.ME_CONFIG_MONGODB_URL;
const client = new MongoClient(url);
const dbName = 'goosemon';
const flag = process.env.FLAG;
const userCollection = 'users';
const flagDoc = { username: "admin", password: flag };

(async () => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(userCollection);
    await collection.insertOne(flagDoc);
    console.log('Flag added to database');
    await client.close();
}
)();
