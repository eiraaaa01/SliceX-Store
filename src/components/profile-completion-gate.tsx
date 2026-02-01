'use client';

import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useEffect, useState, type FormEvent } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { updateProfile, updatePassword } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';


function ProfileCompletionModal({ user, onComplete }: { user: User, onComplete: () => void }) {
    const [name, setName] = useState(user.displayName || '');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const firestore = useFirestore();
    const { toast } = useToast();
    const { withLoading } = useLoading();
    const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !name.trim()) {
            setError("Name and Username are required.");
            return;
        }

        if (!isGoogleUser) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (!password) {
                setError("Password is required.");
                return;
            }
        }
        
        setError(null);
        setIsSubmitting(true);

        const completeProfileAction = async () => {
            if (!firestore) {
                throw new Error("Firestore is not available.");
            }
            await runTransaction(firestore, async (transaction) => {
                const usernameDocRef = doc(firestore, "usernames", username.toLowerCase());
                const usernameDoc = await transaction.get(usernameDocRef);

                if (usernameDoc.exists()) {
                    throw new Error("Username already exists. Please choose another one.");
                }

                // If username is available, reserve it and create the user profile
                transaction.set(usernameDocRef, { uid: user.uid });
                
                const userDocRef = doc(firestore, 'users', user.uid);
                transaction.set(userDocRef, {
                    id: user.uid,
                    username: username,
                    name: name,
                    email: user.email,
                    isEmailVerified: user.emailVerified,
                    registrationDate: new Date().toISOString(),
                    coins: 0,
                    walletBalance: 0,
                });
            });

            // If transaction is successful, update Auth profile and password, then notify user
            await updateProfile(user, { displayName: name });
            if (!isGoogleUser) {
              await updatePassword(user, password);
            }

            toast({
                title: "Profile complete!",
                description: "Welcome! Your registration is now complete.",
            });

            sessionStorage.removeItem('profileCompletionInProgress');
            onComplete();

        };

        try {
            await withLoading(completeProfileAction)();
        } catch (err: any) {
            setError(err.message);
            toast({
                variant: 'destructive',
                title: "An error occurred",
                description: err.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={true}>
            <DialogContent 
                onPointerDownOutside={(e) => e.preventDefault()}
                onKeyDown={(e) => { if(e.key === 'Escape') e.preventDefault()}}
                className="sm:max-w-[425px]"
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Complete Your Profile</DialogTitle>
                        <DialogDescription>
                            Welcome! Please provide a few more details to finish setting up your account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        {!isGoogleUser && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" required />
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShowPassword((prev) => !prev)}>
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <div className="relative">
                                        <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10" required />
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                         {error && <p className="text-center text-sm text-destructive">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save and Continue'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [showModal, setShowModal] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const userDocRef = useMemoFirebase(() => (user && firestore ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
    const isLoading = isUserLoading || isProfileLoading;

    useEffect(() => {
      if (isLoading) {
        showLoading();
        return () => {
          hideLoading();
        };
      }
    }, [isLoading, showLoading, hideLoading]);

    useEffect(() => {
        if (isLoading || !user) {
            return;
        }

        const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');
        const profileIncomplete = isGoogleUser && !userProfile;
        
        if (profileIncomplete) {
            sessionStorage.setItem('profileCompletionInProgress', 'true');
            setShowModal(true);
        } else {
            // If the user profile is complete, we can safely remove the flag.
            sessionStorage.removeItem('profileCompletionInProgress');
            setShowModal(false);
        }

    }, [user, userProfile, isLoading]);

    const handleComplete = () => {
        setShowModal(false);
    };

    if (isLoading) {
        return null;
    }
    
    return (
        <>
            {children}
            {showModal && user && (
                <ProfileCompletionModal user={user} onComplete={handleComplete} />
            )}
        </>
    );
}
