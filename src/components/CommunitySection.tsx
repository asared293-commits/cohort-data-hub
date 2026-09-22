import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  Code2,
  Briefcase,
  Newspaper,
  Target,
  Users,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import {
  COMMUNITY_BENEFITS,
  COMMUNITY_TOPICS,
  LINKS,
  LIVE_COMMUNITY_POSTS,
} from '../data/constants';

export const CommunitySection: React.FC = () => {
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    'post-1': 38,
    'post-2': 54,
    'post-3': 42,
  });
  const [hasLiked, setHasLiked] = useState<{ [key: string]: boolean }>({});

  const handleLike = (postId: string) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (hasLiked[postId] ? -1 : 1),
    }));
    setHasLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getBenefitIcon = (id: string) => {
    switch (id) {
      case 'ai':
        return <Bot className="w-6 h-6 text-emerald-400" />;
      case 'security':
        return <ShieldCheck className="w-6 h-6 text-teal-400" />;
      case 'programming':
        return <Code2 className="w-6 h-6 text-sky-400" />;
      case 'jobs':
        return <Briefcase className="w-6 h-6 text-amber-400" />;
      case 'news':
        return <Newspaper className="w-6 h-6 text-purple-400" />;
      case 'opportunities':
        return <Target className="w-6 h-6 text-rose-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="community" className="py-20 md:py-28 bg-[#0c1219] relative overflow-hidden">
      {/* Background Decorative Tech Gradients */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-teal-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-4">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>GHANA'S DIGITAL BUILDER ECOSYSTEM</span>
          </div>

          <h2
            id="community-heading"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3"
          >
            🚀 MORE THAN JUST DATA
          </h2>

          <h3 className="font-display font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-6">
            Connect. Learn. Build. Grow.
          </h3>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Buying data keeps you connected. Joining Cohort Tech helps you make the most of that connection.
          </p>
        </div>

        {/* Community Topics Scrollable / Cloud Tags */}
        <div className="mb-14">
          <div className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">
            WHAT WE TALK ABOUT INSIDE COHORT TECH:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            {COMMUNITY_TOPICS.map((topic, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Large Inspiring Statement */}
        <div className="my-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto">
            <blockquote className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug mb-4">
              "Don't just use the internet.
              <br />
              <span className="text-emerald-400">Use it to learn, build and grow. 🚀"</span>
            </blockquote>
            <p className="text-sm sm:text-base text-slate-300">
              Join hundreds of Ghanaian students, developers, remote freelancers, and tech enthusiasts turning raw bandwidth into career breakthroughs.
            </p>
          </div>
        </div>

        {/* 6 Community Benefits Cards */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-2">
              Community Benefits
            </h3>
            <p className="text-sm text-slate-400">
              High-signal knowledge curated daily to keep your digital edge sharp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_BENEFITS.map((benefit) => (
              <div
                key={benefit.id}
                id={`benefit-card-${benefit.id}`}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 group-hover:bg-emerald-950/60 group-hover:border-emerald-500/40 transition-colors">
                    {getBenefitIcon(benefit.id)}
                  </div>

                  <span className="text-[11px] font-bold font-mono tracking-wider text-emerald-400 uppercase mb-2 block">
                    {benefit.badge}
                  </span>

                  <h4 className="font-display font-bold text-xl text-white mb-2">
                    {benefit.title}
                  </h4>

                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {benefit.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-1.5">
                  {benefit.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Community Activity Feed (Interactive Stories) */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE HIGHLIGHTS</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Voices From The Cohort Community
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Discussions shared daily on Telegram & WhatsApp
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LIVE_COMMUNITY_POSTS.map((post) => {
              const isLiked = hasLiked[post.id];
              return (
                <div
                  key={post.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white leading-tight">
                            {post.author}
                          </div>
                          <div className="text-[11px] text-slate-400">{post.role}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {post.timeAgo}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {post.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                      "{post.content}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        isLiked ? 'text-rose-400 font-semibold' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{likes[post.id]}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments} responses</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400">
                      via {post.platform}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Telegram & WhatsApp Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* Telegram Dedicated Card */}
          <div
            id="telegram-card"
            className="bg-gradient-to-br from-slate-900 via-[#0d1624] to-[#071320] border-2 border-sky-500/30 hover:border-sky-400/60 rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mb-6 text-sky-400 shadow-md shadow-sky-500/20">
                <Users className="w-7 h-7" />
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-3">
                🚀 JOIN OUR TELEGRAM COMMUNITY
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Join the Cohort Tech community for technology discussions, AI, cybersecurity, programming, opportunities, news and useful resources.
              </p>
            </div>

            <a
              href={LINKS.TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-join-telegram"
              className="w-full py-4 px-6 rounded-xl font-display font-extrabold text-sm sm:text-base bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            >
              <span>JOIN TELEGRAM →</span>
            </a>
          </div>

          {/* WhatsApp Dedicated Card */}
          <div
            id="whatsapp-card"
            className="bg-gradient-to-br from-slate-900 via-[#0d1a18] to-[#081a14] border-2 border-emerald-500/30 hover:border-emerald-400/60 rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl transition-all hover:-translate-y-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-6 text-emerald-400 shadow-md shadow-emerald-500/20">
                <MessageCircle className="w-7 h-7" />
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-3">
                📱 FOLLOW COHORT TECH ON WHATSAPP
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Get technology updates, opportunities, AI content, cybersecurity tips, programming resources and other useful updates directly on WhatsApp.
              </p>
            </div>

            <a
              href={LINKS.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-follow-whatsapp"
              className="w-full py-4 px-6 rounded-xl font-display font-extrabold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
            >
              <span>FOLLOW WHATSAPP CHANNEL →</span>
            </a>
          </div>
        </div>

        {/* Community Promotional Message (High Visual CTA) */}
        <div
          id="community-promotional-cta"
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c1a16] via-slate-900 to-[#0e1f26] border border-emerald-500/40 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="font-display font-black text-2xl sm:text-4xl text-white mb-3">
              🚀 JOIN THE COHORT TECH COMMUNITY
            </h3>

            <p className="font-display font-bold text-lg sm:text-xl text-emerald-300 mb-4">
              Don't just buy cheap data — stay connected to opportunities.
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Get tech news, AI tools, cybersecurity updates, programming tips, remote job opportunities, useful resources and exclusive Cohort Tech updates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={LINKS.TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-extrabold text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <Users className="w-4 h-4" />
                <span>JOIN TELEGRAM</span>
              </a>

              <a
                href={LINKS.WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>FOLLOW WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
