import { motion } from "framer-motion";
import { Mail, CheckCircle2, Shield, ChevronRight, LogOut, Phone, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Profile() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 pb-24 pt-4"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-blue-400 p-1 shadow-2xl shadow-primary/20">
             <Avatar className="w-full h-full border-4 border-background">
                <AvatarImage src="https://github.com/shadcn.png" /> {/* Placeholder fallback */}
                <AvatarFallback className="bg-secondary text-2xl font-bold">AD</AvatarFallback>
             </Avatar>
          </div>
          <div className="absolute bottom-1 right-1 bg-[var(--success)] text-black rounded-full p-1.5 border-4 border-background">
            <CheckCircle2 size={16} strokeWidth={3} />
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold font-display">Abhisek Das</h1>
          <p className="text-muted-foreground">ID: 89439201</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-xs font-bold mt-3 border border-[var(--success)]/20">
            <Shield size={12} />
            KYC VERIFIED
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Account</h3>
          </div>
          <div className="divide-y divide-white/5">
            <ProfileItem icon={<UserIcon />} label="Personal Information" />
            <ProfileItem icon={<Shield />} label="Security & Login" />
            <ProfileItem icon={<Phone />} label="Two-Factor Authentication" value="Enabled" />
          </div>
        </div>

        <Button 
          onClick={handleContact}
          className="w-full h-14 bg-card hover:bg-secondary text-foreground border border-white/10 rounded-2xl flex items-center justify-between px-6 group transition-all"
        >
          <span className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Mail size={20} />
            </div>
            <span className="font-semibold">Contact Admin</span>
          </span>
          <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </Button>

        <Button 
          onClick={handleLogout}
          variant="destructive"
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 mt-8 font-semibold shadow-lg shadow-red-900/20"
        >
          <LogOut size={20} />
          Sign Out
        </Button>
      </div>
    </motion.div>
  );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {typeof icon === 'function' ? icon({ size: 20 }) : 
           typeof icon === 'object' && 'props' in icon ? icon : 
           <div className="w-5 h-5">{icon}</div>}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-muted-foreground font-medium">{value}</span>}
        <ChevronRight size={16} className="text-muted-foreground/50" />
      </div>
    </div>
  );
}
