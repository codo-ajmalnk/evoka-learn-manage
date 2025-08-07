import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/Layout/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" storageKey="evoka-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </ErrorBoundary>
);
