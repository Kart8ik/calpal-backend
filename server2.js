// const express = require('express');
// const { MongoClient } = require('mongodb');
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// // Replace with your MongoDB connection string
// const MONGO_URI = 'mongodb://127.0.0.1:27017';
// const client = new MongoClient(MONGO_URI);

// app.use(cors());
// app.use(express.json());

// let db;

// client.connect().then(() => {
//   db = client.db('Calpal'); // Replace with your database name
//   console.log('Connected to MongoDB');
// });

// // Fetch all groups
// app.get('/api/groups', async (req, res) => {
//   try {
//     const groups = await db.collection('groups').find().toArray();
//     res.json(groups);
//   } catch (error) {
//     console.error('Error fetching groups:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // No need for a separate members endpoint as the data is already structured
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
