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

  const { boardId } = req.query;

  const boardsCol = client.db().collection('boards');
  const board = await boardsCol.findOne({ href: '/' + boardId });

  if (req.method === 'POST') {
    const { title, description, colId, uid } = req.body;

    const columnsCol = client.db().collection('columns');

    if (!title || !colId) {
      res.status(400).json('Invalid request');
      client.close();
      return;
    }

    await columnsCol.updateOne(
      { _id: new ObjectId(colId) },
      { $push: { tasks: { title, description, status: colId } } }
    );

    const updatedTasks = await columnsCol
      .find({ bid: new ObjectId(board?._id), uid: new ObjectId(uid) })
      .toArray();
    res.status(200).json(updatedTasks);
  }

  if (req.method === 'PATCH') {
    const { title, oldStatus, newStatus, description, uid } = req.body;

    const columnsCol = client.db().collection('columns');

    if (!title || !oldStatus || !newStatus) {
      res.status(400).json('Invalid request');
      return;
    }

    await columnsCol.updateOne(
      { _id: new ObjectId(oldStatus) },
      { $pull: { tasks: { title: title } } }
    );

    await columnsCol.updateOne(
      { _id: new ObjectId(newStatus) },
      { $push: { tasks: { title, description, status: newStatus } } }
    );

    const updatedTasks = await columnsCol
      .find({ bid: new ObjectId(board?._id), uid: new ObjectId(uid) })
      .toArray();
    res.status(200).json(updatedTasks);
  }

  if (req.method === 'PUT') {
    const { title, status, uid } = req.body;

    const columnsCol = client.db().collection('columns');

    if (!title || !status) {
      res.status(400).json('Invalid request');
      return;
    }

    await columnsCol.updateOne(
      { _id: new ObjectId(status) },
      { $pull: { tasks: { title } } }
    );

    const updatedTasks = await columnsCol
      .find({ bid: new ObjectId(board?._id), uid: new ObjectId(uid) })
      .toArray();
    res.status(200).json(updatedTasks);
  }

  client.close();
}
