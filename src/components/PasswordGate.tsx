import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import FloatingHearts from "./FloatingHearts";

interface PasswordGateProps {
  onUnlock: () => void;
}

const PASSWORD = "moza";

const PasswordGate = ({ onUnlock }: PasswordGateProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      setUnlocking(true);
      setTimeout(onUnlock, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <AnimatePresence>
      {!unlocking ? (
        <motion.div
          key="gate"
          className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <FloatingHearts />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-16 h-16 text-primary fill-primary/30" />
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              This is for someone special 💕
            </h1>

            <p className="text-muted-foreground text-lg max-w-md">
              Enter the password to continue…
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
              <input
                type="password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter password"
                className="w-full px-5 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-center text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg transition-colors hover:bg-primary/90"
              >
                Unlock 💛
              </motion.button>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-destructive text-sm"
                  >
                    Wrong password, try again 💔
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="unlocking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-background z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-7xl"
          >
            💕
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordGate;
