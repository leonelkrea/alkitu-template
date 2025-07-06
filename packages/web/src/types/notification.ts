export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  type?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
};
