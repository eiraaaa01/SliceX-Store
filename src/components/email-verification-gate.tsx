'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '@/firebase/provider';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function EmailVerificationGate({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const auth = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
            router.push('/');
        }
    };

    const handleResendVerification = async () => {
        if (user) {
            try {
                await sendEmailVerification(user);
                toast({
                    title: "Verification Email Sent",
                    description: "A new verification link has been sent to your email address.",
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to resend verification email. Please try again later.",
                });
            }
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (user && !user.emailVerified) {
        return (
            <div className="flex h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center border-primary/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                        <CardDescription>
                            Your account has been created, but you need to verify your email address to continue. A verification link has been sent to <strong>{user.email}</strong>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Please check your inbox (and spam folder) and click the link to activate your account.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleResendVerification} className="w-full sm:w-auto flex-grow">Resend Verification Email</Button>
                        <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto flex-grow">Sign Out</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (user && user.emailVerified) {
        return <>{children}</>;
    }

    return null; // or a loading spinner
}
