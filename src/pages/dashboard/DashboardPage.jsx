import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TodoService } from '../../services/todo';
import './Dashboard.css';
import { useAuth } from '../../context/AuthContext';

// --- Icons (Static) ---
const Icons = {
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  Close: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  MoreVertical: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
};

// --- Haptic Helper ---
const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
};

// --- Sub-Component: Task Card (Memoized) ---
const TaskCard = React.memo(({ task, onToggle, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }} // Very fast fade
      className={`task-card ${task.isDone ? 'done' : ''}`}
      onClick={() => onToggle(task.id || task._id, task.isDone)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="menu-container">
        <button
          className="menu-btn"
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
        >
          <Icons.MoreVertical />
        </button>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="menu-dropdown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <button
                className="menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id || task._id);
                }}
              >
                <Icons.Trash /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="card-content">
        <div className="task-top"><h3>{task.todoName}</h3></div>
        <p>{task.todoDescription || "No details provided"}</p>
      </div>
      <div className="card-footer">
        <div className={`date-pill ${new Date(task.dueDate) < new Date() && !task.isDone ? 'overdue' : ''}`}>
          <Icons.Calendar />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
        </div>
        <div className={`checkbox-ring ${task.isDone ? 'checked' : ''}`}><Icons.Check /></div>
      </div>
    </motion.div>
  );
});

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Data
  useEffect(() => {
    if (!user?.username) return;
    const fetchTasks = async () => {
      try {
        const data = await TodoService.getAll(user.username);
        console.log("Fetched tasks:", data);
        setTasks(data.data || data.todos || data.todo || []);
      } catch (error) {
        toast.error("Could not sync tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.todoName.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesFilter = filter === 'all' ? true : filter === 'completed' ? task.isDone : !task.isDone;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, debouncedSearch, filter]);

  // Actions
  const toggleTask = useCallback(async (taskId, currentStatus) => {
    triggerHaptic();
    setTasks(prev => prev.map(t => (t.id === taskId || t._id === taskId) ? { ...t, isDone: !currentStatus } : t));
    try {
      await TodoService.toggleStatus(user.username, taskId, !currentStatus);
    } catch (error) {
      toast.error("Sync failed");
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId) => {
    triggerHaptic();
    // Optimistic update
    setTasks(prev => prev.filter(t => (t.id || t._id) !== taskId));
    try {
      await TodoService.delete(user.username, taskId);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      // Optionally revert state here if needed
    }
  }, [user]);

  const onCreateTask = async (data) => {
    triggerHaptic();
    try {
      const newTask = { ...data, todoName: data.title, todoDescription: data.description, dueDate: data.duedate, isDone: false };
      const result = await TodoService.create(user.username, newTask);
      setTasks(prev => [result.data || result.newTodo || result, ...prev]);
      setIsModalOpen(false);
      reset();
      toast.success("Task created!");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="header-left">
          <h1>Hello, {user?.username || 'User'} </h1>
          <p>You have <strong>{tasks.filter(t => !t.isDone).length}</strong> pending tasks.</p>
        </div>
        <button className="primary-btn" onClick={() => { triggerHaptic(); setIsModalOpen(true); }}>
          <Icons.Plus /> <span>New Task</span>
        </button>
      </header>

      {/* CONTROLS */}
      <div className="controls-row">
        <div className="search-bar">
          <Icons.Search />
          <input type="text" placeholder="Search tasks..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'completed'].map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => { triggerHaptic(); setFilter(f); }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="task-grid">
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="task-card skeleton-card"><div className="sk-line title"></div><div className="sk-line desc"></div><div className="sk-footer"><div className="sk-badge"></div><div className="sk-circle"></div></div></div>)
        ) : filteredTasks.length > 0 ? (
          <AnimatePresence mode='popLayout'>
            {filteredTasks.map(task => <TaskCard key={task.id || task._id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
          </AnimatePresence>
        ) : (
          <div className="empty-state"><p>No tasks found. Time to relax!</p></div>
        )}
      </div>

      {/* OPTIMIZED MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal-backdrop"
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="modal-box"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div className="modal-top">
                <h2>Create New Task</h2>
                <button className="icon-btn" onClick={() => setIsModalOpen(false)}><Icons.Close /></button>
              </div>

              <form onSubmit={handleSubmit(onCreateTask)}>
                <div className="input-group">
                  <input {...register("title", { required: true })} placeholder="Task Title" />
                </div>
                <div className="input-group">
                  <input {...register("description")} placeholder="Description (Optional)" />
                </div>
                <div className="input-group">
                  <input {...register("duedate")} type="date" required />
                </div>
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </motion.div>

            <div className="backdrop-trigger" onClick={() => setIsModalOpen(false)}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}