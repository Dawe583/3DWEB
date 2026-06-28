import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";

import Index from "./pages/index";
// Secondary pages are split out so the landing page ships the smallest bundle.
const Templates = lazy(() => import("./pages/templates"));
const TemplateDetail = lazy(() => import("./pages/template-detail"));
const Automatizace = lazy(() => import("./pages/automatizace"));
const Marketing = lazy(() => import("./pages/marketing"));
import AmbientBackground from "./components/AmbientBackground";
import SmoothScroll from "./components/SmoothScroll";
import CursorFollower from "./components/CursorFollower";
import NoiseOverlay from "./components/NoiseOverlay";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";
import SoundToggle from "./components/SoundToggle";
import VideoManager from "./components/VideoManager";

const wipeEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="relative z-10">
        {/* Curtain wipe — covers the outgoing page, then retracts upward to
            reveal the incoming one. Content fade is timed so it never shows
            mid-wipe, keeping the cut feeling deliberate, not janky. */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0, transition: { duration: 0.6, ease: wipeEase, delay: 0.05 } }}
          exit={{ scaleY: 1, transition: { duration: 0.5, ease: wipeEase } }}
          style={{ originY: 1 }}
          className="fixed inset-0 z-[100] bg-black pointer-events-none motion-reduce:hidden"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.45 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/weby" element={<Templates />} />
              <Route path="/weby/:slug" element={<TemplateDetail />} />
              <Route path="/automatizace" element={<Automatizace />} />
              <Route path="/marketing" element={<Marketing />} />
            </Routes>
          </Suspense>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AmbientBackground />
      <LoadingScreen />
      <SmoothScroll />
      <VideoManager />
      <CursorFollower />
      <NoiseOverlay />
      <ScrollProgress />
      <SoundToggle />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
