import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './theme-provider'
import { Toaster } from 'sonner'
import { WebSocketProvider } from './websocket-provider'
const queryClient = new QueryClient()

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <WebSocketProvider>
          <Toaster closeButton richColors />
          {children}
        </WebSocketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers
