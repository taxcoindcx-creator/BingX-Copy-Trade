import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Shield, ChevronRight, LogOut, Phone, User as UserIcon, Calendar, Globe, CreditCard, History as HistoryIcon, MapPin, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@shared/routes";

interface SecurityLog {
  id: number;
  date: string;
  action: string;
  device: string;
  ip: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [activeDialog, setActiveDialog] = useState<"personal" | "security" | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const handleContact = () => {
    toast({
      title: "Request Sent",
      description: "Our team will email you shortly.",
      duration: 4000,
    });
  };

  const handleLogout = () => {
    setLocation("/");
  };

  const fetchSecurityLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await fetch(api.security.logs.path);
      if (response.ok) {
        const logs = await response.json();
        setSecurityLogs(logs);
      }
    } catch (error) {
      console.error("Failed to fetch security logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeDialog === "security") {
      fetchSecurityLogs();
      // Refresh logs every 5 seconds when dialog is open
      const interval = setInterval(fetchSecurityLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [activeDialog]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-24 pt-4 px-2"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-0.5 shadow-2xl shadow-primary/20">
             <Avatar className="w-full h-full border-[6px] border-background">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abhisek" />
                <AvatarFallback className="bg-zinc-900 text-2xl font-bold">AD</AvatarFallback>
             </Avatar>
          </div>
          <div className="absolute bottom-1 right-1 bg-[#4ade80] text-black rounded-full p-1.5 border-4 border-background">
            <CheckCircle2 size={16} strokeWidth={3} />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Abhisek Das</h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">Trader ID: 89439201</p>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-black mt-4 border border-[#4ade80]/20 tracking-widest uppercase">
            <Shield size={12} strokeWidth={3} />
            KYC VERIFIED
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-5 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-bold text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Account Management</h3>
          </div>
          <div className="divide-y divide-white/5">
            <div onClick={() => setActiveDialog("personal")}>
              <ProfileItem icon={<UserIcon />} label="Personal Information" />
            </div>
            <div onClick={() => setActiveDialog("security")}>
              <ProfileItem icon={<Shield />} label="Security & Login" />
            </div>
            <ProfileItem icon={<Phone />} label="Two-Factor Authentication" value="Enabled" />
          </div>
        </div>

        <Button 
          onClick={handleContact}
          className="w-full h-16 bg-zinc-900/40 hover:bg-zinc-800/60 text-foreground border border-white/5 rounded-3xl flex items-center justify-between px-6 group transition-all backdrop-blur-sm shadow-xl"
        >
          <span className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Mail size={20} />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-300">Contact Admin</span>
          </span>
          <ChevronRight className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
        </Button>

        <Button 
          onClick={handleLogout}
          variant="ghost"
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 mt-8 font-bold text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </Button>
      </div>

      {/* Dialogs */}
      <Dialog open={activeDialog === "personal"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md w-[95%] rounded-[2rem] bg-zinc-950 border-white/5 p-6 backdrop-blur-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black font-display tracking-tight text-white">Personal Information</DialogTitle>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Non-editable verified profile</p>
          </DialogHeader>
          <div className="space-y-4">
            <InfoRow icon={<UserIcon size={16} />} label="Full Name" value="Abhisek Das" />
            <InfoRow icon={<Calendar size={16} />} label="Date of Birth" value="****" />
            <InfoRow icon={<Globe size={16} />} label="Country" value="India (IN)" />
            <InfoRow icon={<CreditCard size={16} />} label="Identity Document" value="Aadhar Card (Verified)" />
            <InfoRow icon={<Shield size={16} />} label="Tax ID / PAN" value="****" />
          </div>
          <p className="mt-8 text-[10px] text-zinc-600 font-bold text-center uppercase tracking-[0.2em] leading-relaxed">
            All personal information is secured and cannot be modified after KYC verification.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "security"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md w-[95%] rounded-[2rem] bg-zinc-950 border-white/5 p-6 backdrop-blur-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black font-display tracking-tight text-white">Security Logs</DialogTitle>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Recent Account Activities</p>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loadingLogs && securityLogs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">Loading logs...</div>
            ) : securityLogs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">No security logs yet</div>
            ) : (
              securityLogs.map((log) => (
                <LogEntry 
                  key={log.id}
                  date={formatLogDate(log.date)} 
                  action={log.action} 
                  device={`${log.device} • IP: ${log.ip}`} 
                />
              ))
            )}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-primary">
            View All Logs
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
      <div className="flex items-center gap-3">
        <div className="text-zinc-600">{icon}</div>
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-bold text-zinc-200">{value}</span>
    </div>
  );
}

function formatLogDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function LogEntry({ date, action, device }: { date: string, action: string, device: string }) {
  return (
    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex gap-4">
      <div className="p-2 h-fit bg-primary/10 rounded-xl text-primary">
        <Key size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{date}</p>
        <p className="text-sm font-bold text-zinc-200">{action}</p>
        <p className="text-xs text-zinc-500 mt-0.5 break-words">{device}</p>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-white/[0.03] transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="text-zinc-500 group-hover:text-primary transition-colors">
          {typeof icon === 'function' ? icon({ size: 20 }) : 
           typeof icon === 'object' && 'props' in icon ? icon : 
           <div className="w-5 h-5">{icon}</div>}
        </div>
        <span className="font-bold text-sm tracking-tight text-zinc-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-tighter">{value}</span>}
        <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-all group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}
