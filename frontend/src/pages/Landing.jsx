import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Calendar, Zap, Brain, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Target,
      title: 'Vision & Anti-Vision',
      description: 'Define what you want AND what you fear to create powerful motivation',
    },
    {
      icon: Calendar,
      title: 'Structured Progress',
      description: '1-Year Goals, 1-Month Projects, and Daily Levers to compound success',
    },
    {
      icon: Zap,
      title: 'Break Autopilot',
      description: 'Random reminders with self-inquiry questions keep you conscious',
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Get personalized coaching and alignment analysis powered by GPT-4',
    },
  ];

  const protocol = [
    { phase: 'Morning', action: 'Journal your Vision & Anti-Vision. Be brutal.' },
    { phase: 'Throughout Day', action: 'Answer random self-inquiry questions to stay conscious.' },
    { phase: 'Evening', action: 'Reflect, name your enemy, and set tomorrow\'s goals.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              The 1-Day Life Reset
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}Protocol
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your life one day at a time. Break the identity loop. Turn your life into a game you can win.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button className="btn-primary flex items-center gap-2 text-lg">
                  Start Your Reset <ArrowRight size={20} />
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-secondary text-lg">Sign In</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Protocol Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            The Daily Protocol
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {protocol.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="text-blue-600 font-bold text-lg mb-2">{step.phase}</div>
                <p className="text-gray-700">{step.action}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Turn Life Into A Game
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="card flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Elements Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Your Life, Gamified</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              { label: 'Vision', desc: 'How you win' },
              { label: 'Anti-Vision', desc: 'What\'s at stake if you lose' },
              { label: '1-Year Goal', desc: 'The mission' },
              { label: '1-Month Project', desc: 'The boss fight' },
              { label: 'Daily Levers', desc: 'The quests' },
              { label: 'Constraints', desc: 'The rules' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md flex items-start gap-3"
              >
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <div className="font-bold text-gray-900">{item.label}</div>
                  <div className="text-gray-600 text-sm">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Reset Your Life?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands transforming their lives one day at a time
          </p>
          <Link to="/register">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Start Free Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2026 Life Reset Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
