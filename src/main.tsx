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
const queryClient = new QueryClient();
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center space-y-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-muted-foreground">This tool is coming soon in the next phase.</p>
    <a href="/" className="text-amber-600 hover:underline">Back Home</a>
  </div>
);
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
    element: <Placeholder title="Forensic Toolkit" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/directory",
    element: <Placeholder title="Provider Directory" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/vault",
    element: <Placeholder title="Privacy Vault" />,
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