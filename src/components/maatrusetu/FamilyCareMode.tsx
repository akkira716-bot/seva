'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Utensils, 
  Baby, 
  Moon, 
  ShoppingBag, 
  Pill,
  Sparkles
} from 'lucide-react';
import { FamilyCareTask, CaregiverRole, TaskCategory, TaskPriority } from '@/types/maatrusetu';

interface Props {
  recordId: string;
  motherName: string;
}

const CATEGORY_ICONS: Record<TaskCategory, any> = {
  nutrition: Utensils,
  baby_care: Baby,
  rest: Moon,
  errands: ShoppingBag,
  medication: Pill
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  nutrition: 'text-amber-600 bg-amber-50 border-amber-200',
  baby_care: 'text-teal-600 bg-teal-50 border-teal-200',
  rest: 'text-purple-600 bg-purple-50 border-purple-200',
  errands: 'text-blue-600 bg-blue-50 border-blue-200',
  medication: 'text-rose-600 bg-rose-50 border-rose-200'
};

const ROLES: CaregiverRole[] = [
  'Partner',
  'Grandmother',
  'Aunt / Sister',
  'Elder / Relative',
  'Community Helper'
];

export default function FamilyCareMode({ recordId, motherName }: Props) {
  const [tasks, setTasks] = useState<FamilyCareTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedRole, setAssignedRole] = useState<CaregiverRole>('Partner');
  const [priority, setPriority] = useState<TaskPriority>('routine');
  const [category, setCategory] = useState<TaskCategory>('nutrition');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [recordId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=tasks&recordId=${recordId}`);
      const json = await res.json();
      if (json.success) {
        setTasks(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch family tasks', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_task', taskId, completedBy: assignedRole })
      });
      const json = await res.json();
      if (json.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? json.data : t));
      }
    } catch (e) {
      console.error('Failed to toggle task', e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_task', taskId })
      });
      const json = await res.json();
      if (json.success) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (e) {
      console.error('Failed to delete task', e);
    }
  };

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a task title.');
      return;
    }

    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_task',
          recordId,
          title,
          description,
          assignedRole,
          priority,
          category,
          dueDate
        })
      });
      const json = await res.json();
      if (json.success) {
        setTasks(prev => [json.data, ...prev]);
        setShowAddModal(false);
        setTitle('');
        setDescription('');
      } else {
        setFormError(json.error || 'Failed to add task.');
      }
    } catch (e) {
      console.error('Failed to add task', e);
      setFormError('Network error while saving task.');
    }
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Family Care Mode &amp; Task Assignment</h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase">
                {completedCount}/{tasks.length} Completed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empower partners, elders, and relatives with clear caregiving responsibilities to support {motherName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Family Task</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Family Support Completion Rate</span>
          <span className="font-extrabold text-teal-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading family tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No tasks assigned yet. Assign simple responsibilities to family members!</p>
          </div>
        ) : (
          tasks.map((task) => {
            const CatIcon = CATEGORY_ICONS[task.category] || Users;
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
                  task.isCompleted
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-teal-600 transition"
                    title={task.isCompleted ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-teal-500" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-xs font-bold ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>

                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${CATEGORY_COLORS[task.category]}`}>
                        <CatIcon className="w-3 h-3" />
                        <span>{task.category.replace('_', ' ')}</span>
                      </span>

                      {/* Assigned Role */}
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        Assigned to: {task.assignedRole}
                      </span>

                      {/* Priority Badge */}
                      {task.priority === 'urgent' && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-black uppercase">
                          Urgent
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-600 leading-relaxed max-w-xl">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {task.dueDate}
                      </span>
                      {task.isCompleted && task.completedBy && (
                        <span className="text-teal-700 font-medium">
                          ✓ Completed by {task.completedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition"
                  title="Remove task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Assign New Family Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddTaskSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare warm nutritious breakfast / Take baby for burping"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring water bottle, ensure no loud noise while mother sleeps..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign to Role</label>
                  <select
                    value={assignedRole}
                    onChange={(e: any) => setAssignedRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="nutrition">Nutrition &amp; Meals</option>
                    <option value="baby_care">Baby Care &amp; Burping</option>
                    <option value="rest">Mother's Sleep &amp; Rest</option>
                    <option value="errands">Errands &amp; Supplies</option>
                    <option value="medication">Medication &amp; Vitals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="routine">Routine</option>
                    <option value="comfort">Comfort</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
