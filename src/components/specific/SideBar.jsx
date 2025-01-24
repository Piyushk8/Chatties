import React, { useState } from 'react';
import { 
  UserCircle2, 
  MessageCircle, 
  Settings, 
  Image, 
  Camera, 
  Bell 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from 'react-redux';
import { setIsChatList, setIsSideBarOpen } from '@/redux/reducers/misc';

const Sidebar = ({ user }) => {
  const [activeTab, setActiveTab] = useState('chats');
     const {isSideBarOpen} = useSelector((state) => state.misc)
  const dispatch = useDispatch()
  const sidebarItems = [
    { 
      icon: MessageCircle, 
      name: 'Chats', 
      key:()=>{ 
         dispatch(setIsChatList())
        dispatch(setIsSideBarOpen(false))} 
    },
    { 
      icon: Camera, 
      name: 'Status', 
      key: 'status' 
    },
    { 
      icon: Image, 
      name: 'Media', 
      key: 'media' 
    }
  ];

  return (
    <Sheet open={isSideBarOpen} onOpenChange={()=>dispatch(setIsSideBarOpen(false))}>
      <SheetContent side="left" className="w-80 p-0">
        {/* Sidebar Header */}
        <SheetHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src={user?.avatar?.url || '/default-avatar.png'} 
              alt="User Profile" 
            />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <SheetTitle className="text-lg">{user?.name || 'User'}</SheetTitle>
            <p className="text-sm text-primary-foreground/80">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </SheetHeader>

        {/* Sidebar Menu */}
        <div className="p-4">
          <nav className="space-y-4">
            {sidebarItems.map((item) => (
              <div 
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer 
                  transition-colors duration-200
                  ${activeTab === item.key 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-secondary/20'}
                `}
              >
                <item.icon className="mr-4 h-6 w-6" />
                <span className="text-md">{item.name}</span>
              </div>
            ))}

            {/* Additional Options */}
            <div 
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-secondary/20"
              onClick={() => {/* Handle Settings */}}
            >
              <Settings className="mr-4 h-6 w-6" />
              <span className="text-md">Settings</span>
            </div>

            <div 
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-secondary/20"
              onClick={() => {/* Handle Notifications */}}
            >
              <Bell className="mr-4 h-6 w-6" />
              <span className="text-md">Notifications</span>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;