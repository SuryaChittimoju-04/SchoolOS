
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, PostStatus } from '../types';
// Fixed: STORAGE_KEYS is defined in constants.ts, not types.ts
import { STORAGE_KEYS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { generateCaption, generateMarketingImage } from '../services/geminiService';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    // Fixed: Use STORAGE_KEYS.POSTS instead of referencing it from types.ts
    const savedPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    const found = savedPosts.find((p: Post) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleCopy = () => {
    if (post?.caption) {
      const fullText = `${post.caption}\n\n${post.hashtags?.join(' ')}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    if (!post || !user || !user.branding) return;
    
    setIsRegenerating(true);
    try {
      const [captionData, imageUrl] = await Promise.all([
        generateCaption(user.name, post.title, post.description, user.branding),
        generateMarketingImage(
          post.title, 
          post.description, 
          user.branding, 
          post.aspectRatio, 
          post.postType === 'event'
        )
      ]);

      const updatedPost: Post = {
        ...post,
        status: PostStatus.GENERATED,
        generatedAt: new Date().toISOString(),
        imageUrl,
        caption: captionData.caption + "\n\n" + captionData.cta,
        hashtags: captionData.hashtags,
      };

      const allPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = allPosts.findIndex((p: Post) => p.id === post.id);
      if (index !== -1) allPosts[index] = updatedPost;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(allPosts));
      
      setPost(updatedPost);
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate content. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!post) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {isRegenerating && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 relative mb-6">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🪄</div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Regenerating Magic</h2>
          <p className="text-slate-500 max-w-xs">Our AI is re-imagining your content based on your brand guidelines.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            &larr;
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{post.title}</h1>
            <p className="text-slate-500 font-medium">Generated on {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <span>🔄</span> Regenerate
          </button>
          <a 
            href={post.imageUrl} 
            download={`${post.title.replace(/\s+/g, '_')}_poster.png`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            <span>💾</span> Download HD
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative">
            <div className="bg-slate-100 aspect-square">
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-contain" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">Image not available</div>
              )}
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/50 shadow-sm">
                Generated with SchoolOS AI
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="p-2 bg-indigo-800 rounded-lg">📄</span> Campaign Intel
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="font-semibold">{post.status.toUpperCase()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Format</p>
                <p className="font-semibold">{post.aspectRatio}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Description Brief</p>
                <p className="text-sm text-indigo-100 leading-relaxed bg-indigo-800/50 p-4 rounded-2xl">{post.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">📱</span> Social Copy
              </h2>
              <button 
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {copied ? 'Copied! ✅' : 'Copy Text'}
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap text-slate-700 leading-relaxed text-lg font-medium">
              {post.caption}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {post.hashtags?.map(tag => (
                <span key={tag} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2.5rem] border border-amber-100 p-8 shadow-sm">
            <h4 className="text-xl font-bold text-amber-900 mb-2 flex items-center gap-2">
              <span>🚀</span> Direct Publishing
            </h4>
            <p className="text-amber-800/80 text-sm mb-8 leading-relaxed">
              Tired of downloading and re-uploading? Connect your School's Facebook and Instagram accounts to schedule this post instantly.
            </p>
            <button className="w-full bg-amber-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all active:scale-[0.98]">
              Upgrade to Pro for Direct Posting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
