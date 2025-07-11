// src/pages/SavePostPage.jsx

import { deleteFromDatabase, fetchSavedPost } from "@/AppWrite/appwriteFunction";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bookmark, MessageSquare, CalendarDays, AlertTriangle, X, MoveDownIcon, Trash2, Newspaper } from 'lucide-react';

/**
 * A sleek modal to display the full content of a saved thread.
 * It provides a focused reading experience without leaving the page.
 */
const ThreadModal = ({ thread, onClose }) => {
  // Effect to handle closing the modal with the 'Escape' key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <div 
        className="bg-[#1c1c1c] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-neutral-700 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Modal Header */}
        <header className="flex justify-between items-center p-4 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#ff6900]" />
            <h2 className="text-xl font-bold text-white">Thread Details</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </header>

        {/* Scrollable Post Content */}
        <div className="p-6 space-y-5 overflow-y-auto scrollbar-hide">
          {thread.posts.map((post, index) => (
            <div key={index} className="bg-[#111] p-4 rounded-lg border border-neutral-800 text-neutral-300 leading-relaxed animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
              <p>{post.content}</p>
              <div className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-700/50 flex items-center gap-2">
                <CalendarDays size={14} />
                <span>Posted on {new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
          
        </div>

        {/* Modal Footer */}
        <footer className="p-4 text-center text-xs text-neutral-400 border-t border-neutral-800 flex-shrink-0">
          {thread.posts.length > 1 && (
            <span className="flex justify-center items-center gap-1 mb-2 text-neutral-500 text-sm">
              Scroll to view more
              <MoveDownIcon className="font-bold animate-bounce-slow" size={10} />
            </span>
          )}
          Saved on {new Date(thread.posts[0].createdAt).toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
};

/**
 * Displays a single saved thread as a clickable card.
 * Now acts as a teaser that opens the ThreadModal on click.
 */
const ThreadCard = ({ thread, onClick, onDelete, isDeleting }) => {
  const firstPost = thread.posts[0];
  const postSnippet = firstPost.content.substring(0, 100) + (firstPost.content.length > 100 ? '...' : '');
  
  // Calculate thread count string
  const threadCount = `${thread.posts.length} post${thread.posts.length > 1 ? "s" : ""} in this thread`;

  return (
    <div
      onClick={isDeleting ? undefined : onClick}
      className="group bg-[#171717] rounded-xl p-6 border border-neutral-800 
                cursor-pointer transition-all duration-300 
                hover:border-[#ff6900]/60 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#ff6900]/10 p-2 rounded-lg">
              <MessageSquare className="w-4 h-4 text-[#ff6900]" />
            </div>
            
            <p className="text-sm text-neutral-400 font-medium">
              {threadCount}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if(!isDeleting){
              onDelete(thread.threadID);
              }
            }}
            disabled={isDeleting}
            className="p-2 rounded-full hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          >
            {isDeleting ? (
              <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
            ):(  
            <Trash2 className="w-5 h-5 text-[#ffffff] hover:text-red-800 transition"/>
            )}
          </button>
        </div>

        <p className="text-neutral-300 mb-6 flex-grow">
          {postSnippet}
        </p>
        
        <div className="text-xs text-neutral-500 mt-auto pt-4 border-t border-neutral-800/70 flex items-center justify-between">
          <span>Saved: {new Date(firstPost.createdAt).toLocaleDateString()}</span>
          <span className="text-[#ff6900]/80 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            {thread.posts.length > 1 ? "View thread" : "view post"} &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Provides a visually appealing loading state that mimics the new card layout.
 */
const SkeletonLoader = () => {
  const SkeletonCard = () => (
    <div className="bg-[#171717] rounded-xl p-6 border border-neutral-800">
      <div className="animate-pulse flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-10 w-10 bg-neutral-700 rounded-lg"></div>
          <div className="h-6 bg-neutral-700 rounded w-1/3 mt-2"></div>
        </div>
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
    <div className="bg-[#171717] p-10 md:p-16 rounded-2xl border border-neutral-800 shadow-2xl transform transition-transform hover:scale-105 duration-300">
      <Bookmark className="mx-auto h-16 w-16 text-[#ff6900] mb-6" />
      <h2 className="text-3xl font-bold text-white mb-2">No Saved Posts Yet</h2>
      <p className="text-neutral-400 mb-8 max-w-sm">
        It looks like your saved list is empty. Start exploring and save the posts you love!
      </p>
      <Link
          to="/dashboard"
        className="bg-[#ff6900] text-white font-bold py-3 px-8 rounded-lg 
                   transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-[#ff6900]/30"
      >
        Create Posts
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
  const [deletingThreads, setDeletingThreads] = useState(new Set());

  // State to manage the currently selected thread for the modal
  const [selectedThread, setSelectedThread] = useState(null);

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

  const handleDelete = async (threadID) => {
    const threadToDelete = savedPost.find(t=> t.threadID === threadID)
    try {
        setDeletingThreads(prev => new Set([...prev, threadID]));
        
      if(!threadToDelete) {
        setDeletingThreads(prev=> {
          const newSet = new Set(prev);
          newSet.delete(threadID)
          return newSet
        });
        return
      };
      await new Promise(resolve => setTimeout(resolve, 200))

      setSavedPost(prevPost => prevPost.filter(thread => thread.threadID !== threadID))

      for(const post of threadToDelete.posts){
        await deleteFromDatabase(post.$id);
      }
      
    } catch (error) {
      console.error('Error deleting post:', error);
      
      setSavedPost(prevPosts => {
        const exist = prevPosts.some(t => t.threadID)
        if(!exist && threadToDelete){
          return [...prevPosts , threadToDelete].sort((a,b)=> new Date(b.posts[0].createdAt)-new Date(a.posts[0].createdAt)
        );
      }
      return prevPosts
      })
       setError('Failed to delete post. Please try again.');
       setTimeout(()=> setError(''), 3000)
    }finally{
      setDeletingThreads(prev=> {
        const newSet = new Set(prev)
        newSet.delete(threadID)
        return newSet
      })
    }
  };

  // --- Handlers for Modal ---
  const handleOpenModal = (thread) => setSelectedThread(thread);
  const handleCloseModal = () => setSelectedThread(null);

  // --- Conditional Rendering Logic ---
  if (loading) return <SkeletonLoader />;
  if (error) return <ErrorState message={error} onRetry={getSavedPost} />;
  if (savedPost.length === 0) return <EmptyState />;

  // --- Success State ---
  return (
    <>
      <div className="bg-[#0a0a0a] min-h-screen text-neutral-200 font-sans mt-5">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <header className="text-center md:text-left mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              Your Saved Posts
            </h1>
            <p className="text-neutral-400 mt-3 text-lg">
              Revisit the threads and ideas you found inspiring.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedPost.map((thread) => (
              <ThreadCard 
                key={thread.threadID} 
                thread={thread} 
                onClick={() => handleOpenModal(thread)} 
                onDelete={handleDelete}
                isDeleting={deletingThreads.has(thread.threadID)}
              />
            ))}
          </div>
        </main>
      </div>
      
      {/* Render the modal if a thread is selected */}
      {selectedThread && (
        <ThreadModal thread={selectedThread} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default SavePostPage;