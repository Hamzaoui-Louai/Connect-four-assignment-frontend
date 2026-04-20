import { createBrowserRouter, RouterProvider } from 'react-router';
import Background from './components/Background';
import Landing from './pages/Landing';
import Game from './pages/Game';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/game',
    element: <Game />,
  }
]);

function App() {
  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      <div style={{ overflow: 'hidden', height: '100vh' }}>
        <Background />
      </div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
