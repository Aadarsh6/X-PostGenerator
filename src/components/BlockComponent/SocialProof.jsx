import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2, BarChart2 } from "lucide-react";

const tweets = [
  {
    id: "1951546352095338699",
    content: "Is there a 'right' way to start a project?\n\nBackend first?\n\nOr frontend first?",
    impressions: "7.5K",
    likes: 30,
    replies: 50,
    retweets: 4,
    date: "Aug 2, 2025",
    featured: true,
  },
  {
    id: "1962082210439365092",
    content: "Does anyone in tech actually have a proper sleep schedule?",
    impressions: "2.2K",
    likes: 16,
    replies: 19,
    retweets: 2,
    date: "Aug 31, 2025",
    featured: false,
  },
  {
    id: "1949029246849958021",
    content: "Idea vs execution.\nWhat is more important?",
    impressions: "1.8K",
    likes: 19,
    replies: 33,
    retweets: 3,
    date: "Jul 26, 2025",
    featured: false,
  },
];

const TweetCard = ({ tweet, featured = false, delay = 0 }) => (
  <motion.a
    href={`https://twitter.com/aadarshmX/status/${tweet.id}`}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`group relative flex flex-col gap-3 bg-[#111111] border border-neutral-800/60 rounded-2xl p-5 hover:border-orange-500/30 transition-all duration-300 overflow-hidden ${featured ? "md:row-span-2" : ""}`}
  >
    {/* Orange accent bar — featured only */}
    {/* {featured && (
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-600" />
    )} */}

    {/* Header */}
    <div className="flex items-center gap-2.5">
        <img
            src="https://pbs.twimg.com/profile_images/2036681672163479552/DDZInte0_400x400.jpg"
            alt="Adarsh"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
/>
      <div>
        <div className="text-white font-medium text-sm leading-none mb-0.5">Adarsh</div>
        <div className="text-neutral-600 text-xs">@aadarshmX</div>
      </div>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-neutral-700 ml-auto" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>

    {/* Content */}
    <p className={`text-neutral-200 leading-relaxed whitespace-pre-line flex-1 ${featured ? "text-base" : "text-sm"}`}>
      {tweet.content}
    </p>

    <p className="text-neutral-700 text-xs">{tweet.date}</p>

    <div className="border-t border-neutral-800/60" />

    {/* Stats */}
    <div className="flex items-center gap-4 text-neutral-600 text-xs">
      <span className="flex items-center gap-1.5">
        <Heart className="w-3.5 h-3.5" />
        {tweet.likes}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5" />
        {tweet.replies}
      </span>
      <span className="flex items-center gap-1.5">
        <Repeat2 className="w-3.5 h-3.5" />
        {tweet.retweets}
      </span>
      <span className="ml-auto flex items-center gap-1.5 text-orange-500 font-medium">
        <BarChart2 className="w-3.5 h-3.5" />
        {tweet.impressions} views
      </span>
    </div>
  </motion.a>
);

export const SocialProof = () => {
  const featured = tweets.find(t => t.featured);
  const secondary = tweets.filter(t => !t.featured);

  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-3">
            Real results
          </p>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Posts that actually performed
          </h2>
          <p className="text-neutral-500 mt-4 max-w-lg mx-auto text-sm">
            Real tweets from a real account, written with this tool.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {featured && <TweetCard tweet={featured} featured delay={0} />}
          {secondary.map((tweet, i) => (
            <TweetCard key={tweet.id} tweet={tweet} delay={i * 0.1 + 0.1} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-neutral-700 text-xs mt-5"
        >
          Click any post to view the original on X
        </motion.p>
      </div>
    </section>
  );
};