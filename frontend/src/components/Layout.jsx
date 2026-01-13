import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Sunset, Target, Briefcase, CheckSquare, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Morning Journal', path: '/morning', icon: BookOpen },
    { name: 'Evening Reflection', path: '/evening', icon: Sunset },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Daily Levers', path: '/daily-levers', icon: CheckSquare },
    { name: 'Reminders', path: '/reminders', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Life Reset
          </h1>
          <p className="text-sm text-gray-600 mt-1">Protocol</p>
        </div>

        <nav className="flex-1 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-4 py-2">
            <p className="text-sm text-gray-600">Signed in as</p>
            <p className="font-medium text-gray-900 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
