"use client";

import { useAuth } from './contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { username, logout, isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">CMS dashboard</h1>
      {isAuthenticated ? (
        <div>
          <p className="mb-4">Welcome, {username ?? 'User'}!</p>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </Link>
      )}
    </main>
  );
}
