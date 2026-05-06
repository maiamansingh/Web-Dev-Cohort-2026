import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, User, Calendar, RefreshCcw } from 'lucide-react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // The public freeapi URL for random users
      const response = await fetch('https://api.freeapi.app/api/v1/public/randomusers');
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const result = await response.json();
      if (result.success && result.data && result.data.data) {
        setUsers(result.data.data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-6 md:p-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Directory
            </h1>
            <p className="text-slate-400 text-lg">Discover interesting profiles from around the world</p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Users'}
          </button>
        </header>

        {loading && users.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-pulse h-[340px]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-slate-700 rounded-full"></div>
                  <div className="space-y-3">
                    <div className="h-5 w-32 bg-slate-700 rounded"></div>
                    <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-slate-700 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
                  <div className="h-4 w-4/6 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-6 rounded-xl flex items-center justify-center flex-col gap-4 text-center">
            <p className="text-xl font-semibold">Oops! Something went wrong.</p>
            <p className="text-red-300/80">{error}</p>
            <button onClick={fetchUsers} className="mt-4 px-6 py-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {users.map((user) => (
              <motion.div
                key={user.login.uuid}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30"
              >
                {/* Decorative glowing orb behind the avatar */}
                <div className="absolute top-10 left-12 w-16 h-16 bg-blue-500 rounded-full mix-blend-screen filter blur-[30px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <div className="relative flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={user.picture.large}
                      alt={`${user.name.first} ${user.name.last}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-lg relative z-10"
                    />
                    <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/30 transform scale-110 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
                  </div>
                  
                  <div className="mt-4 text-center z-10">
                    <h2 className="text-xl font-semibold text-white tracking-wide group-hover:text-blue-400 transition-colors">
                      {user.name.title} {user.name.first} {user.name.last}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 text-xs font-medium text-slate-300 mt-2 border border-slate-700/50">
                      <User className="w-3 h-3 text-blue-400" />
                      {user.gender === 'male' ? 'Male' : 'Female'} • {user.dob.age} yrs
                    </span>
                  </div>
                </div>

                <div className="space-y-3 relative z-10 pt-4 border-t border-slate-700/50">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <a href={`mailto:${user.email}`} className="text-slate-300 hover:text-blue-400 transition-colors truncate" title={user.email}>
                      {user.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300 line-clamp-2">
                      {user.location.city}, {user.location.state}, {user.location.country}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{user.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">Joined {new Date(user.registered.date).getFullYear()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
