// Improved Twitter posting functions
export const postToTwitter = (content) => {
  const tweetText = encodeURIComponent(content);
  const twitterUrl = `https://x.com/intent/tweet?text=${tweetText}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

// New approach: Create a single composed thread with proper numbering
export const postThreadToTwitter = (posts) => {
  if (posts.length === 1) {
    // Single post
    postToTwitter(posts[0].content);
    return;
  }

  // For threads, create a single comprehensive post with all content
  // This is the most reliable way to handle threads via web intent
  const threadContent = posts
    .map((post, index) => {
      const postNumber = `${index + 1}/${posts.length}`;
      return `${postNumber}\n${post.content}`;
    })
    .join('\n\n---\n\n');

  // Add thread indicator at the beginning
  const fullThreadContent = `🧵 THREAD:\n\n${threadContent}`;
  
  postToTwitter(fullThreadContent);
};

// Alternative approach: Sequential posting with user confirmation
export const postThreadToTwitterSequentially = async (posts) => {
  if (posts.length === 1) {
    postToTwitter(posts[0].content);
    return;
  }

  // Show user a confirmation dialog first
  const userConfirmed = confirm(
    `This will open ${posts.length} Twitter compose windows sequentially. ` +
    `Each post will be numbered for easy threading. Continue?`
  );
  
  if (!userConfirmed) return;

  // Post first tweet with thread indicator
  const firstPost = posts[0];
  const firstContent = `${firstPost.content}\n\n🧵 1/${posts.length}`;
  
  postToTwitter(firstContent);

  // Post remaining tweets with delays and proper numbering
  for (let i = 1; i < posts.length; i++) {
    setTimeout(() => {
      const post = posts[i];
      const threadNumber = `${i + 1}/${posts.length}`;
      const content = `${post.content}\n\n${threadNumber}`;
      postToTwitter(content);
    }, i * 2000); // 2 second delay between each
  }
};


// New function: Copy entire thread to clipboard for manual posting
export const copyThreadToClipboard = async (posts) => {
  const threadContent = posts
    .map((post, index) => {
      const postNumber = posts.length > 1 ? `${index + 1}/${posts.length}` : '';
      return postNumber ? `${post.content}\n\n${postNumber}` : post.content;
    })
    .join('\n\n---\n\n');

  try {
    await navigator.clipboard.writeText(threadContent);
    return true;
  } catch (err) {
    console.error('Failed to copy thread:', err);
    return false;
  }
};

// New function: Create downloadable text file of thread
export const downloadThreadAsText = (posts) => {
  const threadContent = posts
    .map((post, index) => {
      const postNumber = posts.length > 1 ? `Post ${index + 1}/${posts.length}` : 'Post';
      return `${postNumber}:\n${post.content}\n`;
    })
    .join('\n---\n\n');

  const blob = new Blob([threadContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `twitter-thread-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};