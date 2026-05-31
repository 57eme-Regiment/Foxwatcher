import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-8 py-6">
          <Outlet />
        </main>
        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools position="bottom-left" />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        )}
      </div>
    </ThemeProvider>
  ),
});
