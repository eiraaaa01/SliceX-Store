'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, FileText } from "lucide-react";

const transactions: any[] = []; // Mock data for now

export default function WalletPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile } = useDoc<{walletBalance?: number}>(userDocRef);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">My Wallet</h1>
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <WalletIcon className="h-6 w-6" />
                            <span>Current Balance</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">
                            ₹{userProfile?.walletBalance?.toFixed(2) ?? '0.00'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Available funds</p>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>A record of your recent wallet activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {transactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell>{tx.date}</TableCell>
                                            <TableCell>{tx.description}</TableCell>
                                            <TableCell>
                                                <Badge variant={tx.type === 'Credit' ? 'default' : 'secondary'}>
                                                    {tx.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-right font-medium ${tx.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                {tx.type === 'Credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-card/50">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <h2 className="text-xl font-semibold">No Transactions Yet</h2>
                                <p className="text-muted-foreground mt-2">Your wallet transactions will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
