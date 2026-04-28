import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { socketTaskCreated, socketTaskUpdated, socketTaskDeleted, fetchStats } from '../store/taskSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || !token) return;

    // Pass token in auth object for the handshake
    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to authenticated socket');
    });

    socket.on('task_created', (data) => {
      dispatch(socketTaskCreated(data));
      dispatch(fetchStats());
    });

    socket.on('task_updated', (data) => {
      dispatch(socketTaskUpdated(data));
      dispatch(fetchStats());
    });

    socket.on('task_deleted', (data) => {
      dispatch(socketTaskDeleted(data));
      dispatch(fetchStats());
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token, dispatch]);
};
