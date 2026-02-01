'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { useLoading } from '@/context/LoadingContext';

const VERIFICATION_TIMEOUT_SECONDS = 120; // 2 minutes

export default function EmailVerificationGate({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [timeLeft, setTimeLeft] = useState(VERIFICATION_TIMEOUT_SECONDS);
    const [isChecking, setIsChecking] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        if (isUserLoading) {
            showLoading();
            return () => hideLoading();
        }
    }, [isUserLoading, showLoading, hideLoading]);

    // This effect handles the timer and periodic user reload
    useEffect(() => {
        // Only run this logic for unverified users
        if (user && !user.emailVerified) {
            setIsChecking(true);

            // Start an interval to reload the user and check verification status
            intervalRef.current = setInterval(async () => {
                // The reload might fail if the user was deleted, so wrap in try/catch
                try {
                    await user.reload();
                } catch (error) {
                     if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                     }
                }
                setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);

        } else if (intervalRef.current) {
            // If user becomes verified or logs out, clear interval
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [user]);

    // This effect handles timer expiration
    useEffect(() => {
        if (timeLeft === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if(isChecking){ // Only toast if it was running
                setIsChecking(false);
                toast({
                    variant: "destructive",
                    title: "Verification Time Expired",
                    description: "Please request a new verification email.",
                });
            }
        }
    }, [timeLeft, isChecking, toast]);


    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    const handleResendVerification = async () => {
        if (user) {
            try {
                await sendEmailVerification(user);
                toast({
                    title: "Verification Email Sent",
                    description: "A new verification link has been sent to your email address.",
                });
                // Reset the timer when user resends
                setTimeLeft(VERIFICATION_TIMEOUT_SECONDS);
                if (!isChecking) {
                    setIsChecking(true);
                }
                 if (!intervalRef.current) {
                    intervalRef.current = setInterval(async () => {
                        try {
                           await user.reload();
                        } catch(e) {
                             if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                             }
                        }
                        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
                    }, 1000);
                }

            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to resend verification email. Please try again later.",
                });
            }
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    if (isUserLoading) {
        return null;
    }

    if (user && !user.emailVerified) {
        const progress = (timeLeft / VERIFICATION_TIMEOUT_SECONDS) * 100;
        return (
            <div className="flex h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center bg-card shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                        <CardDescription>
                            A verification link has been sent to <strong>{user.email}</strong>. Please check your inbox and click the link to activate your account.
                             <div className="pt-2 text-xs text-muted-foreground">
                                Can't find the email? Be sure to check your spam folder.
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {isChecking ? (
                             <div>
                                <p className="text-lg font-mono font-semibold text-primary">
                                    {formatTime(timeLeft)}
                                </p>
                                <Progress value={progress} className="w-full mt-2 h-2" />
                                <p className="text-sm text-muted-foreground mt-2">
                                    This page will automatically update once you've verified your email.
                                </p>
                            </div>
                        ) : (
                             <p className="text-sm text-muted-foreground">
                                Your verification time has expired. Please resend the verification email.
                            </p>
                        )}
                       
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleResendVerification} className="w-full" disabled={isChecking}>Resend Verification Email</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (user && user.emailVerified) {
        return <>{children}</>;
    }

    return null;
}
