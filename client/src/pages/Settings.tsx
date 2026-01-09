import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, FileText, Info, Smartphone, Moon, Globe, ChevronRight, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/hooks/use-currency";

export default function Settings() {
  const { currency, setCurrency } = useCurrency();
  const [activeModal, setActiveModal] = useState<"privacy" | "terms" | "about" | null>(null);

  return (
    <div className="space-y-8 pb-24 pt-4 px-2 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-2">
        <h1 className="text-3xl font-bold font-display tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Configure your trading experience</p>
      </div>

      <div className="space-y-8">
        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">General Preferences</h2>
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-xl">
            <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Base Currency</p>
                  <p className="text-xs text-zinc-500">Currently: {currency === "USD" ? "US Dollar ($)" : "Indian Rupee (₹)"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={currency}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md tracking-widest"
                  >
                    {currency}
                  </motion.span>
                </AnimatePresence>
                <Switch 
                    id="currency-mode" 
                    checked={currency === "INR"} 
                    onCheckedChange={(checked) => setCurrency(checked ? "INR" : "USD")} 
                    className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
               <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">Dark Mode</p>
                  <p className="text-xs text-zinc-500">Default high-contrast theme</p>
                </div>
              </div>
              <Switch checked={true} disabled className="data-[state=checked]:bg-primary/50" />
            </div>
          </div>
        </section>

        {/* Information */}
        <section className="space-y-4">
          <h2 className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Legal & Compliance</h2>
          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 shadow-xl">
            <div onClick={() => setActiveModal("privacy")}>
              <SettingsLink icon={FileText} label="Privacy Policy" color="text-zinc-400" bg="bg-zinc-800" />
            </div>
            <div onClick={() => setActiveModal("terms")}>
              <SettingsLink icon={FileText} label="Terms of Service" color="text-zinc-400" bg="bg-zinc-800" />
            </div>
            <div onClick={() => setActiveModal("about")}>
              <SettingsLink icon={Info} label="About BingX Copy Trade" color="text-zinc-400" bg="bg-zinc-800" />
            </div>
            
            <div className="p-5 flex items-center justify-between bg-white/[0.01]">
               <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-800/50 rounded-xl text-zinc-600">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight text-zinc-400">App Version</p>
                  <p className="text-xs text-zinc-600">v2.4.0 (Build 2026.01.09)</p>
                </div>
              </div>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full tracking-tighter">LATEST</span>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-muted-foreground font-medium opacity-50">
          © 2026 BingX Copy Trade Global.<br/>Secure Trading Environment
        </p>
      </div>

      {/* Modals */}
      <LegalModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        type={activeModal} 
      />
    </div>
  );
}

function LegalModal({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: "privacy" | "terms" | "about" | null }) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      body: "We value your privacy above all. BingX Copy Trade employs military-grade encryption to protect your personal data and trading history. We do not sell your data to third parties. Your account information is strictly used for trade synchronization and security verification purposes. By using our platform, you agree to our data collection and protection standards."
    },
    terms: {
      title: "Terms of Service",
      body: "By accessing BingX Copy Trade, you acknowledge the inherent risks associated with cryptocurrency trading. Our copy trading service automates trade execution based on master trader signals. We do not guarantee profits and are not responsible for market losses. Users must maintain sufficient margin in their accounts to cover automated positions."
    },
    about: {
      title: "About BingX Copy Trade",
      body: "BingX Copy Trade is a premier automated trading companion. Our technology bridges the gap between expert market analysts and everyday investors. We provide a seamless, high-performance interface for monitoring your copy trading portfolio in real-time. Our mission is to democratize institutional-grade trading strategies through transparent and secure automation."
    }
  }[type || "privacy"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95%] rounded-[2rem] bg-zinc-950 border-white/5 p-8 backdrop-blur-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black font-display tracking-tight text-white">{content.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="text-zinc-400 text-sm font-medium leading-relaxed space-y-4">
            <p>{content.body}</p>
            <p className="text-zinc-600">Last updated: January 2026</p>
          </div>
        </ScrollArea>
        <Button onClick={onClose} className="w-full mt-6 h-12 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 font-bold">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function SettingsLink({ icon: Icon, label, color, bg }: { icon: any, label: string, color: string, bg: string }) {
  return (
    <button className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
          <Icon size={20} />
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <ChevronRight size={16} className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
