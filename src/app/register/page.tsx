'use client';
import AuthHeader from "@/components/auth-header";
import RegisterForm from "@/components/register-form";
import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    // Clear the profile completion flag when the user visits the register page
    // to prevent issues from previous incomplete sign-up attempts.
    sessionStorage.removeItem('profileCompletionInProgress');
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-4 z-10">
        <RegisterForm />
      </main>
    </div>
  );
}
