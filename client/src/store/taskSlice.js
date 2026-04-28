import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch tasks' });
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to create task' });
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to update task' });
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to delete task' });
  }
});

export const fetchStats = createAsyncThunk('tasks/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/analytics/stats');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch stats' });
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    socketTaskCreated: (state, action) => {
      const exists = state.items.find(t => t._id === action.payload._id);
      if (!exists) state.items.unshift(action.payload);
    },
    socketTaskUpdated: (state, action) => {
      const index = state.items.findIndex(t => t._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;
    },
    socketTaskDeleted: (state, action) => {
      state.items = state.items.filter(t => t._id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const exists = state.items.find(t => t._id === action.payload.data.task._id);
        if (!exists) state.items.unshift(action.payload.data.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload.data.task._id);
        if (index !== -1) {
          state.items[index] = action.payload.data.task;
        } else {
          state.items.unshift(action.payload.data.task);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  },
});

export const { socketTaskCreated, socketTaskUpdated, socketTaskDeleted } = taskSlice.actions;
export default taskSlice.reducer;
