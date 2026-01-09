import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Wallet, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import logoImg from "@assets/image_1767963767146.png";

export default function Login() {
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { login, isPending } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(password, {
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: err.message,
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md flex flex-col items-center text-center space-y-12"
      >
        {/* Logo Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-24 h-24 rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center mx-auto overflow-hidden rotate-3"
          >
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-2">
              Bingx <span className="text-primary">Copy Trade</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Next generation copy trading platform
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="w-full space-y-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0c] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group">
                  {/* Animated Background Glow */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse group-hover:bg-primary/30 transition-all duration-700" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700 group-hover:bg-blue-500/20 transition-all duration-700" />
                  
                  <div className="relative bg-gradient-to-br from-zinc-900/80 via-black/90 to-zinc-900/80 backdrop-blur-2xl rounded-[2.2rem] p-6 sm:p-8 text-white overflow-hidden border border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                          <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-zinc-500 font-black mb-1 text-[10px] uppercase tracking-[0.2em]">Access Your Portfolio</p>
                          <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                            Track your wallet
                          </h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 group-hover:border-primary/50">
                          <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-white/10 p-0 overflow-hidden gap-0 rounded-3xl">
              <div className="p-6 pb-0">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-center">Secure Access</DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6 pt-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter access code"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-14 bg-secondary/50 border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-lg transition-all"
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                  >
                    {isPending ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Confirm Identity"
                    )}
                  </Button>
                </form>
              </div>
              <div className="bg-secondary/30 p-4 text-center">
                <p className="text-xs text-muted-foreground">Protected by enterprise-grade encryption</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </div>
  );
}
