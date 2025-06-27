// src/pages/SavePostPage.jsx

import { fetchSavedPost } from "@/AppWrite/appwriteFunction";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom"; // Assuming you use react-router-dom
import { Bookmark, FileText, CalendarDays, AlertTriangle } from 'lucide-react';


 //! Displays a single saved post with a sleek card design.
const ThreadCard = ({ thread }) => {

    const firstPost = thread.posts[0]

  return(
  <div 
    className="bg-[#171717] rounded-xl p-6 border border-neutral-800 
               transform transition-all duration-300 hover:scale-105 hover:border-[#ff6900]/50 shadow-lg"
  >
    <div className="flex flex-col h-full">
      <FileText className="w-8 h-8 text-neutral-500 mb-4" />
      <p className="text-neutral-300 flex-grow mb-6">
        {firstPost.content}
      </p>
        <p className="text-sm text-neutral-500 mb-4">
          {thread.posts.length} post{thread.posts.length > 1 ? "s" : ""} in this thread
        </p>
      <div className="flex items-center text-xs text-neutral-500 mt-auto pt-4 border-t border-neutral-800">
        <CalendarDays className="w-4 h-4 mr-2" />
        <span>Saved on {new Date(firstPost.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
)};

/**
 * Provides a visually appealing loading state that mimics the final layout.
 */
const SkeletonLoader = () => {
  const SkeletonCard = () => (
    <div className="bg-[#171717] rounded-xl p-6 border border-neutral-800">
      <div className="animate-pulse flex flex-col h-full">
        <div className="h-8 w-8 bg-neutral-700 rounded mb-4"></div>
        <div className="h-4 bg-neutral-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-neutral-700 rounded w-5/6 mb-6"></div>
        <div className="mt-auto pt-4 border-t border-neutral-800">
          <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 animate-pulse text-center md:text-left">
            <div className="h-12 bg-neutral-800 rounded w-1/3 mx-auto md:mx-0 mb-4"></div>
            <div className="h-6 bg-neutral-800 rounded w-1/2 mx-auto md:mx-0"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </div>
    </div>
  );
};

/**
 * Guides the user with a clear CTA when no posts are saved.
 */
const EmptyState = () => (
  <div className="bg-[#0a0a0a] min-h-screen flex flex-col justify-center items-center text-center p-4">
    <div className="bg-[#171717] p-10 md:p-16 rounded-2xl border border-neutral-800 shadow-2xl">
      <Bookmark className="mx-auto h-16 w-16 text-[#ff6900] mb-6" />
      <h2 className="text-3xl font-bold text-white mb-2">No Saved Posts Yet</h2>
      <p className="text-neutral-400 mb-8 max-w-sm">
        It looks like your saved list is empty. Start exploring and save the posts you love!
      </p>
      <Link 
        to="/explore" // <-- CHANGE THIS to your main content feed route
        className="bg-[#ff6900] text-white font-bold py-3 px-8 rounded-lg 
                   transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-[#ff6900]/30"
      >
        Discover Posts
      </Link>
    </div>
  </div>
);

/**
 * Provides a user-friendly error message with a retry option.
 */
const ErrorState = ({ message, onRetry }) => (
  <div className="bg-[#0a0a0a] min-h-screen flex flex-col justify-center items-center text-center p-4">
    <div className="bg-[#171717] p-10 md:p-16 rounded-2xl border border-neutral-800 shadow-2xl">
      <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold text-white mb-2">Oops! Something Went Wrong</h2>
      <p className="text-neutral-400 mb-8 max-w-sm">{message}</p>
      <button 
        onClick={onRetry}
        className="bg-[#ff6900] text-white font-bold py-3 px-8 rounded-lg 
                   transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-[#ff6900]/30"
      >
        Try Again
      </button>
    </div>
  </div>
);


// =================================================================================
// 2. Main Page Component
// =================================================================================

const SavePostPage = () => {
  const [savedPost, setSavedPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders.
  const getSavedPost = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const posts = await fetchSavedPost();
      setSavedPost(posts);
    } catch (e) {
      console.error('Cannot get saved post:', e);
      setError('Failed to load saved posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSavedPost();
  }, [getSavedPost]);

  // --- Conditional Rendering Logic ---
  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorState message={error} onRetry={getSavedPost} />;
  if (savedPost.length === 0) return <EmptyState />;

  // --- Success State ---
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-neutral-200 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center md:text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Your Saved Posts</h1>
          <p className="text-neutral-400 mt-2 text-lg">
            Revisit the content you found inspiring.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedPost.map((thread) => (
            <ThreadCard key={thread.threadID} thread={thread} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SavePostPage;
