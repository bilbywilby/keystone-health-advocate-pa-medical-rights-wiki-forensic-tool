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
import { DirectoryPage } from '@/pages/DirectoryPage'
import { AppealGeneratorPage } from '@/pages/AppealGeneratorPage'
import { EmergencyPage } from '@/pages/EmergencyPage'
const queryClient = new QueryClient();
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
    element: <DirectoryPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/appeal-generator",
    element: <AppealGeneratorPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/emergency",
    element: <EmergencyPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </QueryClientProvider>
    </StrictMode>,
  )
}