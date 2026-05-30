import { authClient } from '@/lib/auth';
import { Button } from '../ui/button';

export const SignInButton = () => {
  return (
    <Button
      onClick={() =>
        authClient.signIn.social({
          provider: 'discord',
          callbackURL: 'http://foxwatcher.57regiment.local:5174',
        })
      }>
      Login
    </Button>
  );
};
