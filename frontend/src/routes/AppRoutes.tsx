import { Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../config/auth0.config';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginLayout from '../layouts/LoginLayout';
import HomePage from '../pages/HomePage';
import ThoughtWizard from '../pages/thought-wizard/ThoughtWizard';
import ThoughtPage from '../pages/ThoughtPage';
import ThoughtsPage from '../pages/ThoughtsPage';
import ThoughtBucketsPage from '../pages/ThoughtBucketsPage';
import ThoughtBucketForm from '../pages/ThoughtBucketForm';
import LoginPage from '../pages/LoginPage';
import LoginCallback from '../pages/LoginCallback';
import LogoutPage from '../pages/LogoutPage';
import AboutPage from '../pages/AboutPage';
import DemoPage from '../pages/DemoPage';

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
              <LoginPage />
            </LoginLayout>
          }
        />
        <Route
          path="/about"
          element={
            <LoginLayout>
              <AboutPage />
            </LoginLayout>
          }
        />
        <Route
          path="/demo"
          element={
            <LoginLayout>
              <DemoPage />
            </LoginLayout>
          }
        />
        <Route path="/login-callback" element={<LoginCallback />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
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
                <ThoughtPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thoughts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thought-buckets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ThoughtBucketsPage />
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

