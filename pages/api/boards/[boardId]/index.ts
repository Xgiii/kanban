import { MongoClient, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);

  const session: any = await getSession({ req });

  const { boardId } = req.query;

  if (!client) {
    res.status(500).json('Error connecting to database');
    return;
  }

  const boardsCol = client.db().collection('boards');
  const board = await boardsCol.findOne({ href: '/' + boardId });
  const columnsCol = client.db().collection('columns');

  if (req.method === 'GET') {
    const uid = new ObjectId(session?.user?._id);
    const columns = await columnsCol
      .find({ bid: board?._id, uid: uid })
      .toArray();
    res.status(200).json(columns);
  }

  if (req.method === 'POST') {
    const { column, uid } = req.body;

    if (!column.name) {
      res.status(400).json('Column name is required');
      client.close();
      return;
    }

    const result = await columnsCol.insertOne({
      ...column,
      bid: new ObjectId(board?._id),
      uid: new ObjectId(uid),
    });
    res.status(200).json(result);
  }

  if (req.method === 'PUT') {
    const { colId, uid } = req.body;

    if (!colId) {
      res.status(400).json('Column id is required');
      client.close();
      return;
    }

    await columnsCol.deleteOne({ _id: new ObjectId(colId) });

    const columns = await columnsCol
      .find({ bid: new ObjectId(board?._id), uid: new ObjectId(uid) })
      .toArray();

    res.status(200).json(columns);
  }
  client.close();
}
