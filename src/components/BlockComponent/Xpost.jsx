import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Loader2, RefreshCw, AlertCircle, Save, Twitter } from "lucide-react";
import { toast, Toaster } from "sonner";
import { BorderBeam } from "../magicui/border-beam";
import { useAvatar } from "./Context/avatarContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { postToTwitter, createThreadContent } from "@/utils/twitterUtils";
import { PostCard } from "./PostCard";

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
  { value: "educational", label: "Educational" },
  { value: "controversial", label: "Controversial" },
  { value: "casual", label: "Casual" },
  { value: "inspirational", label: "Inspirational" },
];

const POST_TYPES = [
  { value: "single", label: "Single Post" },
  { value: "thread", label: "Thread (2-5 posts)" },
  { value: "long-thread", label: "Long Thread (6-10 posts)" },
];

export const Xpost = () => {
  const [prompt, setPrompt] = useState("");
  const [postType, setPostType] = useState("single");
  const [tone, setTone] = useState("educational");
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState([]);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [postingToTwitter, setPostingToTwitter] = useState(false);
  const [savedThreadId, setSavedThreadId] = useState(null)
  const [saving, setSaving] = useState(false);

  const textareaRef = useRef(null);
  const resultsRef = useRef(null);
  const { initial } = useAvatar();
  const navigate = useNavigate();

  useEffect(() => {
    api.checkHealth().then(setBackendStatus);
  }, []);

  const generateXpost = async (isRegenerate = false) => {
    setGenerating(true);
    if (isRegenerate) setRegenerating(true);
    setSavedThreadId(null);
    setError("");
    try {
      const response = await api.generatePost(prompt.trim(), tone, postType);
      if (response.success && response.posts) {
        setGeneratedPost(response.posts.map((post, index) => ({
          id: post.id || `temp-${index}-${Date.now()}`,
          content: post.content,
          characterCount: post.characterCount,
          withinLimit: post.withinLimit,
          threadId: post.threadId,
          postNumber: post.postNumber,
        })));
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else {
        throw new Error(response.error || "Failed to generate post");
      }
    } catch (err) {
      setError(err.message || "Failed to generate post. Please check your connection.");
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
    } catch {
      setError("Failed to copy text to clipboard");
    }
  };

  const handleNewPost = () => {
    setPrompt(""); setGeneratedPost([]); setError("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleEdit = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditingContent(currentContent);
  };

  const saveEditPost = (postId) => {
    const trimmed = editingContent.trim();
    if (!trimmed) { setError("Post content cannot be empty"); return; }
    setGeneratedPost((prev) => prev.map((post) =>
      post.id === postId
        ? { ...post, content: trimmed, characterCount: trimmed.length, withinLimit: trimmed.length <= 280 }
        : post
    ));
    setEditingPostId(null);
    setEditingContent("");
    setError("");
  };

  const cancelEdit = () => { setEditingPostId(null); setEditingContent(""); };

  const handleKeyEdit = (e, postId) => {
    if (e.key === "Enter" && e.ctrlKey) { e.preventDefault(); saveEditPost(postId); }
    else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
  };

  const handlePostToTwitter = async () => {
    setPostingToTwitter(true);
    try {
      const content = postType === "single" ? generatedPost[0].content : createThreadContent(generatedPost);
      postToTwitter(content);
      toast.success("Opening Twitter!", { description: "Twitter compose window opened." });
    } catch {
      toast.error("Failed to open Twitter. Please try again.");
    } finally {
      setPostingToTwitter(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-4xl px-4 py-8">

        {backendStatus && (
          <div className="flex justify-center mb-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              backendStatus.status === "OK"
                ? "bg-green-900/20 border border-green-500 text-green-400"
                : "bg-red-900/20 border border-red-500/50 text-red-400"
            }`}>
              <div className={`w-2 h-2 rounded-full ${backendStatus.status === "OK" ? "bg-green-400" : "bg-red-400"}`} />
              Backend: {backendStatus.status === "OK" ? "Connected" : "Disconnected"}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <Card className="w-full border-2 bg-gradient-to-b from-[#1f1f1f] via-[#171717] to-[#0f0f0f] border-[#222323] shadow-2xl relative overflow-hidden">
              <BorderBeam duration={8} borderWidth={3} size={500} className="from-transparent via-[#f97316] to-transparent" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center">
                  <div className="flex items-end space-x-2">
                    <div className="text-orange-500"><h1 className="text-3xl font-bold">Xc</h1></div>
                    <div className="text-xl font-semibold text-[#e6e8ec]">Generate Post</div>
                  </div>
                </div>
              </CardHeader>

              <div className="h-0.5 mx-6 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 shadow-md" />

              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-10 h-10 flex-shrink-0">
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
  {initial}
</div>                  </div>
                  <div className="text-[#e6e8ec] font-medium text-lg">What post do you want to create?</div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                <div className="mb-6">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Enter your topic or idea..."
                    className="w-full h-32 border-none outline-none bg-[#222323] rounded-2xl text-lg text-[#e6e8ec] placeholder:text-lg placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 p-4"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-[#e6e8ec] font-medium mb-2 text-sm">Post Type</label>
                    <Select value={postType} onValueChange={setPostType}>
                      <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-orange-500/50">
                        <SelectValue placeholder="Select Post Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222323] text-white font-medium border-2 border-[#333333]">
                        {POST_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="hover:bg-[#ff7d00]/60 focus:bg-[#ea580c]/60">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#e6e8ec] font-medium mb-2 text-sm">Post Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="w-full border-none text-white bg-[#222323] hover:bg-[#2a2a2a] focus:ring-2 focus:ring-orange-500/50">
                        <SelectValue placeholder="Select Tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222323] text-white font-medium border-2 border-[#333333]">
                        {TONES.map((t) => (
                          <SelectItem key={t.value} value={t.value} className="hover:bg-[#ff7d00]/60 focus:bg-[#ea580c]/60">
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-6 text-right">
                  <span className="text-sm text-gray-400">{prompt.length} characters</span>
                </div>

                <Button
                  onClick={() => generateXpost(false)}
                  disabled={!prompt.trim() || generating || backendStatus?.status !== "OK"}
                  className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
                    !prompt.trim() || generating || backendStatus?.status !== "OK"
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700 active:bg-orange-800"
                  }`}
                >
                  {generating ? <><Loader2 className="animate-spin mr-2 h-5 w-5" />Generating...</>
                    : backendStatus?.status !== "OK" ? "Backend Unavailable" : "Generate Post"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {generatedPost.length > 0 && (
          <div ref={resultsRef} className="w-full max-w-3xl mx-auto space-y-6">
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
                {regenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                {regenerating ? "Regenerating..." : "Regenerate"}
              </Button>
            </div>

<Toaster
  position="bottom-right"
  richColors
  theme="dark"
  toastOptions={{
    classNames: {
      toast:
        "bg-[#111111]/95 backdrop-blur-md text-zinc-100 border border-[#262626] shadow-[0_10px_30px_rgba(0,0,0,0.45)] rounded-2xl",
      title: "text-zinc-100 text-[15px] font-medium",
      description: "text-zinc-400 text-sm",
      success: "!border-orange-500/35 !text-orange-100",
      error: "!border-red-500/30 !text-red-100",
      actionButton:
        "bg-[#f97316] text-white hover:bg-[#ea580c] rounded-lg",
      cancelButton:
        "bg-[#1a1a1a] text-zinc-300 hover:bg-[#252525] rounded-lg",
    },
    duration: 3500,
  }}
/>

      <div className="flex gap-3 flex-wrap items-center">
  <Button
    onClick={async () => {
      try {
        setSaving(true)
        await api.saveThread(generatedPost, postType, tone);
        setSavedThreadId(true);
        toast.success("Thread saved!", { description: "Find it in your saved posts." });
      } catch (err) {
        console.log(err);
        toast.error("Failed to save. Please try again.");
      }finally{
        setSaving(false)
      }
    }}
    disabled={!!savedThreadId}
    className="bg-orange-600 hover:bg-orange-700 text-[#e6e8e5] font-semibold disabled:opacity-50"
  >

    
    {saving ? ( 
      <>
      <Loader2 className="animate-spin"/>
      Saving...
    </>) : (
      <>
      <Save className="w-4 h-4 mr-2" />
      {savedThreadId? "Saved ✓" : "Save Thread"}
      </>
    )}

  </Button>

  {savedThreadId && (
    <button
      onClick={() => navigate("/save")}
      className="text-sm text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors"
    >
      View saved posts →
    </button>
  )}

  <Button onClick={handlePostToTwitter} disabled={postingToTwitter} className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-semibold">
    {postingToTwitter ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening...</> : <><Twitter className="w-4 h-4 mr-2" />Post to X</>}
  </Button>
</div>

            <div className="space-y-4">
              {generatedPost.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  postType={postType}
                  editingPostId={editingPostId}
                  editingContent={editingContent}
                  setEditingContent={setEditingContent}
                  copiedId={copiedId}
                  onCopy={copyToClipboard}
                  onEdit={handleEdit}
                  onSaveEdit={saveEditPost}
                  onSave={savedThreadId}
                  onCancelEdit={cancelEdit}
                  onKeyEdit={handleKeyEdit}
                  onPostToTwitter={(content) => {
                    postToTwitter(content);
                    toast.success("Opening Twitter!", { description: "Twitter compose window opened." });
                  }}
                />
              ))}
            </div>

            <Card className="border-2 border-dashed border-orange-500/50 bg-transparent hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-200">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400 mb-4 text-lg">Want to create another post?</p>
                <Button onClick={handleNewPost} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
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