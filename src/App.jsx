import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { GardenProvider } from './contexts/GardenContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import GardenSetup from './components/garden/GardenSetup';
import GardenView from './components/garden/GardenView';
import TaskList from './components/tasks/TaskList';
import TaskDetail from './components/tasks/TaskDetail';
import PlantDetail from './components/plants/PlantDetail';
import Settings from './components/settings/Settings';

// Theme is now defined in theme.js and provided in main.jsx

// Private route component
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <GardenProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/garden" element={
                <PrivateRoute>
                  <Layout>
                    <GardenView />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/garden/setup" element={
                <PrivateRoute>
                  <Layout>
                    <GardenSetup />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/tasks" element={
                <PrivateRoute>
                  <Layout>
                    <TaskList />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/tasks/:taskId" element={
                <PrivateRoute>
                  <Layout>
                    <TaskDetail />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/plants/:plantingId" element={
                <PrivateRoute>
                  <Layout>
                    <PlantDetail />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/settings" element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </GardenProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
