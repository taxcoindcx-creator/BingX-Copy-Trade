import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Info, Smartphone, Moon, Globe, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [isUSD, setIsUSD] = useState(true);

  return (
    <div className="space-y-6 pb-24 pt-4">
      <h1 className="text-2xl font-bold font-display px-2">Settings</h1>

      <div className="space-y-6">
        {/* Preferences */}
        <section className="space-y-3">
          <h2 className="px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preferences</h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="font-medium">Currency</p>
                  <p className="text-xs text-muted-foreground">Display amounts in {isUSD ? "USD" : "INR"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="currency-mode" className="text-xs font-bold text-muted-foreground">
                    {isUSD ? "USD" : "INR"}
                </Label>
                <Switch 
                    id="currency-mode" 
                    checked={isUSD} 
                    onCheckedChange={setIsUSD} 
                />
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Moon size={20} />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Always on</p>
                </div>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>
        </section>

        {/* Legal & About */}
        <section className="space-y-3">
          <h2 className="px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Information</h2>
          <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
            <SettingsLink icon={FileText} label="Privacy Policy" color="text-green-500" bg="bg-green-500/10" />
            <SettingsLink icon={FileText} label="Terms of Service" color="text-green-500" bg="bg-green-500/10" />
            <SettingsLink icon={Info} label="About Bingx Copy Trade" color="text-orange-500" bg="bg-orange-500/10" />
            
            <div className="p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="font-medium">App Version</p>
                  <p className="text-xs text-muted-foreground">v2.4.0 (Build 2024)</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">LATEST</span>
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
    <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon size={20} />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
