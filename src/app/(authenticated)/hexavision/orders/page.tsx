import { Wrench } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <Wrench className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold tracking-tight">Under Development</h1>
      <p className="text-muted-foreground mt-2">
        The Employee panel is currently being built. Please check back later.
      </p>
    </div>
  );
}
