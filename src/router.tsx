import type { AnyRoute } from '@tanstack/react-router';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFound } from '@/components/NotFound';
import { routeTree } from './routeTree.gen';

interface CreateRouterOptions<TRouteTree extends AnyRoute> {
  debug?: boolean;
  routeTree: TRouteTree;
}

function createRouter<TRouteTree extends AnyRoute>({ routeTree, debug = false }: CreateRouterOptions<TRouteTree>) {
  const router = createTanStackRouter({
    context: null,
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultHashScrollIntoView: { behavior: 'smooth' },
    defaultStructuralSharing: true,
    defaultErrorComponent: (props) => <DefaultCatchBoundary {...props} />,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return router;
}

export function getRouter() {
  const router = createRouter<typeof routeTree>({
    routeTree,
    debug: import.meta.env.DEV,
  });

  return router;
}
