import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
