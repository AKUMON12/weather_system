import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx' // Ensure this matches your file extension (.tsx or .js)

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Initialize the Client
const queryClient = new QueryClient();

// 2. Create the root and render (This fixes the 'root' not found error)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);