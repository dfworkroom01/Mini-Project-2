import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session data from local storage
    //localStorage.removeItem('userToken'); // Replace with actual key when applicable
    //localStorage.removeItem('userData'); // Replace with actual key when applicable

    // Log out the user
    console.log('Logged out');

    // Navigate to the LoginForm
    navigate('/Login'); 
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: 'darkblue',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
