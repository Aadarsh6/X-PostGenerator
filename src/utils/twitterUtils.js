export const postToTwitter = (content) => {
  const tweetText = encodeURIComponent(content);
  window.open(
    `https://x.com/intent/tweet?text=${tweetText}`,
    '_blank',
    'width=600,height=400,scrollbars=yes'
  );
};

export const createThreadContent = (posts) => {
  if (posts.length === 1) return posts[0].content;
  const threadPosts = posts
    .map((post, index) => `${index + 1}/${posts.length}\n${post.content}`)
    .join('\n\n🧵\n\n');
  return `🧵 THREAD:\n\n${threadPosts}`;
};