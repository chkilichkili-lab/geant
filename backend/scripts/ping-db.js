const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://kaim:karim25225418aaz@cluster0.mlt3tkr.mongodb.net/?appName=Cluster0";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  console.log('Attempting to connect with MongoClient (Cleaned Options)...');
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("CONNECTION FAILED!");
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
