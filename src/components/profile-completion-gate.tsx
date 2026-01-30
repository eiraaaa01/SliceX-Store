'use client';

import { useUser, useFirestore, useMemoFirebase, useDoc, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


function ProfileCompletionModal({ user, onComplete }: { user: User, onComplete: () => void }) {
    const [name, setName] = useState(user.displayName || '');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const firestore = useFirestore();
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }
        setError(null);
        setIsSubmitting(true);

        try {
            // Check for username uniqueness
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Username already exists. Please choose another one.');
                setIsSubmitting(false);
                return;
            }

            // Update Auth profile
            await updateProfile(user, { displayName: name });

            // Create Firestore document
            const userDocRef = doc(firestore, 'users', user.uid);
            setDocumentNonBlocking(userDocRef, {
                id: user.uid,
                username: username,
                name: name,
                email: user.email,
                isEmailVerified: user.emailVerified,
                registrationDate: new Date().toISOString(),
            }, { merge: false });

            toast({
                title: "Profile complete!",
                description: "Welcome! Your registration is now complete.",
            });

            onComplete();

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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="col-span-3" required />
                        </div>
                         {error && <p className="col-span-4 text-center text-sm text-destructive">{error}</p>}
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

    const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

    useEffect(() => {
        if (isUserLoading || isProfileLoading) {
            return;
        }

        const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');
        const profileIncomplete = isGoogleUser && !userProfile;
        
        setShowModal(profileIncomplete);

    }, [user, isUserLoading, userProfile, isProfileLoading]);

    if (isUserLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            {children}
            {showModal && user && (
                <ProfileCompletionModal user={user} onComplete={() => setShowModal(false)} />
            )}
        </>
    );
}
