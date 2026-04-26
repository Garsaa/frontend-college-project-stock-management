import { RouterProvider } from 'react-router-dom';

import { ToastViewport } from '@/components/ui/toast-viewport';
import { appRouter } from '@/routes';

export function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <ToastViewport />
    </>
  );
}
