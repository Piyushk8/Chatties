import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { CLIENT_URL } from "@/constant/config";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {motion} from "framer-motion"
const InviteLinkCopy = ({ groupId }) => {
    console.log(groupId)
  const inviteLink =  `${CLIENT_URL}/?invite=true&groupId=${groupId}`
          ;
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  return (
    <div className="flex items-center gap-3 bg-muted shadow-md p-1 rounded-xl border border-border  w-full max-w-lg mx-auto">
      <Input 
        value={inviteLink} 
        readOnly 
        className="flex-1 text-card-foreground bg-card border-none focus:ring-0"
      />
      <Button 
        onClick={copyToClipboard} 
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {copied ? <Check className="w-5 h-5 text-white" /> : <ClipboardCopy className="w-5 h-5" />}
        {copied ? (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute top-[-30px] text-xs bg-black text-white px-2 py-1 rounded-lg"
          >
            Copied!
          </motion.span>
        ) : "Copy"}
      </Button>
    </div>
  );
};
export default  InviteLinkCopy