
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PLAN_LIMITS } from '../constants';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();

  const handleUpgrade = (plan: 'basic' | 'pro') => {
    updateUser({ 
      planType: plan, 
      planLimit: plan === 'basic' ? PLAN_LIMITS.basic : PLAN_LIMITS.pro 
    });
    alert(`Successfully upgraded to ${plan.toUpperCase()} plan!`);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Settings</h1>
        <p className="text-lg text-slate-500">Manage your school profile and subscription plan.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🏫</span> School Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">School Name</label>
            <input
              type="text"
              readOnly
              value={user.name}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Email</label>
            <input
              type="text"
              readOnly
              value={user.email}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-2">
          <span className="text-2xl">💳</span> Subscription Plans
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${
            user.planType === 'free' ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' : 'border-slate-100 bg-slate-50 opacity-80'
          }`}>
            <h3 className="text-lg font-bold mb-1">Free Tier</h3>
            <p className="text-3xl font-extrabold mb-6">$0<span className="text-sm text-slate-400 font-normal">/mo</span></p>
            <ul className="space-y-4 text-sm text-slate-600 mb-10">
              <li className="flex gap-2">✅ <strong>{PLAN_LIMITS.free}</strong> posts/mo</li>
              <li className="flex gap-2">✅ Standard AI models</li>
              <li className="flex gap-2">✅ Brand consistency</li>
            </ul>
            {user.planType === 'free' ? (
              <span className="block w-full text-center py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-default">Current Plan</span>
            ) : null}
          </div>

          {/* Basic Plan */}
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${
            user.planType === 'basic' ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' : 'border-slate-100 bg-slate-50'
          }`}>
            <h3 className="text-lg font-bold mb-1">Basic</h3>
            <p className="text-3xl font-extrabold mb-6">$49<span className="text-sm text-slate-400 font-normal">/mo</span></p>
            <ul className="space-y-4 text-sm text-slate-600 mb-10">
              <li className="flex gap-2">✅ <strong>{PLAN_LIMITS.basic}</strong> posts/mo</li>
              <li className="flex gap-2">✅ Higher res images</li>
              <li className="flex gap-2">✅ Priority generation</li>
            </ul>
            {user.planType === 'basic' ? (
              <span className="block w-full text-center py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-default">Current Plan</span>
            ) : (
              <button 
                onClick={() => handleUpgrade('basic')}
                className="w-full py-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded-2xl transition-all"
              >
                Upgrade to Basic
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`p-8 rounded-[2.5rem] border-2 relative transition-all ${
            user.planType === 'pro' ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' : 'border-slate-100 bg-slate-900 text-white'
          }`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Recommended</div>
            <h3 className={`text-lg font-bold mb-1 ${user.planType === 'pro' ? 'text-slate-900' : 'text-white'}`}>Pro Agent</h3>
            <p className={`text-3xl font-extrabold mb-6 ${user.planType === 'pro' ? 'text-slate-900' : 'text-white'}`}>$129<span className={`text-sm font-normal ${user.planType === 'pro' ? 'text-slate-400' : 'text-slate-400'}`}>/mo</span></p>
            <ul className={`space-y-4 text-sm mb-10 ${user.planType === 'pro' ? 'text-slate-600' : 'text-slate-300'}`}>
              <li className="flex gap-2">🔥 <strong>{PLAN_LIMITS.pro}</strong> posts/mo</li>
              <li className="flex gap-2">🔥 Multi-user access</li>
              <li className="flex gap-2">🔥 Auto-social posting</li>
              <li className="flex gap-2">🔥 Analytics dashboard</li>
            </ul>
            {user.planType === 'pro' ? (
              <span className="block w-full text-center py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-default">Current Plan</span>
            ) : (
              <button 
                onClick={() => handleUpgrade('pro')}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-900/40 transition-all"
              >
                Go Pro Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
