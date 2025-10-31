import { Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Events from '../pages/Events';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import CreateEvent from '../pages/CreateEvent';
import EditEvent from '../pages/EditEvent';
import EventDetails from '../pages/EventDetails';
import BookingPage from '../pages/BookingPage';
import ProtectedRoute from '../components/ProtectedRoute';

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/events',
    element: <Events />
  },
  {
    path: '/events/:id',
    element: <EventDetails />
  },
  {
    path: '/booking/:id',
    element: <BookingPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/create-event',
    element: (
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/edit-event/:id',
    element: (
      <ProtectedRoute>
        <EditEvent />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes;