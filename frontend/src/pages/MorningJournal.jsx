import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Save } from 'lucide-react';
import Layout from '../components/Layout';
import { journalAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MorningJournal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vision: '',
    anti_vision: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await journalAPI.create({
        type: 'morning',
        ...formData,
      });
      toast.success('Morning journal saved!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save journal');
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
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <Sun className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Morning Journal</h1>
            <p className="text-gray-600">Define your vision and what you're fighting against</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Vision (Life You Want)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Describe the life you're moving toward. Be specific and inspiring.
            </p>
            <textarea
              className="textarea-field"
              rows={6}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              placeholder="e.g., I wake up energized, work on meaningful projects, spend quality time with loved ones..."
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Anti-Vision (Life You Hate/Fear)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              What are you moving away from? What scares you? Be brutal and honest.
            </p>
            <textarea
              className="textarea-field"
              rows={6}
              value={formData.anti_vision}
              onChange={(e) => setFormData({ ...formData, anti_vision: e.target.value })}
              placeholder="e.g., Stuck in a dead-end job, wasting time on social media, feeling unfulfilled..."
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              className="textarea-field"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any other thoughts, feelings, or intentions for today..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Morning Journal'}
          </button>
        </form>
      </motion.div>
    </Layout>
  );
};

export default MorningJournal;
