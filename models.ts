export interface Users {
  id: number;
  email: string;
  boards: Boards[];
}
[];

export interface Boards {
  id: number;
  name: string;
  href: string;
  columns: Columns[];
}

export interface Columns {
  id: number;
  name: string;
  tasks: Tasks[];
  color: string;
}

export interface Tasks {
  id: number;
  name: string;
}
