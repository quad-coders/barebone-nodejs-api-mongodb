// Problem statement
/*
2/ Using the Node.js MongoDB driver, write a query that will return the most expensive item of group B, if the items collection has documents of the following form:
{
  "_id" : "item1",
  "description" : "First item",
  "group" : "A",
  "price" : 12
}

What index would you create to optimize this query?
What would be the query to insert or update “item1” with a price of 14?

Answer:
1. Since this query is doing reading based on sorted items, we could add compound index on column `_id` and `price`. The first index, `id`, is high selectivity column which will result in less records. The second index is for sorting, since our query requires getting the most expensive item, it means this requires sorting by the `price` column in descending order

2. The query to update or insert is as follow:
```
const filter = { _id: itemId };
const options = { upsert: true };

// Create a document to update
const updateDoc = {
  $set: {
    price: price
  }
};

let collection = await this.getCollection(client);
const result = await collection.updateOne(filter, updateDoc, options);
```

First we filter by the `_id` then configure option for `upsert`.
Then we create an object for document to modify/insert.
Lastly get collection, in the code above, i create another method to retrieve the collection from MongoDb.
Once we have the collection, we invoke `updateOne` method from MongoDb library and pass in the filter, updated document and the option.
*/

import { MongoClient } from 'mongodb';
import { Logging } from './logging-service.js';

class MongoApp {
  constructor() {
    // Setup logging service
    this.logger = new Logging();

    // Replace the uri string with your MongoDB deployment's connection string
    this.uri = '';

    // Database and collection name
    this.databaseName = 'Gurobi';
    this.collectionName = 'Test';
  }

  // Method to create new instance of Mongo client
  getClient() {
    this.logger.log('Invoke getClient()');

    // Create new instance of Mongo client
    return new MongoClient(this.uri);
  }

  // Async method to get collection from MongoDb
  async getCollection(client) {
    this.logger.log('Invoke getCollection()');

    // Return null if client is empty
    if (client == null) {
      return null;
    }

    // Connect to MongoDb and retrieve database and collection, the await will run in event loop and wait for the call to finish
    await client.connect();
    const database = client.db(this.databaseName);
    const collection = database.collection(this.collectionName);

    return collection;
  }

  async read(group) {
    this.logger.log('Invoke read()');

    // Get MongoDb client
    let client = this.getClient();

    // Error handling
    try {
      // Setup query and the option for query. The `query` value is taken from parameter. We also sort by `price` in descending order (-1) to get the most expensive item
      const query = { group: group };
      const options = {
        sort: { 'price': -1 }
      };

      // Get MongoDb collection
      // The await will run in event loop and wait for the call to finish
      let collection = await this.getCollection(client);

      // Execute the query by invoke `findOne`, which will return scalar result
      // The await will run in event loop and wait for the call to finish
      const result = await collection.findOne(query, options);

      this.logger.log(result);
    } finally {
      // Always close the connection
      await client.close();
    }
  }

  // The upsert() method take itemId and price parameter. This method will update if document already exist and insert if it doesn't yet exist
  async upsert(itemId, price) {
    this.logger.log('Invoke update()');

    // Get MongoDb client
    let client = this.getClient();

    // Error handling
    try {
      // Setup filter and the option for updating/inserting, we set the options `upsert` to true so that when the document doesn't exist, it will create a new document
      const filter = { _id: itemId };
      const options = { upsert: true };

      // The document to update/insert, here we want to update the `price`, the value of `price` is taken form method's parameter
      const updateDoc = {
        $set: {
          price: price
        }
      };

      // Get MongoDb collection
      // The await will run in event loop and wait for the call to finish
      let collection = await this.getCollection(client);

      // Execute command to update the collection, passing the filter we will use, the document and the options
      // The await will run in event loop and wait for the call to finish
      const result = await collection.updateOne(filter, updateDoc, options);

      this.logger.log(`Filter result ${result.matchedCount} documents, updated ${result.modifiedCount} documents`);
    } finally {
      // Always close the connection
      await client.close();
    }
  }
}

// Sample call
(async function () {
  // Create new instance of the app
  let mongoApp = new MongoApp();

  // Read group B
  await mongoApp.read('B').catch(console.dir);

  // Update item1 price to 14
  await mongoApp.upsert('item1', 14).catch(console.dir);
})();
