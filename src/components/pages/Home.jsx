import React, { useEffect } from "react";
import appLayout from "../Layout/appLayout";
import { useDispatch } from "react-redux";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";
import { BlurFade } from "../ui/blur-fade";
import {motion} from "framer-motion"
import { ThemeProvider, useTheme } from "../theme-provider";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import InviteLinkJoinDialog from "../Dialogs/InviteLinkJoinDialog";
function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has("invite")) {
      setIsDialogOpen(true);

    }
  }, [searchParams]);

  return (
    <div 
    className="relative  bg-card h-full flex justify-center items-center w-full">
      {/* Background Dot Pattern */}
      <DotPattern
        className={cn(
          `[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]`,"animate glow-effect" 
           // Increased dot pattern size
        )}
      />
      <div className="flex h-full flex-col items-center justify-center pl-8 w-[70%]">
        {/* Header Section */}
        <section id="header" className="flex flex-col justify-between">
          <div className="mb-5">
            <BlurFade delay={0.25} inView>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Gateway to Instant <span className=" text-primary">Conversations.</span>
              </h2>
            </BlurFade>
          </div>
          <div>
            <BlurFade delay={0.5} inView>
              <span className="text-pretty text-xl tracking-tighter sm:text-3xl xl:text-4xl/none">
                Real-time. Real Fast. Real Simple
              </span>
            </BlurFade>
          </div>
        </section>
      </div>
      {isDialogOpen && (
     <InviteLinkJoinDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} groupId={searchParams.get("group")}/>
      )}
    </div>
  );
}

export default appLayout()(Home);
