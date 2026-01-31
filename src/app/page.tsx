import AuthHeader from "@/components/auth-header";
import LoginForm from "@/components/login-form";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-4 z-10">
        <LoginForm />
      </main>
    </div>
  );
}
