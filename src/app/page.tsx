'use client';
import AuthHeader from "@/components/auth-header";
import LoginForm from "@/components/login-form";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    // Clear the profile completion flag when the user visits the login page
    // to prevent issues from previous incomplete sign-up attempts.
    sessionStorage.removeItem('profileCompletionInProgress');
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-4 z-10">
        <LoginForm />
      </main>
    </div>
  );
}
