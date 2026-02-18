import { Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../config/auth0.config';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginLayout from '../layouts/LoginLayout';
import Home from '../pages/Home';
import ThoughtWizard from '../pages/thought-wizard/ThoughtWizard';
import ThoughtViewer from '../pages/ThoughtViewer';
import Thoughts from '../pages/Thoughts';
import ThoughtBuckets from '../pages/ThoughtBuckets';
import ThoughtBucketForm from '../pages/ThoughtBucketForm';
import Login from '../pages/Login';
import LoginCallback from '../pages/LoginCallback';
import Logout from '../pages/Logout';
import About from '../pages/About';
import Demo from '../pages/Demo';

const AppRoutes = () => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + '/login-callback',
        audience: auth0Config.audience,
      }}
    >
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route
          path="/about"
          element={
            <LoginLayout>
              <About />
            </LoginLayout>
          }
        />
        <Route
          path="/demo"
          element={
            <LoginLayout>
              <Demo />
            </LoginLayout>
          }
        />
        <Route path="/login-callback" element={<LoginCallback />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thought-wizard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtWizard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thought/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtViewer />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thoughts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Thoughts />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thought-buckets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtBuckets />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thought-buckets/add"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtBucketForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thought-buckets/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtBucketForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Auth0Provider>
  );
};

export default AppRoutes;

