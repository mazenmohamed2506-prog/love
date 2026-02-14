import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PasswordGate from "@/components/PasswordGate";
import PhotoSlideshow from "@/components/PhotoSlideshow";

const Index = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <PasswordGate key="gate" onUnlock={() => setUnlocked(true)} />
        ) : (
          <PhotoSlideshow key="slides" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
