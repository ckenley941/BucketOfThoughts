import { useMemo } from 'react';
import axios, { type AxiosInstance, AxiosError } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7037/';

export const useApiClient = (): AxiosInstance => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  return useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      //timeout: process.env.NODE_ENV === 'development' ? 0 : 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(
      async (config) => {
        try {
          // Try to use cached token instead of always requesting a new one
          const token = await getAccessTokenSilently({
            cacheMode: 'on',
          });
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          // Let the error propagate - don't make the request if we can't get a token
          throw error;
        }
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      function onFulfilled(response) {
        return response;
      },
      async function onRejected(error: AxiosError) {
        console.error('Error calling API:', error);

        // Handle 401 Unauthorized - redirect to login globally
        if (error.response?.status === 401) {
          // eslint-disable-next-line no-console
          console.log('401 Unauthorized - redirecting to login');
          // Store the current URL so we can return after login
          const currentUrl = window.location.href;
          // Redirect to Auth0 login with returnTo
          await loginWithRedirect({
            appState: {
              returnTo: currentUrl,
            },
          });
          // Return a resolved promise to prevent further error handling
          return Promise.resolve();
        }

        // Check if it's a network error (API not reachable or user is offline)
        if (
          error.code === 'ERR_NETWORK' ||
          error.code === 'ECONNREFUSED' ||
          error.code === 'ECONNABORTED' ||
          error.message === 'Network Error' ||
          !error.response
        ) {
          console.error('Network error detected - redirecting to error page');

          // Don't redirect to error page if we're on payment success page
          // This allows the payment success page to handle its own retry logic
          // if (
          //   window.location.pathname !== '/api-error' &&
          //   window.location.pathname !== '/payment-success'
          // ) {
          //   window.location.href = '/api-error';
          // }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [getAccessTokenSilently, loginWithRedirect]);
};

