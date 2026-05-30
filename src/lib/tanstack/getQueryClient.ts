import { HttpError } from '@/lib/http-error';
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  environmentManager,
} from '@tanstack/react-query';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, //60 seconds
        gcTime: 10 * 60 * 1000, //10 minutes
        retry: (failureCount, error) => {
          if (
            error instanceof HttpError &&
            (error.status === 401 || error.status === 403)
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: () => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
};
