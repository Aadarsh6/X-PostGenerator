import { motion } from 'framer-motion'
import { Heart, MessageCircle, Repeat2, BarChart2 } from 'lucide-react'

const tweets = [
  {
    id: '1951546352095338699',
    content: "Is there a 'right' way to start a project?\n\nBackend first?\n\nOr frontend first?",
    impressions: '7.5K',
    likes: 30,
    replies: 50,
    retweets: 4,
    date: 'Aug 2, 2025',
    featured: true,
  },
  {
    id: '1962082210439365092',
    content: 'Does anyone in tech actually have a proper sleep schedule?',
    impressions: '2.2K',
    likes: 16,
    replies: 19,
    retweets: 2,
    date: 'Aug 31, 2025',
    featured: false,
  },
  {
    id: '1949029246849958021',
    content: 'Idea vs execution.\nWhat is more important?',
    impressions: '1.8K',
    likes: 19,
    replies: 33,
    retweets: 3,
    date: 'Jul 26, 2025',
    featured: false,
  },
]

const TweetCard = ({ tweet, featured = false, delay = 0 }) => (
  <motion.a
    href={`https://twitter.com/aadarshmX/status/${tweet.id}`}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`group relative flex flex-col gap-3 rounded-2xl border border-[#1f2020] bg-[#131313] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-500/30 ${
      featured ? 'md:row-span-2' : ''
    }`}
  >
    {/* Header */}
    <div className="flex items-center gap-2.5">
      <img
        src="https://pbs.twimg.com/profile_images/2071521603800985600/0kLXngCU.jpg"
        alt="Adarsh"
        className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
      />
      <div>
        <div className="mb-0.5 text-sm font-medium leading-none text-white">Adarsh</div>
        <div className="text-xs text-neutral-600">@aadarshmX</div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {featured && (
          <span className="rounded-full border border-[#ea580c]/25 bg-[#ea580c]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f97316]">
            Top post
          </span>
        )}
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-neutral-700" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    </div>

    {/* Content */}
    <p
      className={`flex-1 whitespace-pre-line leading-relaxed text-neutral-200 ${
        featured ? 'text-base' : 'text-sm'
      }`}
    >
      {tweet.content}
    </p>

    <p className="text-xs text-neutral-700">{tweet.date}</p>

    <div className="border-t border-[#1c1d1d]" />

    {/* Stats */}
    <div className="flex items-center gap-4 text-xs text-neutral-600">
      <span className="flex items-center gap-1.5">
        <Heart className="h-3.5 w-3.5" />
        {tweet.likes}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageCircle className="h-3.5 w-3.5" />
        {tweet.replies}
      </span>
      <span className="flex items-center gap-1.5">
        <Repeat2 className="h-3.5 w-3.5" />
        {tweet.retweets}
      </span>
      <span className="ml-auto flex items-center gap-1.5 font-medium text-[#f97316]">
        <BarChart2 className="h-3.5 w-3.5" />
        {tweet.impressions} views
      </span>
    </div>
  </motion.a>
)

export const SocialProof = () => {
  const featured = tweets.find((t) => t.featured)
  const secondary = tweets.filter((t) => !t.featured)

  /* Stats computed from the real tweet data above — no invented numbers */
  const totalImpressions = tweets.reduce(
    (sum, t) => sum + parseFloat(t.impressions) * (t.impressions.includes('K') ? 1000 : 1),
    0,
  )
  const totalReplies = tweets.reduce((sum, t) => sum + t.replies, 0)
  const totalLikes = tweets.reduce((sum, t) => sum + t.likes, 0)

  const stats = [
    { value: `${(totalImpressions / 1000).toFixed(1)}K`, label: 'Impressions' },
    { value: totalReplies, label: 'Replies' },
    { value: totalLikes, label: 'Likes' },
  ]

  return (
    <section id="results" className="w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f97316]">
            Real results
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Posts that actually{' '}
            <span className="font-serif-accent text-[1.06em] text-[#f97316]">performed</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-500">
            Real tweets from a real account, written with this tool.
          </p>
        </motion.div>

        {/* Stat strip — sums of the tweets below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 mb-10 flex w-fit divide-x divide-[#1f2020]"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="px-7 text-center sm:px-10">
              <p className="tnum text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          className="mt-5 text-center text-xs text-neutral-700"
        >
          Click any post to view the original on X
        </motion.p>
      </div>
    </section>
  )
}