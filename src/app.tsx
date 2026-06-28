import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Index from "./pages/index";
import Templates from "./pages/templates";
import TemplateDetail from "./pages/template-detail";
import SmoothScroll from "./components/SmoothScroll";
import CursorFollower from "./components/CursorFollower";
import NoiseOverlay from "./components/NoiseOverlay";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";
import SoundToggle from "./components/SoundToggle";
import VideoManager from "./components/VideoManager";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/weby" element={<Templates />} />
          <Route path="/weby/:slug" element={<TemplateDetail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
