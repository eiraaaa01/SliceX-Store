import AuthHeader from "@/components/auth-header";
import { FallingEmojis } from "@/components/falling-emojis";
import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden">
      <FallingEmojis />
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center p-4 z-10">
        <RegisterForm />
      </main>
    </div>
  );
}
