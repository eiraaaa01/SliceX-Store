'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/firebase/provider";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!auth) {
        setError("Auth service not available.");
        return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationSent) {
    return (
        <Card className="w-full max-w-sm border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Verify Your Email</CardTitle>
            <CardDescription className="text-muted-foreground">
            A verification link has been sent to your email address. Please check your inbox and follow the link to activate your account.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-center text-muted-foreground">
                Once verified, you can sign in.
            </p>
        </CardContent>
        <CardFooter>
             <Button asChild className="w-full">
                <Link href="/">Back to Sign In</Link>
            </Button>
        </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm border-primary/20 bg-card/80 backdrop-blur-sm">
        <form onSubmit={handleRegister}>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold animate-flicker">Create Account</CardTitle>
                <CardDescription className="text-muted-foreground">
                Join the neon revolution. It&apos;s free!
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="YourUsername" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" disabled={isSubmitting} className="w-full hover:drop-shadow-neon transition-all duration-300">
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
                <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/" className="underline text-primary/80 hover:text-primary">
                    Sign in
                </Link>
                </div>
            </CardFooter>
        </form>
    </Card>
  );
}
