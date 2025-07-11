import { Twitter, Copy, FileText, X } from 'lucide-react';

const Xthread = ({ isOpen, onClose, onPost, postCount }) => {
  if (!isOpen) return null;

  const handleOptionClick = (option) => {
    onPost(option);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#171717] border-2 border-[#333] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-orange-500">Post Thread to X</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Choose how you want to post your {postCount}-post thread:
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => handleOptionClick('composed')}
            className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Single Composed Thread</div>
              <div className="text-sm text-blue-100">Recommended: All posts in one window</div>
            </div>
          </button>
          
          <button
            onClick={() => handleOptionClick('sequential')}
            className="w-full flex items-center gap-3 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-white"
          >
            <Twitter className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Sequential Posts</div>
              <div className="text-sm text-orange-100">Opens {postCount} separate windows</div>
            </div>
          </button>
          
          <button
            onClick={() => handleOptionClick('copy')}
            className="w-full flex items-center gap-3 p-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-white"
          >
            <Copy className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Copy to Clipboard</div>
              <div className="text-sm text-gray-100">Copy formatted thread text</div>
            </div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 p-3 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Xthread;