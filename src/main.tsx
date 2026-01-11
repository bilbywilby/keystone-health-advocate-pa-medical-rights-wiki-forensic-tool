import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { WikiPage } from '@/pages/WikiPage'
import { ToolsPage } from '@/pages/ToolsPage'
import { VaultPage } from '@/pages/VaultPage'
const queryClient = new QueryClient();
const ComingSoon = ({ title }: { title: string }) => (
  <AppLayout>
    <div className="p-20 text-center space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">This tool is coming in Phase 3.</p>
      <a href="/" className="text-amber-600 hover:underline">Back Home</a>
    </div>
  </AppLayout>
);
// We keep Placeholder as a separate component exported from another file if needed, 
// but here we use it inline to satisfy the router for yet-to-be-built pages.
import { AppLayout } from '@/components/layout/AppLayout';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/wiki",
    element: <WikiPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/wiki/:slug",
    element: <WikiPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/tools",
    element: <ToolsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vault",
    element: <VaultPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/directory",
    element: <ComingSoon title="Provider Directory" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/emergency",
    element: <ComingSoon title="Emergency Rights" />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)