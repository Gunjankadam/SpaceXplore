"use client";
import React, { useRef } from 'react';
import { useEffect, useState } from "react";
import { Particles } from "@/components/particles";
import { BorderBeam } from "@/components/border-beam";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { AuroraText } from "@/components/magicui/aurora-text";

export default function ParticlesDemo() {
  const [color, setColor] = useState("#ffffff");
  const [showScene, setShowScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    setColor("#ffffff");

    // ✅ Detect HDR load
    const onHDRLoaded = () => {
      setSceneReady(true);
      console.log("✅ HDR loaded, rendering scene.");
    };
    window.addEventListener("hdr-loaded", onHDRLoaded);

    // ✅ Handle browser back
    const onPopState = () => {
      setShowScene(false);
      setSceneReady(false);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("hdr-loaded", onHDRLoaded);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
   

  const buttonRef = useRef<HTMLButtonElement | null>(null); 
  const handleExplore = () => {
     if (buttonRef.current) {
      const buttonId = buttonRef.current.id;
      console.log("Button ID:", buttonId);
     }
    window.history.pushState({}, "", window.location.pathname); // enable back button

    // Watch for HDR loaded via console.log
    const originalLog = console.log;
 console.log = function (...args: unknown[]) { 
  if (args[0] && typeof args[0] === "string" && args[0].includes("HDR environment map successfully loaded!")) {
    console.log = originalLog;
    window.dispatchEvent(new Event("hdr-loaded"));
  }
  originalLog.apply(console, args);
};


    // Inject Three.js scene
    const script = document.createElement("script");
    script.src = "/three-built/bundle.js";
    script.defer = true;
    document.body.appendChild(script);

    setShowScene(true); // Hide landing immediately
  };

 if (showScene && sceneReady) {
  return null; // completely remove landing and let Three.js render to body
}



  // ✅ Show landing page only when not loading scene
  if (!showScene) {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
        <Particles
          className="absolute inset-0 z-0"
          quantity={120}
          ease={80}
          size={3}
          color={color}
          refresh
        />

        <div className="relative z-10 flex flex-col items-center text-white">
          <span className="text-7xl font-semibold">
            <AuroraText>SPACE XPLORE</AuroraText>

          </span>
          <span className="text-1xl font-medium">
          <TypingAnimation
          startOnView={true}  // Starts typing when the element is in view
          duration={100}      // Speed of typing (ms per character)
          delay={500}         // Delay before typing starts
          className="text-1xl"  // Optional custom styling for the typing text
        >
          Your Journey Through the Cosmos Begins Here
        </TypingAnimation>
          </span>

          <Button
            id= "explore-button"
            onClick={handleExplore}
            className="relative mt-10 px-10 py-6 text-2xl font-semibold text-black border-white"
            size="lg"
            variant="outline"
          >
            <span className="animate-blink">Xplore</span>
            <BorderBeam
              size={70}
              initialOffset={30}
              className="from-transparent via-black to-transparent"
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 40,
              }}
            />
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Optional fallback before HDR is ready (can be loading or blank)
  return null;
}
