import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowUpRight, Activity, PieChart, Wallet } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const { data: portfolio, isLoading } = usePortfolio();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Fallback data if API returns null (safety for mock requirements)
  const data = portfolio || {
    totalValue: 3708,
    initialDeposit: 500,
    netPnL: 3208,
    allTimeProfit: 3208,
    totalClosedTrades: 8,
    ongoingPositions: 1,
    successRate: 75,
    totalTrades: 8
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-24"
    >
      {/* Header */}
      <motion.div variants={item} className="flex justify-between items-center px-2">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold font-display">Abhisek Das</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-[2px]">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-sm font-bold">
            AD
          </div>
        </div>
      </motion.div>

      {/* Portfolio Card */}
      <motion.div variants={item} className="w-full">
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0c] p-1 shadow-2xl shadow-black/50 border border-white/5">
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          
          <div className="relative bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-md rounded-[22px] p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-zinc-400 font-medium mb-1 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <Wallet className="w-3.5 h-3.5 text-primary" /> Total Portfolio Value
                </p>
                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {showBalance ? (
                      <motion.h2 
                        key="balance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-4xl font-bold font-display tracking-tight text-gradient"
                      >
                        ${data.totalValue.toLocaleString()}
                        <span className="text-lg font-normal text-zinc-500 ml-1">USD</span>
                      </motion.h2>
                    ) : (
                      <motion.h2 
                        key="hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-4xl font-bold font-display tracking-tight text-zinc-700"
                      >
                        •••••••
                      </motion.h2>
                    )}
                  </AnimatePresence>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors"
                  >
                    {showBalance ? <Eye size={18} className="text-zinc-500" /> : <EyeOff size={18} className="text-zinc-500" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
              <div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Net PnL</p>
                <p className="text-xl font-bold text-[#4ade80] flex items-center gap-1">
                  +${data.netPnL.toLocaleString()} <ArrowUpRight className="w-4 h-4" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">All Time Profit</p>
                <p className="text-xl font-bold text-white">
                  ${data.allTimeProfit.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
               <span>Initial Deposit: ${data.initialDeposit}</span>
               <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Verified</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label="Total Closed Trades" 
          value={data.totalClosedTrades} 
          icon={<PieChart className="w-5 h-5" />}
          delay={0.2}
          subValue="Trades Completed"
          trend="neutral"
        />
        <StatCard 
          label="Ongoing Positions" 
          value={data.ongoingPositions} 
          icon={<Activity className="w-5 h-5 text-amber-500" />} 
          delay={0.3}
          subValue="Active Now"
          className="border-amber-500/20"
        />
        <StatCard 
          label="Success Rate" 
          value={`${data.successRate}%`} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          delay={0.4}
          subValue="Win Ratio"
          trend="up"
          className="border-emerald-500/20 col-span-2"
        />
      </div>

      <motion.div variants={item} className="p-4 rounded-2xl glass-card border-l-4 border-l-primary">
        <h3 className="text-sm font-semibold mb-1">Copy Trading Status</h3>
        <p className="text-xs text-muted-foreground">Your account is active and syncing trades automatically.</p>
      </motion.div>
    </motion.div>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center px-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-secondary" />
          <Skeleton className="h-8 w-40 bg-secondary" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full bg-secondary" />
      </div>
      <Skeleton className="h-64 w-full rounded-3xl bg-secondary" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32 bg-secondary rounded-2xl" />
        <Skeleton className="h-32 bg-secondary rounded-2xl" />
        <Skeleton className="h-32 bg-secondary rounded-2xl col-span-2" />
      </div>
    </div>
  );
}
