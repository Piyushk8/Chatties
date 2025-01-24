import React, { useState } from 'react';
import { 
  Info, 
  Image, 
  Bell, 
  Lock, 
  Star, 
  Search, 
  X 
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ChatDetailsSidebar = ({ chat, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
    console.log(chat)
  const renderInfoTab = () => (
    <div className="space-y-4 p-4">
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={chat.image?.url} alt={chat?.name||""} />
          {/* <AvatarFallback>{chat?.members[0]?.name[0]}</AvatarFallback> */}
        </Avatar>
        {/* <h2 className="text-xl font-semibold">{chat.name}</h2> */}
        {/* <p className="text-muted-foreground">{chat.participants.length} members</p> */}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Info className="text-muted-foreground" />
          <p>{chat?.description || 'No description'}</p>
        </div>
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2">
        {/* {chat.media.map((mediaItem, index) => (
          <img 
            key={index} 
            src={mediaItem} 
            alt={`Media ${index + 1}`} 
            className="w-full h-24 object-cover rounded"
          />
        ))} */}
        media goes here
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg">
        <div className="flex items-center space-x-3">
          <Bell className="text-muted-foreground" />
          <span>Mute Notifications</span>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg">
        <div className="flex items-center space-x-3">
          <Lock className="text-muted-foreground" />
          <span>Disappearing Messages</span>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
      <div className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg">
        <div className="flex items-center space-x-3">
          <Star className="text-muted-foreground" />
          <span>Pin Chat</span>
        </div>
        <input type="checkbox" className="toggle" />
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-96 p-0"
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('info')}
                className={`
                  ${activeTab === 'info' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'}
                `}
              >
                Info
              </button>
              <button 
                onClick={() => setActiveTab('media')}
                className={`
                  ${activeTab === 'media' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'}
                `}
              >
                Media
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`
                  ${activeTab === 'settings' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground'}
                `}
              >
                Settings
              </button>
            </div>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto">
            {activeTab === 'info' && renderInfoTab()}
            {activeTab === 'media' && renderMediaTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatDetailsSidebar;