import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import FloatingHearts from "./FloatingHearts";

// Photos — replace these paths with your actual uploaded images
const slides = [
  { type: "image", src: "https://cdn.pixabay.com/photo/2021/09/06/05/55/love-6600906_1280.jpg", caption: "You make the ordinary feel extraordinary ✨" },
  { type: "image", src: "https://t3.ftcdn.net/jpg/10/02/73/78/360_F_1002737826_NiCfcJukqpCzQHNABNKB1D9qVS6uQXK4.jpg", caption: "Every story has a beginning… ours started with you 💫" },
  { type: "image", src: "https://videocdn.cdnpk.net/videos/01d753e6-fb9a-5214-9fe0-6bca51e5097b/horizontal/thumbnails/large.jpg?semt=ais_hybrid&item_id=6624429&w=740&q=80", caption: "Some people are magic. You’re proof💫" },
  { type: "image", src: "https://img.freepik.com/free-photo/lovely-young-couple-dancing-together-near-seacoast-beach_23-2148103108.jpg?semt=ais_hybrid&w=740&q=80", caption: "Some moments are just worth holding onto forever 🤍" },
  { type: "image", src: "https://st3.depositphotos.com/7037632/18848/i/450/depositphotos_188486718-stock-photo-romantic-fairytale-happy-newlywed-couple.jpg", caption: "With you, even silence feels like a conversation 💭" },
  { type: "image", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm8IbdtueToLOULJ79Q62niEvv_Hvxw9cg7A&s", caption: "You're my favorite notification 📱" },
  { type: "image", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk9XPX2GgLKn7krM8GpGQTdUlyHpXT1bsAYg&s", caption: "Life's better with you in it, no doubt about that 🌙" },
  { type: "image", src: "https://thumbs.dreamstime.com/b/bride-groom-near-lake-wedding-day-83197782.jpg", caption: "This smile? Yeah, that's because of you 😊 ✨" },
  { type: "video", src: "https://www.pexels.com/download/video/18294808/", caption: "You don’t just change moments… you turn them into memories ✨" },

];

const finalSlide = {
  mainMessage:
    "Hey you… yeah, you. I just wanted to say — you mean the world to me. Not in a cheesy movie way, but in a 'you're the first person I want to talk to every day' kind of way. Thank you for being you. 💛",
  secretMessage: "P.S. You're stuck with me now 😏",
};

const PhotoSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalSlides = slides.length + 1; // +1 for final slide

  // Start music
  useEffect(() => {
    const audio = new Audio("/music/60625.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Mute toggle for background music only (keeps your current behavior)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  // Auto switch audio: when video slide -> pause music + play video sound
  // when image slide -> pause video + resume music
  useEffect(() => {
    const currentSlide = slides[current];

    // When we are on the final slide (no slide object), stop video and resume music
    if (!currentSlide) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    if (currentSlide.type === "video") {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [current]);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(totalSlides - 1, c + 1));

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch swipe
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
  };

  const isFinal = current === slides.length;

  return (
    <div
      className="fixed inset-0 bg-background overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {!isFinal ? (
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Blurred background for images only */}
            {slides[current].type === "image" && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-40"
                style={{ backgroundImage: `url(${slides[current].src})` }}
              />
            )}

            {/* Main content */}
            {slides[current].type === "video" ? (
              <video
                ref={videoRef}
                src={slides[current].src}
                className="absolute inset-0 w-full h-full object-contain"
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={slides[current].src}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl md:text-4xl font-semibold text-foreground leading-relaxed max-w-2xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {slides[current].caption}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-lg text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-8"
              >
                💛
              </motion.div>

              <p
                className="text-xl md:text-2xl text-foreground leading-relaxed mb-10"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {finalSlide.mainMessage}
              </p>

              <AnimatePresence>
                {showSecret ? (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-lg text-primary font-semibold"
                  >
                    {finalSlide.secretMessage}
                  </motion.p>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSecret(true)}
                    className="px-6 py-3 rounded-full bg-muted/50 border border-border text-muted-foreground text-sm backdrop-blur-sm hover:text-foreground transition-colors"
                  >
                    Tap me… 👀
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-20">
        <button
          onClick={prev}
          disabled={current === 0}
          className="p-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border text-foreground disabled:opacity-20 transition-opacity hover:bg-muted/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-primary w-6" : "bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === totalSlides - 1}
          className="p-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border text-foreground disabled:opacity-20 transition-opacity hover:bg-muted/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute top-6 right-6 p-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border text-foreground z-20 hover:bg-muted/50 transition-colors"
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Slide counter */}
      <div className="absolute top-6 left-6 text-muted-foreground text-sm z-20">
        {current + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default PhotoSlideshow;
