import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  if (!client) {
    res.status(500).json('Error connecting to database');
    return;
  }

  if (req.method === 'POST') {
    const { title, description, colId } = req.body;

    const columnsCol = client.db().collection('columns');

    if (!title || !description || !colId) {
      res.status(400).json('Invalid request');
      return;
    }

    const result = await columnsCol.updateOne(
      { _id: new ObjectId(colId) },
      { $push: { tasks: { title, description } } }
    );

    res.status(200).json(result);
  }

  client.close();
}
