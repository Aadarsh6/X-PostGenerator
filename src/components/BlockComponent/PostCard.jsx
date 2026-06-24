import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Copy, Edit, Check, Save, Twitter, X, AlertCircle } from "lucide-react";

export const PostCard = ({
  post,
  index,
  postType,
  editingPostId,
  editingContent,
  setEditingContent,
  copiedId,
  onCopy,
  onEdit,
  onSave,
  onSaveEdit,
  onCancelEdit,
  onKeyEdit,
  onPostToTwitter,
}) => {
  const isEditing = editingPostId === post.id;
  const charCount = isEditing ? editingContent.length : post.characterCount;
  const overLimit = charCount > 280;

  return (
    <Card className="border-2 bg-[#171717] border-[#222323] shadow-lg hover:border-orange-500/30 transition-all duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm text-orange-400 font-medium bg-orange-500/10 px-3 py-1 rounded-full">
            {postType === "single" ? "Post" : `Post ${index + 1}`}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${overLimit ? "text-red-400" : "text-gray-400"}`}>
              {charCount}/280
            </span>
            {overLimit && <AlertCircle className="h-4 w-4 text-red-400" />}
          </div>
        </div>

        {/* Edit mode */}
        {isEditing ? (
          <div className="mb-6">
            <Textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              onKeyDown={(e) => onKeyEdit(e, post.id)}
              className="w-full min-h-[100px] bg-[#222323] text-[#e6e8ec] border border-[#333333] rounded-lg resize-none focus:ring-2 focus:ring-orange-500/50 text-lg leading-relaxed p-4"
              placeholder="Edit your post content..."
            />
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => onSaveEdit(post.id)} className="bg-[#ff6900] hover:bg-[#ff8400] text-white">
                <Check className="h-4 w-4 mr-2" />Save
              </Button>
              <Button size="sm" variant="secondary" onClick={onCancelEdit} className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333]">
                <X className="h-4 w-4 mr-2" />Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-[#e6e8ec] whitespace-pre-wrap text-lg leading-relaxed mb-6 p-4 bg-[#222323] rounded-lg border border-[#333333]">
            {post.content}
          </div>
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex gap-3 flex-wrap">
            <Button size="sm" variant="secondary" onClick={() => onCopy(post.content, post.id)} className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333]">
              <Copy className="h-4 w-4 mr-2" />
              {copiedId === post.id ? "Copied!" : "Copy"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(post.id, post.content)} className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333]">
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>


                                {/* SINGLE POST SAVE BUTTON */}

            {/* <Button size="sm" onChange={()=>}  variant="secondary" className="bg-[#222323] text-green-400 border border-[#333333]">
              <Check className="h-4 w-4 mr-2" />Saved
            </Button> */}


            <Button size="sm" onClick={() => onPostToTwitter(post.content)} className="bg-[#222323] text-[#e6e8ec] hover:bg-[#333333] border border-[#333333]">
              <Twitter className="h-4 w-4 mr-2" />Post to X
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};