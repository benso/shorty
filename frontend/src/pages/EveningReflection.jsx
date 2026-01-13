import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sunset, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { reflectionsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EveningReflection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wins: '',
    challenges: '',
    lessons: '',
    tomorrow_focus: '',
    current_phase: 'Uncertainty',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reflectionsAPI.create(formData);
      toast.success('Evening reflection saved!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save reflection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
            <Sunset className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evening Reflection</h1>
            <p className="text-gray-600">Review your day and plan tomorrow</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Today's Wins
            </label>
            <textarea
              className="textarea-field"
              rows={4}
              value={formData.wins}
              onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
              placeholder="What went well today?"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Challenges
            </label>
            <textarea
              className="textarea-field"
              rows={4}
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              placeholder="What didn't go as planned?"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Lessons Learned
            </label>
            <textarea
              className="textarea-field"
              rows={4}
              value={formData.lessons}
              onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
              placeholder="What did you learn?"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Tomorrow's Focus
            </label>
            <textarea
              className="textarea-field"
              rows={3}
              value={formData.tomorrow_focus}
              onChange={(e) => setFormData({ ...formData, tomorrow_focus: e.target.value })}
              placeholder="What's your main focus for tomorrow?"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Current Phase
            </label>
            <select
              className="input-field"
              value={formData.current_phase}
              onChange={(e) => setFormData({ ...formData, current_phase: e.target.value })}
            >
              <option value="Dissonance">Dissonance - Feeling like I don't belong</option>
              <option value="Uncertainty">Uncertainty - Don't know what's next</option>
              <option value="Discovery">Discovery - Finding my path</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Evening Reflection'}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
};

export default EveningReflection;
