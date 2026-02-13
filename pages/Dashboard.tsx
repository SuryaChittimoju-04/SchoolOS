
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Post, PostStatus } from '../types';
import { STORAGE_KEYS } from '../constants';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user?.branding) {
      navigate('/brand-setup');
      return;
    }

    loadPosts();
  }, [user, navigate]);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (savedPosts) {
      const allPosts = JSON.parse(savedPosts);
      const schoolPosts = allPosts.filter((p: Post) => p.schoolId === user?.id);
      setPosts(schoolPosts.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      const allPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const filtered = allPosts.filter((p: Post) => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
      loadPosts();
    }
  };

  const stats = [
    { label: 'Total Content', value: posts.length, icon: '📦', color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: posts.filter(p => p.status === PostStatus.GENERATED).length, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'In Progress', value: posts.filter(p => p.status === PostStatus.GENERATING).length, icon: '⏳', color: 'bg-amber-50 text-amber-600' },
    { label: 'Usage Remaining', value: user?.planLimit ? user.planLimit - (user?.postsGeneratedThisMonth || 0) : 0, icon: '📊', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-slate-900">Hello, {user?.name}! 👋</h1>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
              user?.planType === 'pro' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {user?.planType} Plan
            </span>
          </div>
          <p className="text-slate-500 font-medium">Here's how your school's marketing is performing.</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
        >
          <span className="text-xl">✨</span> Create New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Content</h2>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
              🎨
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Your gallery is empty</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
              Bring your school's stories to life. Create branded posters, event announcements, and more in seconds.
            </p>
            <Link to="/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white group rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200 cursor-pointer relative"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <button 
                  onClick={(e) => handleDelete(e, post.id)}
                  className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/90 hover:bg-red-500 hover:text-white rounded-xl shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                >
                  🗑️
                </button>

                <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                  {post.status === PostStatus.GENERATING ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-indigo-50/50">
                      <div className="relative mb-4">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
                      </div>
                      <p className="font-bold text-indigo-700">AI is crafting...</p>
                      <p className="text-xs text-indigo-500 mt-2">Gemini + Imagen in action</p>
                    </div>
                  ) : post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500 p-8 text-center">
                      <p className="font-bold">Generation Failed</p>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      post.status === PostStatus.GENERATED ? 'bg-white/90 text-green-600' : 
                      post.status === PostStatus.GENERATING ? 'bg-white/90 text-amber-600' : 'bg-red-500 text-white'
                    }`}>
                      {post.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                      {post.postType}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mt-1">{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
