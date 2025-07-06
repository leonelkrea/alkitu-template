'use client';
import React from 'react';
import { trpcReact } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  contactNumber: string | null;
  role: string;
  createdAt: string;
  lastLogin: string | null;
}

const UsersPage = () => {
  const { lang } = useParams();
  const { data: users, isLoading, isError } = trpcReact.user.getAllUsers.useQuery();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error loading users.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage your application users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link href={`/${lang}/dashboard/users/${user.email}`}>
                    {user.email}
                  </Link>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UsersPage;