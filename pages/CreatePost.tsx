
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AspectRatio, Post, PostStatus } from '../types';
import { ASPECT_RATIOS, STORAGE_KEYS } from '../constants';
import { generateCaption, generateMarketingImage } from '../services/geminiService';

const CreatePost: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    postType: 'poster' as 'poster' | 'event',
    aspectRatio: AspectRatio.SQUARE,
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.branding) return;

    if (user.postsGeneratedThisMonth >= user.planLimit) {
      setError('Monthly plan limit reached. Please upgrade to Pro.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    const postId = 'post_' + Math.random().toString(36).substr(2, 9);
    
    const newPost: Post = {
      id: postId,
      schoolId: user.id,
      postType: formData.postType,
      title: formData.title,
      description: formData.description,
      aspectRatio: formData.aspectRatio,
      status: PostStatus.GENERATING,
      createdAt: new Date().toISOString(),
    };

    const existingPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([...existingPosts, newPost]));

    try {
      const [captionData, imageUrl] = await Promise.all([
        generateCaption(user.name, formData.title, formData.description, user.branding),
        generateMarketingImage(
          formData.title, 
          formData.description, 
          user.branding, 
          formData.aspectRatio, 
          formData.postType === 'event',
          formData.postType === 'event' ? uploadedImage || undefined : undefined
        )
      ]);

      const updatedPost: Post = {
        ...newPost,
        status: PostStatus.GENERATED,
        generatedAt: new Date().toISOString(),
        imageUrl,
        caption: captionData.caption + "\n\n" + captionData.cta,
        hashtags: captionData.hashtags,
      };

      const finalPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = finalPosts.findIndex((p: Post) => p.id === postId);
      if (index !== -1) finalPosts[index] = updatedPost;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(finalPosts));

      updateUser({ postsGeneratedThisMonth: user.postsGeneratedThisMonth + 1 });
      navigate(`/post/${postId}`);
    } catch (err) {
      console.error(err);
      const failedPosts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
      const index = failedPosts.findIndex((p: Post) => p.id === postId);
      if (index !== -1) failedPosts[index].status = PostStatus.FAILED;
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(failedPosts));
      setError('Something went wrong during generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Create New Post</h1>
        <p className="text-lg text-slate-500">Describe your idea, and let SchoolOS craft a brand-aligned poster and caption.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">What are we creating?</label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, postType: 'poster' })}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    formData.postType === 'poster' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-50'
                  }`}
                >
                  Marketing Poster
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, postType: 'event' })}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    formData.postType === 'event' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Event Photo
                </button>
              </div>
            </div>

            {formData.postType === 'event' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reference Photo (Optional)
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    uploadedImage ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {uploadedImage ? (
                    <div className="relative h-full w-full p-4">
                      <img src={uploadedImage} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-4xl mb-2">📸</span>
                      <p className="text-sm font-bold text-slate-900">Click to upload photo</p>
                      <p className="text-xs text-slate-400 mt-1">AI will enhance and brand this image</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Campaign Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                placeholder="Ex: Annual Sports Day 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Brief Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none resize-none"
                placeholder="Join us for a day of teamwork and sportsmanship. Open to all students and parents..."
              />
              <p className="text-xs text-slate-400 mt-2">The AI uses this to generate both the image and the Instagram caption.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-4">Choose Format</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, aspectRatio: ar.value })}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    formData.aspectRatio === ar.value
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`mx-auto mb-3 bg-slate-200 rounded border border-slate-300 ${
                    ar.value === AspectRatio.SQUARE ? 'w-10 h-10' :
                    ar.value === AspectRatio.PORTRAIT ? 'w-8 h-10' : 'w-10 h-6'
                  }`}></div>
                  <p className="font-bold text-xs">{ar.label}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin text-xl">⚙️</span>
                  Crafting Masterpiece...
                </>
              ) : (
                <>
                  <span className="text-xl">🪄</span>
                  Generate Branded Post
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-8 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span> AI Engine Logic
              </h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold">01</span>
                  <span>Fetching your <strong className="text-white">Brand Palette</strong> from config.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold">02</span>
                  <span>Gemini 3 Flash generating <strong className="text-white">Structured Captions</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold">03</span>
                  <span>Gemini 2.5 Flash Image creating a <strong className="text-white">Custom Layout</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold">04</span>
                  <span>Normalizing aesthetics for <strong className="text-white">{user?.branding?.tone}</strong> tone.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2">Pro Tip</h4>
              <p className="text-sm text-indigo-700">Detailed descriptions yield better image background results. Mention specific academic subjects or sports for more accurate visuals!</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
