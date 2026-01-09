import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Calendar, Search } from "lucide-react";
import { useTrades } from "@/hooks/use-trades";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function History() {
  const { data: trades, isLoading } = useTrades();

  if (isLoading) return <HistorySkeleton />;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6 pb-24 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sticky top-0 bg-background/95 backdrop-blur-xl z-20 py-4 -mx-4 px-4 border-b border-white/5"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display tracking-tight">Trade History</h1>
          <div className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-widest">
            {trades?.length || 0} Trades
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search trades..." 
            className="pl-10 h-11 bg-zinc-900/50 border-white/5 focus:border-primary/50 focus:ring-0 transition-all rounded-xl"
          />
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3 mt-4"
      >
        {trades?.map((trade) => {
          const isProfit = trade.type === 'profit';
          const isDeposit = trade.type === 'deposit';
          const isLoss = trade.type === 'loss';
          
          let amountColor = "text-foreground";
          if (isProfit) amountColor = "text-[var(--success)]";
          if (isLoss) amountColor = "text-destructive";
          if (isDeposit) amountColor = "text-primary";

          const amountPrefix = isProfit || isDeposit ? "+" : "";

          return (
            <motion.div 
              key={trade.id}
              variants={item}
              className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-card/90 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  isProfit ? "bg-[var(--success)]/10 text-[var(--success)]" :
                  isLoss ? "bg-destructive/10 text-destructive" :
                  "bg-primary/10 text-primary"
                )}>
                  {isProfit ? <ArrowUpRight className="w-6 h-6" /> :
                   isLoss ? <ArrowDownLeft className="w-6 h-6" /> :
                   <Calendar className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isDeposit ? "Initial Deposit" : isProfit ? "Trade Profit" : "Trade Loss"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(trade.date), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-lg font-bold tracking-tight", amountColor)}>
                  {amountPrefix}${Math.abs(Number(trade.amount))}
                </p>
                <p className="text-[10px] uppercase font-medium text-muted-foreground/60 tracking-wider">
                  USD
                </p>
              </div>
            </motion.div>
          );
        })}

        {!trades?.length && (
            <div className="text-center py-20 text-muted-foreground">
                No trades found.
            </div>
        )}
      </motion.div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center px-2">
        <Skeleton className="h-8 w-40 bg-secondary" />
        <Skeleton className="h-6 w-20 bg-secondary rounded-full" />
      </div>
      <Skeleton className="h-12 w-full bg-secondary rounded-xl" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full bg-secondary rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
