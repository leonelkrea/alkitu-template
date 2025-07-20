'use client';

import Link from 'next/link';
import { Button } from '@/components/adapters/Button';
import { Typography } from '@/components/adapters/Typography';

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <Typography variant="h1" className="text-6xl font-bold text-muted-foreground" migrated={true}>500</Typography>
        <Typography variant="h1" className="text-2xl font-bold" migrated={true}>Server-side error occurred</Typography>
        <Typography variant="body" className="text-muted-foreground" migrated={true}>We are sorry, but something went wrong on our end.</Typography>
        <Button asChild migrated={true}>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
