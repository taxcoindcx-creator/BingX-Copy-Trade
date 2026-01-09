import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format as formatDate } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Calendar, Search, Filter, Download } from "lucide-react";
import { useTrades } from "@/hooks/use-trades";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";

export default function History() {
  const { data: trades, isLoading } = useTrades();
  const [filter, setFilter] = useState<"all" | "profit" | "loss" | "deposit">("all");
  const { toast } = useToast();
  const { format } = useCurrency();

  if (isLoading) return <HistorySkeleton />;

  const filteredTrades = trades?.filter(t => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your trade history is being prepared for download.",
    });
  };

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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExport}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
          >
            <Download size={14} className="mr-1" /> Export
          </Button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(["all", "profit", "loss", "deposit"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border shrink-0",
                filter === type 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10"
              )}
            >
              {type}
            </button>
          ))}
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
        <AnimatePresence mode="popLayout">
          {filteredTrades?.map((trade) => {
            const isProfit = trade.type === 'profit';
            const isDeposit = trade.type === 'deposit';
            const isLoss = trade.type === 'loss';
            
            let amountColor = "text-foreground";
            if (isProfit) amountColor = "text-[#4ade80]";
            if (isLoss) amountColor = "text-red-500";
            if (isDeposit) amountColor = "text-primary";

            const amountPrefix = isProfit || isDeposit ? "+" : "";

            return (
              <motion.div 
                key={trade.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-zinc-800/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isProfit ? "bg-[#4ade80]/10 text-[#4ade80]" :
                    isLoss ? "bg-red-500/10 text-red-500" :
                    "bg-primary/10 text-primary"
                  )}>
                    {isProfit ? <ArrowUpRight className="w-6 h-6" /> :
                     isLoss ? <ArrowDownLeft className="w-6 h-6" /> :
                     <Calendar className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground tracking-tight">
                      {isDeposit ? "Deposit" : isProfit ? "Profit" : "Loss"}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                      {formatDate(new Date(trade.date), "dd MMM yyyy • HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-lg font-black tracking-tighter", amountColor)}>
                    {amountPrefix}{format(Math.abs(Number(trade.amount)))}
                  </p>
                  <p className="text-[9px] uppercase font-black text-zinc-600 tracking-[0.2em]">
                    USD
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!filteredTrades?.length && (
            <div className="text-center py-20 text-zinc-600 font-medium text-sm">
                No transactions found for this filter.
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
