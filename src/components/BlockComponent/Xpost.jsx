import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAvatar } from "./Context/avatarContext";
import {
  Copy,
  Edit,
  Loader2,
  RefreshCw,
  X,
  AlertCircle,
  Check,
  Save,
  Twitter, 
  Share
} from "lucide-react";
import { savePost } from "@/AppWrite/appwriteFunction";
import { ID } from "appwrite";
import { toast, Toaster } from "sonner";
import { BorderBeam } from "../magicui/border-beam";
import { copyThreadToClipboard, postThreadToTwitterSequentially } from "@/AppWrite/XpostFunction";

// Twitter posting functions
export const postToTwitter = (content) => {
  const tweetText = encodeURIComponent(content);
  const twitterUrl = `https://x.com/intent/tweet?text=${tweetText}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400,scrollbars=yes');
};

export const postThreadToTwitter = (posts) => {
  // For threads, we'll open multiple tabs with numbered posts
  posts.forEach((post, index) => {
    const isFirstPost = index === 0;
    const threadNumber = posts.length > 1 ? ` ${index + 1}/${posts.length}` : '';
    const content = isFirstPost ? post.content : `${post.content}${threadNumber}`;
    
    setTimeout(() => {
      postToTwitter(content);
    }, index * 1000); // Delay each post by 1 second
  });
};

// API configuration for Vite
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://x-postgenerator-backend-production.up.railway.app".replace(
    /\/$/,
    ""
  );

// API service functions
const apiService = {
  async generatePost(data) {
    console.log("Sending request to backend:", data);

    const response = await fetch(`${API_BASE_URL}/api/generate-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Backend response:", responseData);

    if (!response.ok) {
      throw new Error(
        responseData.error ||
          responseData.details ||
          `HTTP error! status: ${response.status}`
      );
    }

    return responseData;
  },

  async testApiKey() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-key`);
      return await response.json();
    } catch (error) {
      console.error("API key test failed:", error);
      return { success: false, error: error.message };
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error("Backend health check failed:", error);
      return { status: "ERROR", error: error.message };
    }
  },
};

export const Xpost = () => {
  const [prompt, setPrompt] = useState("");
  const [postType, setPostType] = useState("long-thread");
  const [tone, setTone] = useState("educational");
  const [generating, setGenerating] = useState(false); // For post generation
  const [savingAll, setSavingAll] = useState(false); // For saving all posts
  const [regenerating, setRegenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState([]);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [postingToTwitter, setPostingToTwitter] = useState(false);
  // const [showTwitterModal, setShowTwitterModal] = useState(false);


  const textareaRef = useRef(null);
  const resultsRef = useRef(null);
  const { avatar } = useAvatar();

  const Tone = [
    { value: "professional", label: "Professional" },
    { value: "humorous", label: "Humorous" },
    { value: "educational", label: "Educational" },
    { value: "controversial", label: "Controversial" },
    { value: "casual", label: "Casual" },
    { value: "inspirational", label: "Inspirational" },
  ];

  const Type = [
    { value: "single", label: "Single Post" },
    { value: "thread", label: "Thread (2-5 posts)" },
    { value: "long-thread", label: "Long Thread (6-10 posts)" },
  ];

  // Check backend health on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const health = await apiService.checkHealth();
      setBackendStatus(health);
    };
    checkBackend();
  }, []);

  const generateXpost = async (isRegenerate = false) => {
    if (isRegenerate) {
      setRegenerating(true);
      setGenerating(true);
    }

    setError("");

    try {
      // Prepare the request data - matching your backend's expected parameters
      const requestData = {
        prompt: prompt.trim(),
        tone: tone,
        PostType: postType, // Note: Your backend expects 'PostType' not 'type'
      };

      console.log("Generating posts with data:", requestData);

      // Call your backend API
      const response = await apiService.generatePost(requestData);

      // Handle the response based on your backend's response format
      if (response.success && response.posts) {
        // Transform the posts to match your frontend format
        const transformedPosts = response.posts.map((post, index) => ({
          id: Date.now() + index,
          content: post.content,
          characterCount: post.characterCount,
          withinLimit: post.withinLimit,
        }));

        setGeneratedPost(transformedPosts);

        // Scroll to results after generation
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        throw new Error(response.error || "Failed to generate post");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(
        error.message ||
          "Failed to generate post. Please check your connection and try again."
      );
    } finally {
      setGenerating(false);
      setRegenerating(false);
    }
  };

  const copyToClipboard = async (text, postId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(postId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setError("Failed to copy text to clipboard");
    }
  };

  const handleNewPost = () => {
    setPrompt("");
    setGeneratedPost([]);
    setError("");
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Edit button functionality
  const handleEdit = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditingContent(currentContent);
  };

  const saveEditPost = (postId) => {
    const trimmedContent = editingContent.trim();
    if (!trimmedContent) {
      setError("Post content cannot be empty");
      return;
    }

    setGeneratedPost((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              content: editingContent.trim(),
              characterCount: editingContent.trim().length,
              withinLimit: editingContent.trim().length <= 280,
            }
          : post
      )
    );

    setEditingPostId(null);
    setEditingContent("");
    setError("");
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditingContent("");
  };

  const handleKeyEdit = (e, postId) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      saveEditPost(postId);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  // const testConnection = async () => {
  //   setError("");
  //   try {
  //     const result = await apiService.testApiKey();
  //     if (result.success) {
  //       setError(""); // Clear any previous errors
  //       alert("✅ Backend connection successful!");
  //     } else {
  //       setError(`Connection test failed: ${result.error}`);
  //     }
  //   } catch (error) {
  //     setError(`Connection test failed: ${error.message}`);
  //   }
  // };

  //Select post to save

  //save all post

  const handleSaveAll = async () => {
    setSavingAll(true);
    const threadID = ID.unique();
    for (const post of generatedPost) {
      await savePost(post.content, threadID);
    }
    // alert("All post saved");
    toast.success("All posts saved!", {
      description: "You can find them in your dashboard.",
    });

    console.log("All post saved");
    setSavingAll(false);
  };

  const createThreadContent = (posts) => {
  if (posts.length === 1) {
    return posts[0].content;
  }

  // Create a single comprehensive thread with proper formatting
  const threadPosts = posts.map((post, index) => {
    const postNumber = `${index + 1}/${posts.length}`;
    return `${postNumber}\n${post.content}`;
  }).join('\n\n🧵\n\n');

  // Add thread indicator at the beginning
  return `🧵 THREAD:\n\n${threadPosts}`;
};

// Updated handlePostToTwitter function and related code
// Replace your existing handlePostToTwitter function with this:
const handlePostToTwitter = async () => {
  setPostingToTwitter(true);
  
  try {
    if (postType === "single") {
      // Single post
      postToTwitter(generatedPost[0].content);
      toast.success("Opening Twitter!", {
        description: "Twitter compose window opened for your post."
      });
    } else {
      // For threads, create one comprehensive post
      const threadContent = createThreadContent(generatedPost);
      postToTwitter(threadContent);
      toast.success("Opening Twitter!", {
        description: "Twitter compose window opened with your complete thread."
      });
    }
  } catch (e) {
    console.error('Twitter posting error:', e);
    toast.error("Failed to post to Twitter", {
      description: "Please try again."
    });
  } finally {
    setPostingToTwitter(false);
  }
};

const handleTwitterModalPost = async (option) => {
  const postsToShare = generatedPost.map(post => ({ content: post.content }));
  
  try {
    if (option === 'sequential') {
      // Sequential posting with proper thread numbering
      postThreadToTwitterSequentially(postsToShare);
      toast.success("Opening Twitter windows!", {
        description: `${postsToShare.length} Twitter compose windows will open sequentially.`
      });
    } else if (option === 'copy') {
      // Copy to clipboard
      const copied = await copyThreadToClipboard(postsToShare);
      if (copied) {
        toast.success("Thread copied to clipboard!", {
          description: "You can now paste it into Twitter manually."
        });
      } else {
        toast.error("Failed to copy thread", {
          description: "Please try again."
        });
      }
    }
  } catch (e) {
    console.error('Twitter posting error:', e);
    toast.error("Failed to post to Twitter", {
      description: "Please try again."
    });
  }
};




// Also update your individual post Twitter button:
const handlePostSingleToTwitter = (postContent) => {
  postToTwitter(postContent);
  toast.success("Opening Twitter!", {
    description: "Twitter compose window opened."
  });
};

// Add this new function for the improved thread posting options:
// const showThreadPostingOptions = () => {
//   // This creates a modal with options for the user
//   return new Promise((resolve) => {
//     // Modal implementation as shown above
//   });
// };  

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        {/* Backend Status Indicator */}
        {backendStatus && (
          <div className="flex justify-center mb-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                backendStatus.status === "OK"
                  ? "bg-green-900/20 border border-green-500 text-green-400"
                  : "bg-red-900/20 border border-red-500/50 text-red-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  backendStatus.status === "OK" ? "bg-green-400" : "bg-red-400"
                }`}
              />
              Backend:{" "}
              {backendStatus.status === "OK" ? "Connected" : "Disconnected"}
              {backendStatus.hasApiKey === false && (
                <span className="ml-2 text-yellow-400">(API Key Missing)</span>
              )}
            </div>
          </div>
        )}

        {/* Input Form Section - Always Centered */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <Card className="w-full border-2 bg-gradient-to-b from-[#1f1f1f] via-[#171717] to-[#0f0f0f] border-[#222323] shadow-2xl relative overflow-hidden">
              <BorderBeam
                duration={8}
                borderWidth={3}
                size={500}
                className="from-transparent via-[#f97316] to-transparent"
              />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-center">
                  <div className="flex items-end space-x-2">
                    <div className="text-orange-500">
                      <h1 className="text-3xl font-bold">Xc</h1>
                    </div>
                    <div className="text-xl font-semibold text-[#e6e8ec]">
                      Generate Post
                    </div>
                  </div>
                </div>
              </CardHeader>

              <div className="h-0.5 mx-6 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-md" />

              <CardContent className="pt-6">
                {/* User Profile Section */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-10 h-10 flex-shrink-0">
                    <img
                      src={avatar}
                      alt="User"
                      className="rounded-full object-cover w-full h-full shadow-lg"
                    />
                  </div>
                  <div className="text-[#e6e8ec] font-medium text-lg">
                    What post do you want to create?
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 text-sm">{error}</span>
                    {/* <Button
                      onClick={testConnection}
                      size="sm"
                      variant="outline"
                      className="ml-auto border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      Test Connection
                    </Button> */}
                  </div>
                )}

                {/* Textarea Section */}
                <div className="mb-6">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Enter your topic or idea..."
                    className="w-full h-32 border-none outline-none bg-[#222323] rounded-2xl text-lg text-[#e6e8ec] placeholder:text-lg placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 p-4"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                {/* Select Options Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  {/* Post Type Dropdown */}
                  <div className="flex-1">
                    <label className="block text-[#e6e8ec] font-medium mb-2 text-sm">
                      Post Type
                    </label>
                    <Select value={postType} onValueChange={setPostType}>
                      <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-orange-500/50 transition-all duration-200">
                        <SelectValue placeholder="Select Post Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222323] text-white font-medium border-2 border-[#333333]">
                        {Type.map((type) => (
                          <SelectItem
                            key={type.value}
                            value={type.value}
                            className="hover:bg-[#ff7d00]/60 focus:bg-[#ea580c]/60"
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Post Tone Dropdown */}
                  <div className="flex-1">
                    <label className="block text-[#e6e8ec] font-medium mb-2 text-sm">
                      Post Tone
                    </label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-orange-500/50 transition-all duration-200">
                        <SelectValue placeholder="Select Tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222323] text-white font-medium hover:text-white border-2 border-[#333333]">
                        {Tone.map((toneOption) => (
                          <SelectItem
                            key={toneOption.value}
                            value={toneOption.value}
                            className="hover:bg-[#ff7d00]/60 focus:bg-[#ea580c]/60 "
                          >
                            {toneOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Character Count */}
                <div className="mb-6 text-right">
                  <span className="text-sm text-gray-400">
                    {prompt.length} characters
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={() => generateXpost(true)}
                  disabled={
                    !prompt.trim() || generating || backendStatus?.status !== "OK"
                  }
                  className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
                    !prompt.trim() || generating || backendStatus?.status !== "OK"
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800"
                  }`}
                >
                  {generating ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Generating...
                    </>
                  ) : backendStatus?.status !== "OK" ? (
                    "Backend Unavailable"
                  ) : (
                    "Generate Post"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/** ========================================Generated post from prompt=============================== */}

        {/* Results Section - Appears Below Input */}
        {generatedPost.length > 0 && (
          <div ref={resultsRef} className="w-full max-w-3xl mx-auto space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#e6e8ec]">
                Generated {postType === "single" ? "Post" : "Thread"}
              </h2>
              <Button
                onClick={() => generateXpost(true)}
                disabled={regenerating || backendStatus?.status !== "OK"}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                {regenerating ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {regenerating ? "Regenerating..." : "Regenerate"}
              </Button>
            </div>

            <div>
              <Toaster
                position="top-right"
                richColors
                theme="dark"
                toastOptions={{
                  classNames: {
                    toaster: "toaster group",
                    toast:
                      "bg-[#171717]/95 backdrop-blur-sm text-zinc-50 border border-zinc-800 shadow-lg rounded-xl",
                    title: "text-zinc-50 text-[15px] font-medium",
                    description: "text-zinc-400 text-sm",
                    actionButton: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                    cancelButton: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                    // Colored accent borders for different notification types
                    success: "!border-green-500/40",
                    error: "!border-red-500/40",
                    info: "!border-blue-500/40",
                    warning: "!border-yellow-500/40",
                  },
                  duration: 3500,
                }}
              />
<div className="flex gap-3 flex-wrap">
  <Button
    onClick={handleSaveAll}
    className="bg-orange-600 hover:bg-orange-700 text-[#e6e8e5] font-semibold"
  >
    {savingAll ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Save className="w-4 h-4 mr-2" />
        Save Thread
      </>
    )}
  </Button>
  
  <Button
    onClick={handlePostToTwitter}
    disabled={postingToTwitter}
className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-semibold"
  >
    {postingToTwitter ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Opening...
      </>
    ) : (
      <>
        <Twitter className="w-4 h-4 mr-2" />
        Post to X
      </>
    )}
  </Button>
</div>


            </div>

            {/* Generated Posts */}
            <div className="space-y-4">
              {generatedPost.map((post, index) => (
                <Card
                  key={post.id}
                  className="border-2 bg-[#171717] border-[#222323] shadow-lg hover:border-orange-500/30 transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm text-orange-400 font-medium bg-orange-500/10 px-3 py-1 rounded-full">
                        {postType === "single" ? "Post" : `Post ${index + 1}`}
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            (editingPostId === post.id
                              ? editingContent.length
                              : post.characterCount) > 280
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {editingPostId === post.id
                            ? editingContent.length
                            : post.characterCount}
                          /280
                        </span>
                        {((editingPostId === post.id &&
                          editingContent.length > 280) ||
                          (editingPostId !== post.id &&
                            post.withinLimit === false)) && (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Post Content - Show either editing textarea or display content */}
                    {editingPostId === post.id ? (
                      <div className="mb-6">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          onKeyDown={(e) => handleKeyEdit(e, post.id)}
                          className="w-full min-h-[100px] bg-[#222323] text-[#e6e8ec] border border-[#333333] rounded-lg resize-none focus:ring-2 focus:ring-orange-500/50 text-lg leading-relaxed p-4"
                          placeholder="Edit your post content..."
                        />
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => saveEditPost(post.id)}
                            className="bg-[#ff6900] hover:bg-[#ff8400] text-white"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={cancelEdit}
                            className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333]"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[#e6e8ec] whitespace-pre-wrap text-lg leading-relaxed mb-6 p-4 bg-[#222323] rounded-lg border border-[#333333]">
                        {post.content}
                      </div>
                    )}

                    {/* Action Buttons - Only show when not editing */}
                    {editingPostId !== post.id && (
                      <div className="flex gap-3 flex-wrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(post.content, post.id)}
                          className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333] transition-all duration-200"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedId === post.id ? "Copied!" : "Copy"}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(post.id, post.content)}
                          className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333] transition-all duration-200"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={async () => {
                            await savePost(post.content);
                            setSavedId(post.id);
                            toast.success("Post saved!", {
                              description: "You can find it in your dashboard.",
                            });
                          }}
                          disabled={savedId === post.id}
                          className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333] transition-all duration-200"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {savedId === post.id ? "Saved" : "Save"}
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handlePostSingleToTwitter(post.content)}
                          className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333] transition-all duration-200"
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Post to X
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Another Post */}
            <Card className="border-2 border-dashed border-orange-500/50 bg-transparent hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-200">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400 mb-4 text-lg">
                  Want to create another post?
                </p>
                <Button
                  onClick={handleNewPost}
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200"
                >
                  Create New Post
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
    </div>
  );
};





export default Xpost;