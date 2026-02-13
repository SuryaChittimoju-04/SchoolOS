
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      register(email, name);
    } else {
      login(email, 'Demo School');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 mb-6">
            <span className="text-white text-4xl font-bold">S</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">SchoolOS</h1>
          <p className="text-slate-500 font-medium">Your AI Marketing Department</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {isRegistering ? 'Create your school account' : 'Welcome back!'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">School Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="St. Mary's Academy"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                placeholder="admin@school.edu"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {isRegistering ? 'Start Marketing for Free' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign in' : "New school? Register for free"}
            </button>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-400 text-sm">
          Trusted by over 1,000+ schools worldwide.
        </p>
      </div>
    </div>
  );
};

export default Login;
