'use client';
import AuthHeader from "@/components/auth-header";
import LoginForm from "@/components/login-form";
import { useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Clear the profile completion flag when the user visits the login page
    // to prevent issues from previous incomplete sign-up attempts.
    sessionStorage.removeItem('profileCompletionInProgress');

    if (!isUserLoading && user) {
      router.replace('/home');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-4 z-10">
        <LoginForm />
      </main>
    </div>
  );
}
