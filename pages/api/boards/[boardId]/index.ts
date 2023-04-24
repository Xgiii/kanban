import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  const uid = new ObjectId('643fbf8449f90208b0ad7385');
  const { boardId } = req.query;

  if (!client) {
    res.status(500).json('Error connecting to database');
    return;
  }

  const boardsCol = client.db().collection('boards');
  const board = await boardsCol.findOne({ href: boardId });
  const columnsCol = client.db().collection('columns');

  if (req.method === 'GET') {
    const columns = await columnsCol.find({ bid: board?._id }).toArray();
    res.status(200).json(columns);
  }

  if (req.method === 'POST') {
    const { column } = req.body;

    const result = await columnsCol.insertOne({
      ...column,
      bid: board?._id,
      uid,
    });
    res.status(200).json(result);
  }
  client.close();
}
