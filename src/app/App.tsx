/**
 * EarsForYou - Premium Emotional Wellness Application
 * A comprehensive mental wellness platform with mood tracking, journaling, and AI insights
 */

import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { AppProvider } from './context/AppContext';
import { router } from './routes';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </AppProvider>
  );
}
