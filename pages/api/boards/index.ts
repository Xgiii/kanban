import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  const uid = new ObjectId('643fbf8449f90208b0ad7385');

  if (!client) {
    res.status(500).json('Error connecting to database');
    return;
  }

  const boardsCol = client.db().collection('boards');

  if (req.method === 'GET') {
    const boards = await boardsCol.find({ uid }).toArray();

    res.status(200).json(boards);
  }

  if (req.method === 'POST') {
    // TODO: validate if board with same href/name exists

    await boardsCol.insertOne({ ...req.body.board, uid });

    res.status(200).json('success');
  }
  client.close();
}
