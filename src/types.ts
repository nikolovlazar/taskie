type Base = {
  createdAt: Date;
  id: string;
};

export type Task = Base & {
  startedAt: Date;
  completedAt: Date;
  name: string;
  workSession: WorkSession;
};

export type WorkSession = Base & {
  name: string;
  tasks: Task[];
};
