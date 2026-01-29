import Link from "next/link";
import { Logo } from "./logo";

export default function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-start">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
        </div>
      </div>
    </header>
  );
}
