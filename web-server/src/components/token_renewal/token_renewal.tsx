import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ParseLocalStorage from '../../cookies/ParseLocalStorage';

function token_Renewal() {
  const [accessToken, setAccessToken] = useState(null);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  // Function to refresh the access token
  const refreshToken = async () => {
    try {
      // Make an API request to your server to renew the token
      const response = await axios.post('/api/refresh-token');

      // Assuming the server responds with a new access token
      const newAccessToken = response.data.accessToken;

      // Update the state with the new token
      setAccessToken(newAccessToken);
    } catch (error) {
      // Handle token renewal error
      console.error('Token renewal error:', error);
      // You can redirect the user to the login page or handle the error in your preferred way
    }
  };

  // Function to handle mouse move events
  const handleMouseMove = () => {
    setLastMouseMove(Date.now());
  };

  // Effect to add mouse move event listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Effect to check for token renewal based on mouse activity
  useEffect(() => {
    const checkTokenExpiration = () => {
      // Check if the access token exists and is expired
      if (accessToken) {
        const decodedToken = ParseLocalStorage("long_token");
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTimestamp) {
          // Token is expired, renew it
          refreshToken();
        }
      }
    };

    // Set up a timer to periodically check and renew the token
    const tokenCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute (adjust as needed)

    // Set up a timer to check for inactivity and renew the token if needed
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastMouseMove >= 10 * 60 * 1000) {
        // More than 10 minutes of inactivity, renew the token
        refreshToken();
      }
    }, 1000); // Check every second for inactivity

    // Clean up the intervals when the component unmounts
    return () => {
      clearInterval(tokenCheckInterval);
      clearInterval(inactivityCheckInterval);
    };
  }, [accessToken, lastMouseMove]);

  return (
    <div className="App">
      {/* Your application content */}
    </div>
  );
}

export default token_Renewal;
