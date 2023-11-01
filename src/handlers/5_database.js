const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.mongoURI;
const dbName = "love";
const clction = "counts";

const maggie = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

maggie
  .connect()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = (client) => {
  const db = maggie.db(dbName);
  const collection = db.collection(clction);

  client.incrementCount = async (variable, sender, target) => {
    const filter = {
      $or: [
        { variable, sender, target },
        { variable, sender: target },
      ],
    };
    const entry = await collection.findOne(filter);

    if (entry) {
      console.log(entry.count);
      await collection.updateOne(filter, { $inc: { count: 1 } });
    } else {
      await collection.insertOne({ variable, sender, target, count: 1 });
    }
  };

  client.getCount = async (variable, sender, target) => {
    const filter = {
      $or: [
        { variable, sender, target },
        { variable, sender: target },
      ],
    };
    const results = await collection.find(filter).toArray();
    return results.reduce((total, row) => total + row.count, 0);
  };
};
