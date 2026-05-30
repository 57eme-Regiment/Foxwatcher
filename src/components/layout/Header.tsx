import { Link } from '@tanstack/react-router';
import { AuthButton } from '../auth/authButton';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-8">
        <Link to="/" className="font-bold text-lg tracking-tight">
          FoxWatcher
        </Link>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
