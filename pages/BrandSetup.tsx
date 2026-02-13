
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandTone, BrandingConfig } from '../types';
import { TONES } from '../constants';

const BrandSetup: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<BrandingConfig>(
    user?.branding || {
      logoUrl: 'https://picsum.photos/200/200?random=1',
      primaryColor: '#4f46e5',
      secondaryColor: '#f59e0b',
      tone: BrandTone.FORMAL,
      footerText: 'Empowering Future Leaders',
      fontPreference: 'Inter',
      socialHandles: '@ourschool',
      layoutStyle: 'modern',
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ branding: config });
      setIsSaving(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Brand Your School</h1>
        <p className="text-lg text-slate-500">Configure your identity once, and our AI will ensure consistency across all posts.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎨</span> Visual Identity
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={config.logoUrl}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">School Motto / Footer Text</label>
                <input
                  type="text"
                  value={config.footerText}
                  onChange={(e) => setConfig({ ...config, footerText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                  placeholder="Education First"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Brand Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="h-12 w-12 rounded-lg border-0 cursor-pointer p-0 overflow-hidden"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary Brand Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="h-12 w-12 rounded-lg border-0 cursor-pointer p-0 overflow-hidden"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">🗣️</span> Communication Tone
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => setConfig({ ...config, tone: tone.value })}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    config.tone === tone.value
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <p className={`font-bold mb-1 ${config.tone === tone.value ? 'text-indigo-700' : 'text-slate-900'}`}>
                    {tone.label}
                  </p>
                  <p className="text-xs text-slate-500">{tone.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Brand Identity'}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div className="sticky top-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Identity Preview</h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
              <div 
                className="h-32 flex items-center justify-center p-6"
                style={{ backgroundColor: config.primaryColor }}
              >
                <img 
                  src={config.logoUrl} 
                  alt="Logo" 
                  className="max-h-full max-w-full drop-shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/200/200';
                  }}
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
                <div className="h-4 w-1/2 bg-slate-50 rounded-full"></div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold truncate" style={{ color: config.primaryColor }}>
                    {config.footerText}
                  </span>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: config.secondaryColor }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-amber-50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-sm">
              <p className="flex gap-2">
                <span>💡</span>
                Consistency is key to a professional look. We'll use these colors as themes for all AI-generated posters.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BrandSetup;
