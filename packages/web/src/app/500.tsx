'use client';

import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl font-bold text-muted-foreground">500</div>
        <h1 className="text-2xl font-bold">Server-side error occurred</h1>
        <p className="text-muted-foreground">We are sorry, but something went wrong on our end.</p>
        <Link href="/">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Return Home</button>
        </Link>
      </div>
    </div>
  );
}
