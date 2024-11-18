export const client = async (url, options = {}) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('access_token');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options?.headers,
    },
  };

  const response = await fetch(`${baseURL}${url}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    return {
      error: true,
      status: response.status,
      message: `HTTP error! status: ${response.status}`,
    };
  }

  return response.json();
};