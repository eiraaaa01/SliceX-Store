'use client';
import AuthHeader from "@/components/auth-header";
import LoginForm from "@/components/login-form";
import { useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isUserLoading) {
      showLoading();
      return () => hideLoading();
    }
  }, [isUserLoading, showLoading, hideLoading]);

  useEffect(() => {
    sessionStorage.removeItem('profileCompletionInProgress');

    if (!isUserLoading && user) {
      router.replace('/home');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
     return null;
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
