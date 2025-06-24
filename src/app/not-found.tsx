'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center flex-col text-center gap-4 p-6">
      <h1 className="text-2xl font-semibold text-muted-foreground">404</h1>
      <p className="text-muted-foreground text-sm">This page could not be found.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
      >
        Go back to dashboard
      </Link>
    </div>
  );
}