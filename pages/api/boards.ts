import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  const userEmail = 'test@test.com';

  if (!client) {
    res.status(500).json('Error connecting to database');
    return;
  }

  if (req.method === 'GET') {
    const usersCol = client.db().collection('users');
    const user = await usersCol.findOne({ email: userEmail });

    const boards = user?.boards || [];
    res.status(200).json(boards);
  }
  client.close();
}
