'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HexaVisionRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/hexavision/dashboard');
  }, [router]);
  return null;
}
