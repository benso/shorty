import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sunset, Target, CheckSquare, TrendingUp, Flame } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuthStore, useGoalsStore } from '../hooks/useStore';
import { goalsAPI, dailyLeversAPI, journalAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { goals, dailyLevers, setGoals, setDailyLevers } = useGoalsStore();
  const [stats, setStats] = useState({
    activeGoals: 0,
    completedToday: 0,
    totalLevers: 0,
    journalStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [goalsRes, leversRes] = await Promise.all([
        goalsAPI.getAll({ status_filter: 'active' }),
        dailyLeversAPI.getAll({ completed: false }),
      ]);

      setGoals(goalsRes.data);
      setDailyLevers(leversRes.data);

      setStats({
        activeGoals: goalsRes.data.length,
        completedToday: 0, // Calculate based on today's completed levers
        totalLevers: leversRes.data.length,
        journalStreak: 7, // Placeholder - calculate actual streak
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { name: 'Morning Journal', path: '/morning', icon: BookOpen, color: 'from-orange-400 to-pink-500' },
    { name: 'Evening Reflection', path: '/evening', icon: Sunset, color: 'from-purple-400 to-indigo-500' },
    { name: 'Set Goals', path: '/goals', icon: Target, color: 'from-blue-400 to-cyan-500' },
    { name: 'Daily Levers', path: '/daily-levers', icon: CheckSquare, color: 'from-green-400 to-emerald-500' },
  ];

  const statCards = [
    { label: 'Active Goals', value: stats.activeGoals, icon: Target, color: 'text-blue-600' },
    { label: 'Completed Today', value: stats.completedToday, icon: CheckSquare, color: 'text-green-600' },
    { label: 'Pending Levers', value: stats.totalLevers, icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Day Streak', value: stats.journalStreak, icon: Flame, color: 'text-red-600' },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
          </h1>
          <p className="text-xl text-gray-600">
            Ready to win today? Let's make progress toward your vision.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    <Icon size={32} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`card bg-gradient-to-br ${action.color} text-white cursor-pointer`}
                  >
                    <Icon size={32} className="mb-3" />
                    <h3 className="text-lg font-bold">{action.name}</h3>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Today's Levers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Today's Levers</h2>
            <Link to="/daily-levers">
              <button className="btn-secondary text-sm">View All</button>
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : dailyLevers.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No daily levers yet. Create some to get started!</p>
              <Link to="/daily-levers">
                <button className="btn-primary">Create Daily Levers</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyLevers.slice(0, 5).map((lever) => (
                <div key={lever.id} className="card flex items-center gap-4">
                  <CheckSquare className="text-gray-400" size={24} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{lever.title}</h3>
                    {lever.description && (
                      <p className="text-sm text-gray-600">{lever.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Active Goals</h2>
            <Link to="/goals">
              <button className="btn-secondary text-sm">Manage Goals</button>
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : goals.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No goals set yet. Start by defining your vision!</p>
              <Link to="/goals">
                <button className="btn-primary">Set Your Goals</button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {goals.slice(0, 4).map((goal) => (
                <div key={goal.id} className="card">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{goal.title}</h3>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
