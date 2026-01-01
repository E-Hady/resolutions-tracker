

import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Play, AlertCircle, Plus, Heart, Briefcase, TrendingUp, Users, DollarSign, Coffee, MoreHorizontal, X, Edit2, Trash2, BarChart3 } from 'lucide-react';
import * as api from './api';

export default function App() {
  const [resolutions, setResolutions] = useState([]);
  const [dailyHabits, setDailyHabits] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0, overdue: 0, dailyCompleted: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isDailyDetailsOpen, setIsDailyDetailsOpen] = useState(false);
  const [selectedDailyHabit, setSelectedDailyHabit] = useState(null);
  const [editingResolution, setEditingResolution] = useState(null);
  const [editingDailyHabit, setEditingDailyHabit] = useState(null);
  const [expandedResolution, setExpandedResolution] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'other', status: 'in-progress', deadline: '', tasks: [] });
  const [dailyFormData, setDailyFormData] = useState({ title: '', description: '', category: 'other', deadline: '' });
  const [newTaskText, setNewTaskText] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories', icon: Target, count: resolutions.length + dailyHabits.length },
    { id: 'health', name: 'Health & Fitness', icon: Heart, count: resolutions.filter(r => r.category === 'health').length + dailyHabits.filter(h => h.category === 'health').length },
    { id: 'career', name: 'Career & Education', icon: Briefcase, count: resolutions.filter(r => r.category === 'career').length + dailyHabits.filter(h => h.category === 'career').length },
    { id: 'personal', name: 'Personal Growth', icon: TrendingUp, count: resolutions.filter(r => r.category === 'personal').length + dailyHabits.filter(h => h.category === 'personal').length },
    { id: 'relationships', name: 'Relationships', icon: Users, count: resolutions.filter(r => r.category === 'relationships').length + dailyHabits.filter(h => h.category === 'relationships').length },
    { id: 'finance', name: 'Finance', icon: DollarSign, count: resolutions.filter(r => r.category === 'finance').length + dailyHabits.filter(h => h.category === 'finance').length },
    { id: 'hobbies', name: 'Hobbies & Interests', icon: Coffee, count: resolutions.filter(r => r.category === 'hobbies').length + dailyHabits.filter(h => h.category === 'hobbies').length },
    { id: 'other', name: 'Other', icon: MoreHorizontal, count: resolutions.filter(r => r.category === 'other').length + dailyHabits.filter(h => h.category === 'other').length }
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resData, habitsData] = await Promise.all([api.getResolutions(), api.getDailyHabits()]);
        setResolutions(resData);
        setDailyHabits(habitsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Update stats
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStats({
      total: resolutions.length,
      completed: resolutions.filter(r => r.status === 'completed').length,
      inProgress: resolutions.filter(r => r.status === 'in-progress').length,
      notStarted: resolutions.filter(r => r.status === 'not-started').length,
      overdue: resolutions.filter(r => r.deadline && r.status !== 'completed' && new Date(r.deadline) < today).length,
      dailyCompleted: dailyHabits.filter(h => h.completedToday).length
    });
  }, [resolutions, dailyHabits]);

  // Daily reset
  useEffect(() => {
    const checkReset = async () => {
      const lastReset = localStorage.getItem('lastResetDate');
      const today = new Date().toDateString();
      if (lastReset !== today) {
        try {
          await api.resetDailyHabits();
          const habits = await api.getDailyHabits();
          setDailyHabits(habits);
          localStorage.setItem('lastResetDate', today);
        } catch (error) {
          console.error('Reset error:', error);
        }
      }
    };
    checkReset();
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredResolutions = selectedCategory === 'all' ? resolutions : resolutions.filter(r => r.category === selectedCategory);
  const filteredDailyHabits = selectedCategory === 'all' ? dailyHabits : dailyHabits.filter(h => h.category === selectedCategory);

  const calculateProgress = (tasks) => tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      setFormData(prev => ({ ...prev, tasks: [...prev.tasks, { id: Date.now().toString(), text: newTaskText, completed: false }] }));
      setNewTaskText('');
    }
  };

  const handleRemoveTask = (taskId) => {
    setFormData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert('Please enter a title');
    try {
      const data = { ...formData, progress: calculateProgress(formData.tasks) };
      if (editingResolution) await api.updateResolution(editingResolution._id, data);
      else await api.createResolution(data);
      const res = await api.getResolutions();
      setResolutions(res);
      setIsModalOpen(false);
      setEditingResolution(null);
      setFormData({ title: '', description: '', category: 'other', status: 'in-progress', deadline: '', tasks: [] });
      setNewTaskText('');
    } catch (error) {
      alert('Error saving resolution');
    }
  };

  const handleDailySubmit = async () => {
    if (!dailyFormData.title.trim()) return alert('Please enter a title');
    try {
      if (editingDailyHabit) await api.updateDailyHabit(editingDailyHabit._id, dailyFormData);
      else await api.createDailyHabit({ ...dailyFormData, completedToday: false, history: [] });
      const habits = await api.getDailyHabits();
      setDailyHabits(habits);
      setIsDailyModalOpen(false);
      setEditingDailyHabit(null);
      setDailyFormData({ title: '', description: '', category: 'other', deadline: '' });
    } catch (error) {
      alert('Error saving habit');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resolution?')) {
      await api.deleteResolution(id);
      const res = await api.getResolutions();
      setResolutions(res);
    }
  };

  const handleDeleteDailyHabit = async (id) => {
    if (window.confirm('Delete this habit?')) {
      await api.deleteDailyHabit(id);
      const habits = await api.getDailyHabits();
      setDailyHabits(habits);
    }
  };

  const handleStatusChange = async (id, status) => {
    await api.updateResolution(id, { status });
    const res = await api.getResolutions();
    setResolutions(res);
  };

  const handleToggleTask = async (resolutionId, taskId) => {
    const resolution = resolutions.find(r => r._id === resolutionId);
    const tasks = resolution.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    await api.updateResolution(resolutionId, { tasks, progress: calculateProgress(tasks) });
    const res = await api.getResolutions();
    setResolutions(res);
  };

  const handleToggleDailyHabit = async (id) => {
    const habit = dailyHabits.find(h => h._id === id);
    const today = new Date().toDateString();
    const completed = !habit.completedToday;
    let history = habit.history || [];
    if (completed && !history.includes(today)) history = [...history, today];
    else if (!completed) history = history.filter(d => d !== today);
    await api.updateDailyHabit(id, { completedToday: completed, history });
    const habits = await api.getDailyHabits();
    setDailyHabits(habits);
  };

  const calculateStreak = (habit) => {
    const history = habit.history || [];
    if (history.length === 0) return 0;
    const dates = history.map(d => new Date(d)).sort((a, b) => b - a);
    let streak = 0, current = new Date();
    current.setHours(0, 0, 0, 0);
    for (let date of dates) {
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      if (Math.floor((current - check) / 86400000) === streak) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const calculateDailyProgress = (habit) => {
    if (!habit.deadline) return null;
    const start = new Date(habit.createdAt);
    const end = new Date(habit.deadline);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const completedDays = (habit.history || []).length;
    return { completedDays, totalDays };
  };

  const getStatusColor = (s) => s === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : s === 'in-progress' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200';
  const getStatusText = (s) => s === 'completed' ? 'Completed' : s === 'in-progress' ? 'In Progress' : 'Not Started';


  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-teal-600" />
            <span className="text-teal-600 font-medium">2026 New Year Resolutions</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Track Your Goals & Achieve Success</h1>
          <p className="text-gray-600">Set meaningful resolutions, track your progress, and celebrate your achievements throughout the year.</p>
        </div>

        <div className="grid grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Resolutions', value: stats.total, desc: 'Your goals for the year', icon: Target, color: 'cyan' },
            { label: 'Completed', value: stats.completed, desc: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% of total`, icon: CheckCircle, color: 'emerald' },
            { label: 'In Progress', value: stats.inProgress, desc: 'Currently working on', icon: Clock, color: 'amber' },
            { label: 'Not Started', value: stats.notStarted, desc: 'Ready to begin', icon: Play, color: 'gray' },
            { label: 'Overdue', value: stats.overdue, desc: 'Need attention', icon: AlertCircle, color: 'red' },
            { label: 'Daily Habits', value: `${stats.dailyCompleted}/${dailyHabits.length}`, desc: 'Completed today', icon: Clock, color: 'purple' }
          ].map(({ label, value, desc, icon: Icon, color }) => (
            <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium text-sm">{label}</span>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Completion Rate</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-teal-600">{completionRate}%</span>
            <span className="text-sm text-gray-500">{stats.completed} of {stats.total} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-3 rounded-full transition-all" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-start gap-4">
            <div className="flex flex-wrap gap-3 flex-1">
              {categories.slice(0, 4).map(cat => {
                const Icon = cat.icon;
                const selected = selectedCategory === cat.id;
                return (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${selected ? 'bg-teal-500 text-white shadow-md' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}>
                    <Icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selected ? 'bg-teal-600' : 'bg-teal-500 text-white'}`}>{cat.count}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium shadow-md transition-all whitespace-nowrap">
              <Plus className="w-5 h-5" />
              <span>Add New Resolution</span>
            </button>
            <button onClick={() => setIsDailyModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium shadow-md transition-all whitespace-nowrap">
              <Plus className="w-5 h-5" />
              <span>Add Daily Habit</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {categories.slice(4).map(cat => {
              const Icon = cat.icon;
              const selected = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${selected ? 'bg-teal-500 text-white shadow-md' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}>
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selected ? 'bg-teal-600' : 'bg-teal-500 text-white'}`}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          {filteredResolutions.length === 0 && filteredDailyHabits.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-teal-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resolutions Yet</h3>
              <p className="text-gray-500 mb-6">No resolutions in the {categories.find(c => c.id === selectedCategory)?.name} category yet.</p>
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium shadow-md transition-all">
                <Plus className="w-5 h-5" />
                <span>Create Your First Resolution</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDailyHabits.map(habit => {
                const streak = calculateStreak(habit);
                const progress = calculateDailyProgress(habit);
                return (
                  <div key={habit._id} className={`border-2 rounded-lg p-5 transition-all ${habit.completedToday ? 'bg-purple-50 border-purple-300' : 'bg-white border-purple-200 hover:border-purple-300'}`}>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={habit.completedToday} onChange={() => handleToggleDailyHabit(habit._id)} className="w-6 h-6 mt-0.5 text-purple-600 rounded cursor-pointer" />
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${habit.completedToday ? 'line-through text-gray-500' : 'text-gray-800'}`}>{habit.title}</h3>
                        {habit.description && <p className="text-gray-600 text-sm mb-2">{habit.description}</p>}
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">Daily Habit</span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">{categories.find(c => c.id === habit.category)?.name}</span>
                          {streak > 0 && <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">🔥 {streak} day streak</span>}
                        </div>
                        {progress && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min((progress.completedDays / progress.totalDays) * 100, 100)}%` }}></div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedDailyHabit(habit); setIsDailyDetailsOpen(true); }} className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg" title="View Details">
                          <BarChart3 className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setEditingDailyHabit(habit); setDailyFormData({ title: habit.title, description: habit.description, category: habit.category, deadline: habit.deadline ? habit.deadline.split('T')[0] : '' }); setIsDailyModalOpen(true); }} className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteDailyHabit(habit._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredResolutions.map(res => (
                <div key={res._id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{res.title}</h3>
                        {res.description && <p className="text-gray-600 text-sm mb-3">{res.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingResolution(res); setFormData({ title: res.title, description: res.description, category: res.category, status: res.status, deadline: res.deadline ? res.deadline.split('T')[0] : '', tasks: res.tasks || [] }); setIsModalOpen(true); }} className="text-teal-600 hover:bg-teal-50 p-2 rounded-lg">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(res._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">{categories.find(c => c.id === res.category)?.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(res.status)}`}>{getStatusText(res.status)}</span>
                    </div>
                    <div className="mb-4 w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-teal-600">{res.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 rounded-full transition-all" style={{ width: `${res.progress}%` }}></div>
                      </div>
                    </div>
                    {res.deadline && (
                      <div className="text-sm text-gray-600 mb-4">
                        📅 {new Date(res.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {res.status !== 'not-started' && <button onClick={() => handleStatusChange(res._id, 'not-started')} className="flex-1 px-3 py-2 text-xs font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg">Not Started</button>}
                      {res.status !== 'completed' && <button onClick={() => handleStatusChange(res._id, 'completed')} className="flex-1 px-3 py-2 text-xs font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />Complete
                      </button>}
                    </div>
                  </div>
                  {res.tasks?.length > 0 && (
                    <div>
                      <button onClick={() => setExpandedResolution(expandedResolution === res._id ? null : res._id)} className="w-full px-6 py-3 border-t text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex justify-between">
                        <span>Tasks ({res.tasks.filter(t => t.completed).length}/{res.tasks.length} completed)</span>
                        <span>{expandedResolution === res._id ? '▲' : '▼'}</span>
                      </button>
                      {expandedResolution === res._id && (
                        <div className="px-6 pb-6 pt-2 space-y-2">
                          {res.tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                              <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(res._id, task.id)} className="w-5 h-5 text-teal-600 rounded cursor-pointer" />
                              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolution Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between p-6 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-semibold">{editingResolution ? 'Edit Resolution' : 'Create New Resolution'}</h2>
                <button onClick={() => { setIsModalOpen(false); setEditingResolution(null); setFormData({ title: '', description: '', category: 'other', status: 'in-progress', deadline: '', tasks: [] }); setNewTaskText(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Enter title" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                <div><label className="block text-sm font-medium mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows="3" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none" /></div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tasks ({formData.tasks.length})</label>
                  <div className="space-y-2 mb-3">
                    {formData.tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="flex-1 text-sm">{t.text}</span>
                        <button onClick={() => handleRemoveTask(t.id)} className="text-red-500 p-1"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }} placeholder="Add a task..." className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                    <button onClick={handleAddTask} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-2">Category</label><select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-teal-500 outline-none">{['other', 'health', 'career', 'personal', 'relationships', 'finance', 'hobbies'].map(c => <option key={c} value={c}>{categories.find(cat => cat.id === c)?.name || c}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">Deadline</label><input type="date" value={formData.deadline} onChange={(e) => setFormData(p => ({ ...p, deadline: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                <div className="flex gap-3 pt-4">
                  <button onClick={handleSubmit} className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium shadow-md">{editingResolution ? 'Update' : 'Create'} Resolution</button>
                  <button onClick={() => { setIsModalOpen(false); setEditingResolution(null); setFormData({ title: '', description: '', category: 'other', status: 'in-progress', deadline: '', tasks: [] }); setNewTaskText(''); }} className="flex-1 px-6 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-medium">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Habit Modal */}
        {isDailyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">{editingDailyHabit ? 'Edit Daily Habit' : 'Create Daily Habit'}</h2>
                <button onClick={() => { setIsDailyModalOpen(false); setEditingDailyHabit(null); setDailyFormData({ title: '', description: '', category: 'other', deadline: '' }); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" value={dailyFormData.title} onChange={(e) => setDailyFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Go to gym" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" /></div>
                <div><label className="block text-sm font-medium mb-2">Description</label><textarea value={dailyFormData.description} onChange={(e) => setDailyFormData(p => ({ ...p, description: e.target.value }))} placeholder="Optional details" rows="3" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none" /></div>
                <div><label className="block text-sm font-medium mb-2">Category</label><select value={dailyFormData.category} onChange={(e) => setDailyFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none">{['other', 'health', 'career', 'personal', 'relationships', 'finance', 'hobbies'].map(c => <option key={c} value={c}>{categories.find(cat => cat.id === c)?.name || c}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">Target End Date (Optional)</label><input type="date" value={dailyFormData.deadline} onChange={(e) => setDailyFormData(p => ({ ...p, deadline: e.target.value }))} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" /></div>
                <div className="flex gap-3 pt-4">
                  <button onClick={handleDailySubmit} className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium shadow-md">{editingDailyHabit ? 'Update' : 'Create'} Habit</button>
                  <button onClick={() => { setIsDailyModalOpen(false); setEditingDailyHabit(null); setDailyFormData({ title: '', description: '', category: 'other', deadline: '' }); }} className="flex-1 px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Habit Details Modal */}
        {isDailyDetailsOpen && selectedDailyHabit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between p-6 border-b sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-semibold">{selectedDailyHabit.title}</h2>
                  <p className="text-sm text-gray-500">Daily Habit Details</p>
                </div>
                <button onClick={() => { setIsDailyDetailsOpen(false); setSelectedDailyHabit(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-6">
                {(() => {
                  const progress = calculateDailyProgress(selectedDailyHabit);
                  const streak = calculateStreak(selectedDailyHabit);
                  const history = selectedDailyHabit.history || [];
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        {progress && (
                          <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">{progress.completedDays}/{progress.totalDays}</div>
                            <div className="text-xs text-gray-600 mt-1">Days Completed</div>
                          </div>
                        )}
                        <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                          <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">🔥 {streak}</div>
                          <div className="text-xs text-gray-600 mt-1">Current Streak</div>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-4 text-center border border-teal-200">
                          <div className="text-2xl font-bold text-teal-600">{history.length}</div>
                          <div className="text-xs text-gray-600 mt-1">Total Days</div>
                        </div>
                      </div>
                      {progress && (
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-bold text-purple-600">{Math.round((progress.completedDays / progress.totalDays) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((progress.completedDays / progress.totalDays) * 100, 100)}%` }}></div>
                          </div>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Completion History</h3>
                        {history.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-8">No history yet. Start checking off days!</p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {history.sort((a, b) => new Date(b) - new Date(a)).map((date, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="p-6 border-t bg-gray-50">
                <button onClick={() => { setIsDailyDetailsOpen(false); setSelectedDailyHabit(null); }} className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
