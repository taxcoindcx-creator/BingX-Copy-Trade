import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, TrendingUp, TrendingDown, ArrowUpRight, Activity, PieChart, Wallet } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0c] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse group-hover:bg-primary/30 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700 group-hover:bg-blue-500/20 transition-all duration-700" />
          
          <div className="relative bg-gradient-to-br from-zinc-900/80 via-black/90 to-zinc-900/80 backdrop-blur-2xl rounded-[2.2rem] p-8 text-white overflow-hidden border border-white/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-zinc-500 font-black mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                  <Wallet className="w-3.5 h-3.5 text-primary" /> Net Portfolio Balance
                </p>
                <div className="flex items-center gap-4">
                  <AnimatePresence mode="wait">
                    {showBalance ? (
                      <motion.h2 
                        key="balance"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-black font-display tracking-tighter bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent"
                      >
                        ${data.totalValue.toLocaleString()}
                      </motion.h2>
                    ) : (
                      <motion.h2 
                        key="hidden"
                        className="text-5xl font-black font-display tracking-tighter text-zinc-800"
                      >
                        •••••••
                      </motion.h2>
                    )}
                  </AnimatePresence>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowBalance(!showBalance)}
                    className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                  >
                    {showBalance ? <EyeOff size={18} className="text-zinc-400" /> : <Eye size={18} className="text-zinc-400" />}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="px-3 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80] text-[10px] font-black tracking-widest uppercase mb-2">
                  Live
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">USD Account</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4 p-6 bg-white/[0.03] rounded-3xl border border-white/5">
              <div>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1.5">Net PnL (Total)</p>
                <p className="text-2xl font-black text-[#4ade80] flex items-center gap-1.5 tracking-tighter">
                  +${data.netPnL.toLocaleString()} 
                  <span className="text-xs bg-[#4ade80]/20 px-1.5 py-0.5 rounded-md">+{( (data.netPnL/data.initialDeposit)*100 ).toFixed(1)}%</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1.5">All Time Profit</p>
                <p className="text-2xl font-black text-white tracking-tighter">
                  ${data.allTimeProfit.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center px-2">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                 <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial: ${data.initialDeposit}</span>
               </div>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Master Trader</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crypto Prices Grid */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <CryptoPriceCard symbol="BTC" name="Bitcoin" price="96,482.50" change="+2.4%" color="#f7931a" />
        <CryptoPriceCard symbol="ETH" name="Ethereum" price="2,482.15" change="-0.8%" color="#627eea" />
        <CryptoPriceCard symbol="SOL" name="Solana" price="142.85" change="+5.2%" color="#14f195" />
        <CryptoPriceCard symbol="BNB" name="Binance" price="612.40" change="+1.1%" color="#f3ba2f" />
      </div>

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

function CryptoPriceCard({ symbol, name, price, change, color }: { symbol: string, name: string, price: string, change: string, color: string }) {
  const isUp = change.startsWith("+");
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-zinc-900/40 border border-white/5 p-4 rounded-3xl backdrop-blur-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-bl-[2rem] -mr-4 -mt-4 transition-all group-hover:bg-white/[0.05]" />
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: `${color}20`, color }}>
          {symbol[0]}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{symbol}</p>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{name}</p>
        </div>
      </div>
      <p className="text-lg font-black tracking-tighter text-white">${price}</p>
      <div className="flex items-center justify-between mt-1">
        <span className={cn("text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md", isUp ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-red-500/10 text-red-500")}>
          {change}
        </span>
        <div className="w-12 h-6 opacity-30">
           {/* Mini sparkline placeholder */}
           <svg viewBox="0 0 100 40" className="w-full h-full">
             <path 
               d={isUp ? "M0,35 L20,30 L40,32 L60,20 L80,25 L100,5" : "M0,5 L20,15 L40,10 L60,25 L80,22 L100,35"} 
               fill="none" 
               stroke={isUp ? "#4ade80" : "#ef4444"} 
               strokeWidth="6" 
               strokeLinecap="round"
             />
           </svg>
        </div>
      </div>
    </motion.div>
  );
}
