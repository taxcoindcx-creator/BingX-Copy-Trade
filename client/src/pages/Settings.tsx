import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Info, Smartphone, Moon, Globe, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [isUSD, setIsUSD] = useState(true);

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
                  <p className="text-xs text-zinc-500">Amounts shown in {isUSD ? "US Dollar" : "Indian Rupee"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-zinc-600 bg-zinc-800/50 px-2 py-1 rounded-md">
                    {isUSD ? "USD" : "INR"}
                </span>
                <Switch 
                    id="currency-mode" 
                    checked={isUSD} 
                    onCheckedChange={setIsUSD} 
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
                  <p className="text-xs text-zinc-500">Optimized for low light</p>
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
            <SettingsLink icon={FileText} label="Privacy Policy" color="text-zinc-400" bg="bg-zinc-800" />
            <SettingsLink icon={FileText} label="Terms of Service" color="text-zinc-400" bg="bg-zinc-800" />
            <SettingsLink icon={Info} label="About Bingx Copy Trade" color="text-zinc-400" bg="bg-zinc-800" />
            
            <div className="p-5 flex items-center justify-between bg-white/[0.01]">
               <div className="flex items-center gap-4">
                <div className="p-2.5 bg-zinc-800/50 rounded-xl text-zinc-600">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight">App Version</p>
                  <p className="text-xs text-zinc-600">v2.4.0 (Build 2024.01.09)</p>
                </div>
              </div>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full tracking-tighter">LATEST</span>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-muted-foreground">
          © 2026 Bingx Copy Trade Inc.<br/>All rights reserved.
        </p>
      </div>
    </div>
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
