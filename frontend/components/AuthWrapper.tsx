"use client";

import { AuthProvider } from '../app/contexts/AuthContext';

export default function AuthWrapper({ children }: { readonly children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}