import { useState, useEffect } from 'react';

const allOnlineUsers = ({ socket }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Handle when a user comes online
    socket.on('I_AM_ONLINE', ({ user }) => {
      setOnlineUsers((prevOnlineUsers) => {
        // Check if the user is already in the list
        const isUserAlreadyOnline = prevOnlineUsers.some((u) => u.id === user.id);
        if (isUserAlreadyOnline) {
          return prevOnlineUsers; // Return the same list if user is already online
        }
        return [...prevOnlineUsers, user]; // Add the new user to the list
      });
      console.log('User Online:', user);
    });

    // when a user goes offline
    socket.on('I_AM_OFFLINE', ({ user }) => {
      setOnlineUsers((prevOnlineUsers) => {
        return prevOnlineUsers.filter((u) => u.id !== user.id);
      });
      console.log('User Offline:', user);
    });

    // unmount
    return () => {
      socket.off('I_AM_ONLINE');
      socket.off('I_AM_OFFLINE');
    };
  }, [socket]);
}

export  {allOnlineUsers}