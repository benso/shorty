import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Check } from 'lucide-react';
import Layout from '../components/Layout';
import { dailyLeversAPI } from '../utils/api';
import toast from 'react-hot-toast';

const DailyLevers = () => {
  const [levers, setLevers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    loadLevers();
  }, []);

  const loadLevers = async () => {
    try {
      const response = await dailyLeversAPI.getAll();
      setLevers(response.data);
    } catch (error) {
      toast.error('Failed to load daily levers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dailyLeversAPI.create(formData);
      setLevers([response.data, ...levers]);
      toast.success('Daily lever created!');
      setFormData({ title: '', description: '' });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create daily lever');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await dailyLeversAPI.complete(id);
      setLevers(levers.map((l) => (l.id === id ? response.data : l)));
      toast.success('Completed!');
    } catch (error) {
      toast.error('Failed to complete');
    }
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Levers</h1>
            <p className="text-gray-600">The Quests - Daily actions that compound</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Lever
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
            <input
              type="text"
              className="input-field"
              placeholder="What action will you take today?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              className="textarea-field"
              placeholder="Details (optional)"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <button type="submit" className="btn-primary">Create Lever</button>
          </form>
        )}

        <div className="space-y-3">
          {levers.map((lever) => (
            <motion.div
              key={lever.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`card flex items-center gap-4 ${
                lever.is_completed ? 'bg-green-50' : ''
              }`}
            >
              <button
                onClick={() => !lever.is_completed && handleComplete(lever.id)}
                className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  lever.is_completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {lever.is_completed && <Check className="text-white" size={16} />}
              </button>
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    lever.is_completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-900'
                  }`}
                >
                  {lever.title}
                </h3>
                {lever.description && (
                  <p className="text-sm text-gray-600">{lever.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default DailyLevers;
