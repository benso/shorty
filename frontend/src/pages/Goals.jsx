import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { goalsAPI } from '../utils/api';
import { useGoalsStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

const Goals = () => {
  const { goals, setGoals, addGoal, removeGoal } = useGoalsStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vision_alignment: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await goalsAPI.getAll();
      setGoals(response.data);
    } catch (error) {
      toast.error('Failed to load goals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await goalsAPI.create(formData);
      addGoal(response.data);
      toast.success('Goal created!');
      setFormData({ title: '', description: '', vision_alignment: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    try {
      await goalsAPI.delete(id);
      removeGoal(id);
      toast.success('Goal deleted');
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">1-Year Goals</h1>
            <p className="text-gray-600">The Mission - Your big picture vision</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSubmit}
            className="card mb-6 space-y-4"
          >
            <input
              type="text"
              className="input-field"
              placeholder="Goal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              className="textarea-field"
              placeholder="Description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <textarea
              className="textarea-field"
              placeholder="How does this align with your vision?"
              rows={2}
              value={formData.vision_alignment}
              onChange={(e) => setFormData({ ...formData, vision_alignment: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create Goal</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                </div>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {goal.description && (
                <p className="text-gray-600 mb-2">{goal.description}</p>
              )}
              {goal.vision_alignment && (
                <p className="text-sm text-blue-600 italic">{goal.vision_alignment}</p>
              )}
            </motion.div>
          ))}

          {goals.length === 0 && !showForm && (
            <div className="card col-span-2 text-center py-12">
              <Target className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">No goals yet. Create your first goal!</p>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Goals;
