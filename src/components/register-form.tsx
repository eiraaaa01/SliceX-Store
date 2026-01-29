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

export default function RegisterForm() {
  return (
    <Card className="w-full max-w-sm border-primary/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold animate-flicker">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Join the neon revolution. It&apos;s free!
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="YourUsername" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
         <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" placeholder="••••••••" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full hover:drop-shadow-neon transition-all duration-300">
          Create Account
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="underline text-primary/80 hover:text-primary">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
