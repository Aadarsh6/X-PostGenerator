import { motion } from "framer-motion";

const tweets = [
  {
    id: 1,
    content: "Is there a 'right' way to start a project?\n\nBackend first?\n\nOr frontend first?",
    impressions: "7.5K",
    likes: 29,
    replies: 50,
    retweets: 4,
    date: "Aug 2, 2025",
    featured: true,
  },
  {
    id: 2,
    content: "Does anyone in tech actually have a proper sleep schedule?",
    impressions: "2.2K",
    likes: 16,
    replies: 19,
    retweets: 2,
    date: "Aug 31, 2025",
    featured: false,
  },
  {
    id: 3,
    content: "Add your third best tweet here. Replace this with real content.",
    impressions: "1.4K",
    likes: 12,
    replies: 8,
    retweets: 1,
    date: "Sep 5, 2025",
    featured: false,
  },
];

const TweetCard = ({ tweet, featured = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-[#111111] border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-orange-500/30 transition-all duration-300 ${featured ? "h-full" : ""}`}
  >
    {/* Header */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        A
      </div>
      <div>
        <div className="text-white font-semibold text-sm">Adarsh</div>
        <div className="text-neutral-500 text-xs">@adarshx_23</div>
      </div>
      <div className="ml-auto">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-neutral-600" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    </div>

    {/* Content */}
    <p className={`text-neutral-200 leading-relaxed whitespace-pre-line ${featured ? "text-lg" : "text-sm"}`}>
      {tweet.content}
    </p>

    {/* Date */}
    <div className="text-neutral-600 text-xs">{tweet.date}</div>

    {/* Divider */}
    <div className="border-t border-neutral-800" />

    {/* Stats */}
    <div className="flex items-center gap-5 text-neutral-500 text-xs">
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-neutral-500" aria-hidden="true">
          <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 7.501 3.58 7.501 8 0 4.41-3.01 8-7.5 8h-4.373C5.315 18 1.751 14.42 1.751 10zm8.005-6a6 6 0 0 0 0 12h4.366c3.383 0 5.5-2.681 5.5-6s-2.117-6-5.5-6z"/>
        </svg>
        {tweet.replies}
      </span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-neutral-500" aria-hidden="true">
          <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
        </svg>
        {tweet.retweets}
      </span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-neutral-500" aria-hidden="true">
          <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
        </svg>
        {tweet.likes}
      </span>
      <span className="ml-auto flex items-center gap-1.5 text-orange-400 font-semibold">
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-orange-400" aria-hidden="true">
          <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/>
        </svg>
        {tweet.impressions} views
      </span>
    </div>
  </motion.div>
);

export const SocialProof = () => {
  const featured = tweets.find(t => t.featured);
  const secondary = tweets.filter(t => !t.featured);

  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Real results
          </p>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Posts that actually performed
          </h2>
          <p className="text-neutral-400 mt-4 max-w-xl mx-auto">
            Not mock-ups. Real tweets from a real account, written with this tool.
          </p>
        </motion.div>

        {/* Tweet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Featured tweet — left, full height */}
          {featured && (
            <div className="md:row-span-2">
              <TweetCard tweet={featured} featured />
            </div>
          )}

          {/* Secondary tweets — right, stacked */}
          {secondary.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </div>
    </section>
  );
};