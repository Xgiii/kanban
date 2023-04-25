import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const session: any = await getSession({ req });
  const uid = new ObjectId(session?.user?._id);

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
    await boardsCol.insertOne({
      ...req.body.board,
      uid: new ObjectId(req.body.uid),
    });

    res.status(200).json('success');
  }
  client.close();
}
