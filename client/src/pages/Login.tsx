import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Wallet, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
            className="w-24 h-24 bg-gradient-to-tr from-primary to-blue-400 rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center mx-auto rotate-3"
          >
            <ShieldCheck className="w-12 h-12 text-white" strokeWidth={1.5} />
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
              <Button 
                size="lg"
                className="w-full h-16 text-lg font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 group bg-primary hover:bg-primary/90"
              >
                <Wallet className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                Track your wallet
                <ChevronRight className="ml-auto w-5 h-5 opacity-70" />
              </Button>
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
