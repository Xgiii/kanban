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
    const boards = await boardsCol
      .find({ uid: new ObjectId(req.body.uid) })
      .toArray();

    if (req.body.board.href.length < 3) {
      res.status(400).json('Invalid data');
      client.close();
      return;
    }

    if (boards.find((board) => board.href === req.body.board.href)) {
      res.status(400).json('Board with this name already exists');
      client.close();
      return;
    }

    await boardsCol.insertOne({
      ...req.body.board,
      uid: new ObjectId(req.body.uid),
    });

    res.status(200).json('success');
  }

  if (req.method === 'PUT') {
    const { uid, href } = req.body;

    const columnsCol = client.db().collection('columns');
    const board = await boardsCol.findOne({ uid, href });

    await columnsCol.deleteMany({ boardId: board?._id });
    await boardsCol.deleteOne({ uid: new ObjectId(uid), href });

    res.status(200).json('success');
  }
  client.close();
}
