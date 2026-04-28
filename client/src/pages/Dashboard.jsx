import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchTasks, fetchStats, createTask, updateTask, deleteTask } from '../store/taskSlice';
import { useSocket } from '../hooks/useSocket';
import { Plus, LogOut, Trash2, Edit3, X } from 'lucide-react';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = ({ view }) => {
  useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: tasks, stats, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Work',
    deadline: format(new Date(Date.now() + 86400000), "yyyy-MM-dd'T'HH:mm"),
  });

  // Determine active page from URL
  const activePage = location.pathname.replace('/', '') || 'dashboard';

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchStats());
  }, [dispatch]);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'Work', deadline: format(new Date(Date.now() + 86400000), "yyyy-MM-dd'T'HH:mm") });
    setEditingTask(null);
  };

  const openCreateModal = () => { resetForm(); setIsModalOpen(true); };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category: task.category,
      deadline: format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm"),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, data: formData })).unwrap();
        toast.success('Task updated');
      } else {
        await dispatch(createTask(formData)).unwrap();
        toast.success('Task created');
      }
      setIsModalOpen(false);
      resetForm();
      dispatch(fetchStats());
    } catch { toast.error('Operation failed'); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateTask({ id, data: { status } })).unwrap();
      dispatch(fetchTasks());
      dispatch(fetchStats());
    } catch (err) { toast.error(err?.message || 'Update failed'); }
  };

  const handleDeleteTask = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success('Task deleted');
      dispatch(fetchStats());
    } catch { toast.error('Delete failed'); }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-900/40 text-green-400 border border-green-800';
    if (status === 'in-progress') return 'bg-lime-900/40 text-lime-400 border border-lime-800';
    return 'bg-sky-900/30 text-sky-400 border border-sky-800';
  };

  const getDotColor = (task) => {
    if (task.status === 'completed') return 'bg-emerald-500';
    if (new Date(task.deadline) < new Date()) return 'bg-rose-500';
    if (task.priorityScore > 400) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  const getSubLabel = (task) => {
    if (task.status === 'completed') return 'Completed';
    if (new Date(task.deadline) < new Date()) return 'Overdue';
    return `Due ${format(new Date(task.deadline), 'MMM d')}`;
  };

  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'completed').length;

  const navItems = [
    { label: 'Dashboard', path: 'dashboard' },
    { label: 'My Tasks', path: 'tasks' },
    { label: 'Analytics', path: 'analytics' },
    { label: 'Settings', path: 'settings' },
  ];

  // Filter tasks based on view
  const filteredTasks = view === 'tasks' ? tasks : tasks;

  return (
    <div className="flex h-screen bg-[#1a1a2e] text-gray-300" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ─── Sidebar ─── */}
      <aside className="w-56 bg-[#16162a] flex flex-col p-5 border-r border-gray-800/50">
        <div className="mb-8 px-1">
          <h2 className="text-lg font-bold text-white tracking-tight">TaskFlow</h2>
          <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">Mini SaaS</p>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(`/${item.path}`)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                activePage === item.path
                  ? 'bg-blue-600/15 text-blue-400 font-semibold'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activePage === item.path ? 'bg-blue-500' : 'bg-gray-700'}`}></span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-gray-800/50">
          <div className="w-8 h-8 bg-teal-700/40 text-teal-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <span className="text-xs font-medium text-gray-400 truncate flex-1">{user?.name}</span>
          <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* ─── Main Panel ─── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#1e1e36]">
        <header className="px-8 py-5 border-b border-gray-800/50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white capitalize">
              {activePage === 'tasks' ? 'My Tasks' : activePage}
            </h1>
            <p className="text-[11px] text-gray-500">{format(new Date(), 'eee, dd MMM yyyy')}</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-700 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={14} /> New Task
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* ─── Dashboard View ─── */}
          {(activePage === 'dashboard' || activePage === 'analytics') && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#23233d] border border-gray-800/40 rounded-xl p-5">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Total tasks</p>
                <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
              </div>
              <div className="bg-[#23233d] border border-gray-800/40 rounded-xl p-5">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Completed</p>
                <p className="text-3xl font-bold text-green-400">{stats?.completed || 0}</p>
              </div>
              <div className="bg-[#23233d] border border-gray-800/40 rounded-xl p-5">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Overdue</p>
                <p className="text-3xl font-bold text-rose-400">{overdueCount}</p>
              </div>
            </div>
          )}

          {/* ─── Insights Banner ─── */}
          {(activePage === 'dashboard' || activePage === 'analytics') && (
            <div className="bg-blue-950/40 border border-blue-900/30 rounded-lg px-5 py-3 flex items-center justify-between">
              <p className="text-blue-400 text-xs">
                You completed <strong>{stats?.completedToday || 0}</strong> tasks today · Most active category: <strong>{stats?.topCategory || 'N/A'}</strong>
              </p>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">live</span>
            </div>
          )}

          {/* ─── Analytics Extra ─── */}
          {activePage === 'analytics' && stats?.categoryStats && (
            <div className="bg-[#23233d] border border-gray-800/40 rounded-xl p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Category Distribution</p>
              <div className="space-y-4">
                {stats.categoryStats.map((cat) => (
                  <div key={cat._id}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-gray-400">{cat._id}</span>
                      <span className="text-white">{cat.count} tasks ({Math.round((cat.count / (stats.total || 1)) * 100)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(cat.count / (stats.total || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Settings View ─── */}
          {activePage === 'settings' && (
            <div className="bg-[#23233d] border border-gray-800/40 rounded-xl p-6 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Name</p>
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Member Since</p>
                  <p className="text-sm text-white font-medium">{user?.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Tasks</p>
                  <p className="text-sm text-white font-medium">{stats?.total || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Task List (visible on Dashboard and My Tasks) ─── */}
          {(activePage === 'dashboard' || activePage === 'tasks') && (
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Tasks by priority</p>
              {loading && tasks.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (<div key={i} className="h-16 bg-gray-800/30 rounded-lg animate-pulse"></div>))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-gray-800 rounded-xl">
                  <p className="text-gray-600 text-sm">No tasks yet. Click "+ New Task" to get started.</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredTasks.map((task) => (
                    <div key={task._id} className="group flex items-center justify-between py-3.5 px-1 border-b border-gray-800/30 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(task)} shrink-0`}></span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-200'}`}>
                            {task.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {getSubLabel(task)} · Score: {task.priorityScore}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer ${getStatusColor(task.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button onClick={() => openEditModal(task)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-blue-400 transition-all cursor-pointer p-1">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all cursor-pointer p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <footer className="px-8 py-3 border-t border-gray-800/50 flex items-center justify-between bg-[#1a1a30]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider">Live · Updates via Socket.io</span>
          </div>
          <div className="flex items-center gap-5 text-[10px] font-semibold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Overdue</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Due soon</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Completed</span>
          </div>
        </footer>
      </main>

      {/* ─── Create / Edit Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#23233d] border border-gray-800/50 rounded-2xl p-7 relative">
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="absolute top-4 right-4 text-gray-600 hover:text-white cursor-pointer">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold text-white mb-5">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Title</label>
                <input
                  required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1a1a2e] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600"
                  placeholder="Task title..."
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1a1a2e] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 h-20 resize-none"
                  placeholder="Optional description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1a1a2e] border border-gray-800 rounded-lg text-sm text-white"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Development">Development</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Deadline</label>
                  <input
                    type="datetime-local" required value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#1a1a2e] border border-gray-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                  {editingTask ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
