'use client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import React from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
