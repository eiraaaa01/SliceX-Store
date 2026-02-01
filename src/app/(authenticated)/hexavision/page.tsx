'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useLoading } from '@/context/LoadingContext';


export default function HexaVisionRedirect() {
  const router = useRouter();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { showLoading, hideLoading } = useLoading();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{isAdmin?: boolean, isEmployee?: boolean}>(userDocRef);
  const isLoading = isAuthLoading || isProfileLoading;

  useEffect(() => {
    if (isLoading) {
      showLoading();
      return () => hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);
  
  useEffect(() => {
    if (isLoading) return;

    if (userProfile?.isAdmin) {
      router.replace('/hexavision/dashboard');
    } else if (userProfile?.isEmployee) {
      router.replace('/hexavision/services');
    } else {
      // If user is neither, or profile is not loaded, send them home.
      router.replace('/home');
    }
  }, [isLoading, userProfile, router]);
  
  return null;
}
