import { useAvatar } from "@/components/BlockComponent/Context/avatarContext";
import { NavBar } from "@/components/BlockComponent/NavBar";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Mail, Bookmark, Settings, LogOut, ChevronRight, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const { initial } = useAvatar();
    const navigate = useNavigate();
    const [stats, setStats] = useState({saved: 0, threads:0, singles:0})
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(()=>{
        api.getPosts().then((data)=>{
            if(data.success){
                const threads = data.threads;
                const totalPost = threads.reduce((sum, t)=>sum+t.length, 0);
                const threadCount = threads.filter(t => t.length>1).length;
                const singlePost = threads.filter(t => t.length === 1).length;
                setStats({
                    saved: totalPost,
                    threads: threadCount,
                    singles: singlePost,
                })
            }
        }).catch(()=>{}).finally(()=> setStatsLoading(false))
    },[])


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Profile
            </h1>
            <p className="mt-3 text-neutral-400 text-base md:text-lg">
              Manage your account, view your activity, and update your details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-[#111111] p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-orange-500/20">
                  {initial}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold text-white truncate">
                    {user?.name || "User"}
                  </h2>
                  <p className="mt-1 text-neutral-400 truncate">
                    {user?.email || "user@email.com"}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-neutral-900 bg-[#0f0f0f] p-4">
                  <div className="text-xs text-neutral-500">Saved Posts</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                          {statsLoading ? (
                            <div className="h-7 w-8 bg-neutral-800 rounded animate-pulse" />
                          ) : stats.saved}
                    </div>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f] p-4">
                  <div className="text-xs text-neutral-500">Threads</div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                          {statsLoading ? (
                            <div className="h-7 w-8 bg-neutral-900 rounded animate-pulse" />
                          ) : stats.threads}
                    </div>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f] p-4">
                  <div className="text-xs text-neutral-500">Posts</div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {statsLoading ? (
                        <div className="h-7 w-8 bg-neutral-900 rounded animate-pulse" />
                      ) : stats.singles}
                    </div>                </div>
                <div className="rounded-2xl border border-neutral-800 bg-[#0f0f0f] p-4">
                  <div className="text-xs text-neutral-500">Status</div>
                  <div className="mt-2 text-2xl font-semibold text-orange-400">Free</div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/save"
                  className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-[#111111] px-4 py-4 hover:border-orange-500/40 hover:bg-[#171717] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Saved Posts</div>
                      <div className="text-sm text-neutral-500">View all your saved content</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-500" />
                </Link>

                <Link
                  to="/soon"
                  className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-[#111111] px-4 py-4 hover:border-orange-500/40 hover:bg-[#171717] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Account Settings</div>
                      <div className="text-sm text-neutral-500">Update profile and preferences</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-500" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>

              <div className="mt-5 space-y-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-[#0f0f0f] border border-neutral-800 hover:border-orange-500/40 transition-colors"
                >
                  <User className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-neutral-300">Go to Dashboard</span>
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-[#0f0f0f] border border-neutral-800 hover:border-orange-500/40 transition-colors"
                >
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-neutral-300">Contact Support</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Logout</span>
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-neutral-800 bg-[#0f0f0f] p-4">
                <div className="text-xs text-neutral-500">Account note</div>
                <p className="mt-2 text-sm text-neutral-400 leading-6">
                  This is your personal space for profile details, saved work, and account actions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}