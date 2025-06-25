import { fetchSavedPost } from "@/AppWrite/appwriteFunction";
import { useEffect, useState } from "react";

const SavePostPage = () => {

  const [savedPost, setSavedPost] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(()=>{
    const getSavedPost = async() => {
    // setLoading(true)
    try {
      const post = await fetchSavedPost();
      setSavedPost(post);
      setLoading(true)
    } catch (e) {
      console.log('Can not get saved post', e);
       setError('Failed to load saved posts.');
    } finally{
      setLoading(false)
    }
  }
  getSavedPost()
  },[])

  
  if (loading) return <p className="p-4">Loading saved posts...</p>;

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  if (savedPost.length === 0) {
    return <p className="p-4 text-gray-500">You haven't saved any posts yet.</p>;
  }

  

   return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Saved Posts</h1>
      <div className="space-y-4">
        {savedPost.map((post) => (
          <div
            key={post.$id}
            className="p-4 border rounded bg-white shadow-sm"
          >
            <p>{post.content}</p>
            <p className="text-sm text-gray-400 mt-2">
              Saved on {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavePostPage;