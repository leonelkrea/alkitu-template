'use client';
import React from 'react';
import { trpcReact } from '@/lib/trpc';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

const UserDetailPage = ({ params }: { params: { userEmail: string } }) => {
  const { userEmail } = params;
  const {
    data: user,
    isLoading,
    isError,
  } = trpcReact.user.getUserByEmail.useQuery({ email: userEmail });

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (isError) {
    return <div>Error loading user details.</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details: {user.email}</CardTitle>
        <CardDescription>View and edit user information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user.name ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue={user.lastName ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user.email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue={user.role} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="createdAt">Created At</Label>
            <Input
              id="createdAt"
              defaultValue={new Date(user.createdAt).toLocaleDateString()}
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastLogin">Last Login</Label>
            <Input
              id="lastLogin"
              defaultValue={
                user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : 'N/A'
              }
              disabled
            />
          </div>
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailPage;
