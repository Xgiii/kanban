import { ObjectId } from 'mongodb';

export interface Users {
  _id?: ObjectId;
  id: number;
  email: string;
}
[];

export interface Board {
  _id?: ObjectId;
  name: string;
  href: string;
}

export interface Column {
  _id: ObjectId;
  name: string;
  color: string;
  tasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  status: string;
}
