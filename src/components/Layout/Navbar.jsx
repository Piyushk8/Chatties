import React from "react";
import Avatar from "../shared/Avatar";
import userAvatar from "../../assets/userAvatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Check,
  Monitor,
  MoonIcon,
  SearchIcon,
  Sun,
  UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { useTheme } from "@/components/theme-provider.jsx";
import SearchInput from "../specific/InputField";
import Sidebar from "../specific/SideBar";
import { setIsSearch } from "@/redux/reducers/misc";
import axios from "axios";
import { server } from "@/constant/config";
import { userNotExists } from "@/redux/reducers/auth";

const Navbar = () => {
  const { setTheme, theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const nav = useNavigate()

 
  const handleLogout = async () => {
    try {
      const res = await axios.delete(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success == true) {
        dispatch(userNotExists());
        toast.success(res?.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    // <div>
    <div className="header backdrop-blur-md border border-separate  flex justify-center items-center w-full inset-x-1 z-30  shadow-sm h-[4.3rem] md:h-[6.3rem]">
      <div className=" bg-card border border-border animate-border-beam rounded-sm h-[70%]  w-[95%] flex justify-between items-center">
        <div>
          <div
            onClick={() => nav("/")}
            className="cursor-pointer  h-full w-fit  flex font-extrabold text-gray-500 justify-center items-center"
          >
            {/* <img src={mainLogo} className="w-full text-black h-full " alt="///" /> */}
            <span className="text-primary font-mono font-bold text-lg ml-2 p-3 pl-0">
              Chatties
            </span>
            <div className="sm:block hidden p-2">
              <SearchInput/>
            </div>
            <div onClick={()=>dispatch(setIsSearch(true))} className="sm:hidden block text-primary bg-secondary rounded-full p-1">
              <SearchIcon size={20}/>
            </div>
          </div>
        </div>
        {/* popover */}
        <div className="mr-2 h-full flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("ring-1 ring-card-foreground flex-none rounded-full")}>
                  <Avatar
                    className={"md:h-12 md:w-12  rounded-full"}
                    avatar={user?.avatarUrl || userAvatar}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-2 py-1 ">
                <DropdownMenuLabel className="text-sm text-gray-500 ">
                  Logged in as @{user?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Monitor className="mr-2 size-4"></Monitor>
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Monitor className="mr-2 size-4" />
                        System Default{" "}
                        {theme === "system" && <Check className="ms-2" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <MoonIcon className="mr-2 size-4" />
                        Dark {theme === "dark" && <Check className="ms-2" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          return setTheme("light");
                        }}
                      >
                        <Sun className="mr-2 size-4" />
                        Light {theme === "light" && <Check className="ms-2" />}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <Link href={``}>
                  <DropdownMenuItem className="text-gray-500">
                    <UserIcon className="mr-2 size-4" />
                    profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
   
      </div>
    </div>
  );
};

export default Navbar;
