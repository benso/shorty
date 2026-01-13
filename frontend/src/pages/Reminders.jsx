import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { remindersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Reminders = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await remindersAPI.generateQuestions(10);
      setQuestions(response.data);
      toast.success('New questions generated!');
    } catch (error) {
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Self-Inquiry Reminders</h1>
            <p className="text-gray-600">Break autopilot with powerful questions</p>
          </div>
          <button
            onClick={generateQuestions}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles size={20} />
            {loading ? 'Generating...' : 'Generate New Questions'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card flex items-start gap-3"
            >
              <Bell className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <p className="text-gray-900 font-medium">{question}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 card bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-bold text-lg text-gray-900 mb-2">How to use reminders</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Set these questions as random phone reminders throughout the day</li>
            <li>• When a reminder appears, pause and genuinely answer the question</li>
            <li>• Use them to break out of autopilot mode</li>
            <li>• Reflect on your alignment with your vision</li>
          </ul>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Reminders;
