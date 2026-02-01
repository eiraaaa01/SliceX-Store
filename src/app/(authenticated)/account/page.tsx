'use client';
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(userDocRef);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if(user && userDocRef) {
        try {
            await updateProfile(user, { displayName: name });
            // Also update the name in the firestore document
            await setDoc(userDocRef, { name: name }, { merge: true });
            toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user) return;
    if (newPassword !== confirmNewPassword) {
      toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
      return;
    }
    if (!currentPassword) {
      toast({ variant: "destructive", title: "Error", description: "Please enter your current password." });
      return;
    }

    try {
      if(user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information.
        </p>
      </div>
      <div className={`grid gap-6 ${isGoogleUser ? '' : 'md:grid-cols-2'}`}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              {isProfileLoading ? <Skeleton className="h-10 w-full" /> : <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              {isProfileLoading ? <Skeleton className="h-10 w-full" /> : <Input id="username" value={userProfile?.username || ''} disabled />}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProfileUpdate} className="ml-auto hover:brightness-110 transition-all duration-300">Save Changes</Button>
          </CardFooter>
        </Card>

        {!isGoogleUser && (
            <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Set a new password for your account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                    <Input id="current-password" type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pr-10"/>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                    <Input id="new-password" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pr-10"/>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShowNewPassword((prev) => !prev)}>
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <div className="relative">
                    <Input id="confirm-new-password" type={showConfirmNewPassword ? "text" : "password"} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="pr-10"/>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirmNewPassword((prev) => !prev)}>
                    {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handlePasswordUpdate} className="ml-auto hover:brightness-110 transition-all duration-300">Update Password</Button>
            </CardFooter>
            </Card>
        )}
      </div>
    </div>
  );
}
