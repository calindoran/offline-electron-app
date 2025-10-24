import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Layout from '@/components/Layout'

export const Route = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools position="bottom-right" />}
    </>
  ),
})
