import { RouterProvider } from 'react-router/dom';
import { createRouter } from './router';

const router = createRouter();

export function App() {
  return <RouterProvider router={router} />;
}
