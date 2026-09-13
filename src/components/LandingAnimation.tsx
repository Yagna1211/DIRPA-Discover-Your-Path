import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, MapPin, ArrowRight, GraduationCap, Briefcase, Award, Target } from 'lucide-react';
import DirpaLogo, { getActiveLogoStyle } from './DirpaLogo';

interface LandingAnimationProps {
  onComplete: () => void;
}

export default function LandingAnimation({ onComplete }: LandingAnimationProps) {
  // Sequence stages: 'enter-dirpa' -> 'minimize-reveal' -> 'curtain-wipe' -> 'done'
  const [stage, setStage] = useState<'enter-dirpa' | 'minimize-reveal' | 'curtain-wipe' | 'done'>('enter-dirpa');

  // Interactive path drawing trigger state
  const [drawPath, setDrawPath] = useState(false);

  // Preserve onComplete reference without re-triggering timers on parent re-renders
  const onCompleteRef = React.useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Stage 1: Big DIRPA Entry. Set path to begin drawing after logo settles
    const timerPath = setTimeout(() => {
      setDrawPath(true);
    }, 300);

    // Stage 2: Minimize DIRPA logo and reveal "Discover your path!"
    const timerMinimize = setTimeout(() => {
      setStage('minimize-reveal');
    }, 1400);

    // Stage 3: Initiate 100% Full-Screen Staggered Curtain wipe
    const timerWipe = setTimeout(() => {
      setStage('curtain-wipe');
    }, 3200);

    // Stage 4: Fully finalize & unmount
    const timerDone = setTimeout(() => {
      setStage('done');
      onCompleteRef.current();
    }, 3900);

    // Safety fallback: Ensure onComplete is called after 4.5 seconds maximum
    const timerSafety = setTimeout(() => {
      setStage('done');
      onCompleteRef.current();
    }, 4500);

    return () => {
      clearTimeout(timerPath);
      clearTimeout(timerMinimize);
      clearTimeout(timerWipe);
      clearTimeout(timerDone);
      clearTimeout(timerSafety);
    };
  }, []); // Empty dependency array ensures timers are never reset mid-sequence

  // Letters of DIRPA
  const brandLetters = ["D", "I", "R", "P", "A"];

  // Floating nodes to decorate the empty spaces and build context
  const academicNodes = [
    { text: "10th Standard Explorer", x: "12%", y: "25%", color: "bg-rose-100 text-rose-800", icon: Compass },
    { text: "Intermediate General (MPC/BiPC)", x: "80%", y: "20%", color: "bg-blue-100 text-[#1D4ED8]", icon: GraduationCap },
    { text: "Polytechnic Branches (3rd Year Direct)", x: "15%", y: "75%", color: "bg-emerald-100 text-emerald-800", icon: Award },
    { text: "ITI & Highly Skilled Vocations", x: "82%", y: "70%", color: "bg-amber-100 text-amber-800", icon: Target },
    { text: "Direct B.Tech Year 2 (AP ECET)", x: "50%", y: "82%", color: "bg-purple-100 text-purple-800", icon: Briefcase },
  ];

  // Manual Skip handler with accelerated exit
  const handleSkip = () => {
    setStage('done');
    onCompleteRef.current();
  };

  return (
    <AnimatePresence mode="wait">
      {stage !== 'done' && (
        <div id="landing-splash-overlay" className="fixed inset-0 z-50 overflow-hidden select-none bg-stone-100">
          
          {/* SKIP INTRO BUTTON */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-6 right-6 z-50 px-4 py-2 bg-black text-amber-300 border-2 border-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(245,158,11,1)] hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            title="Skip intro animation"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          {/* BACKGROUND DECORATIONS (Connecting paths, Dot-grid, Moving stars) */}
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #c5c5be 1.5px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* SVG Road-Map Drawing Animation spanning the background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M -100,300 C 200,100 400,600 700,350 C 900,180 1200,450 1600,200 C 1800,100 2100,500 2300,300"
              fill="none"
              stroke="#000000"
              strokeWidth="5"
              strokeDasharray="14,14"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={drawPath ? { pathLength: 1, opacity: 0.18 } : {}}
              transition={{ duration: 3.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M -50,450 C 350,550 500,150 900,450 C 1300,750 1500,250 2100,400"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={drawPath ? { pathLength: 1, opacity: 0.25 } : {}}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </svg>

          {/* FLOATING ACADEMIC MILESTONES (Fading on curtain release) */}
          <AnimatePresence>
            {stage !== 'curtain-wipe' && (
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {academicNodes.map((node, idx) => {
                  const NodeIcon = node.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.4, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.25 } }}
                      transition={{
                        delay: 0.4 + idx * 0.12,
                        type: "spring",
                        stiffness: 70,
                        damping: 10
                      }}
                      style={{ left: node.x, top: node.y }}
                      className={`absolute pointer-events-auto border-2 border-black px-4 py-2 bg-white ${node.color} font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-100`}
                    >
                      <NodeIcon className="w-3.5 h-3.5" />
                      <span>{node.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* MAIN INTERACTIVE CORE CONTENT CONTAINER */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-4 z-20">
            
            {/* The Floating Center-Card that dynamically animates to reveal content */}
            <AnimatePresence>
              {stage !== 'curtain-wipe' && (
                <motion.div
                  initial={{ boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)', scale: 0.95 }}
                  animate={{ 
                    scale: 1, 
                    boxShadow: stage === 'enter-dirpa' ? '12px 12px 0px 0px rgba(0,0,0,1)' : '6px 6px 0px 0px rgba(0,0,0,1)'
                  }}
                  exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
                  className="relative p-8 md:p-14 max-w-3xl w-full border-4 border-black bg-amber-50 rounded-none text-center overflow-hidden flex flex-col items-center justify-center min-h-[420px]"
                >
                  {/* Retro Corner Badges */}
                  <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                    <span className="w-3 h-3 rounded-full bg-red-500 border border-black animate-pulse"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span>
                  </div>

                  <div className="absolute top-4 right-4 font-mono font-extrabold text-[10px] text-zinc-640 uppercase tracking-widest bg-zinc-200/80 px-2 py-0.5 border border-black rounded-none">
                    ENGINE_V2_ONLINE
                  </div>

                  {/* STEP 1: GIANT DIRPA WORDMARK */}
                  <div className="relative w-full flex flex-col items-center justify-center">
                    
                    {/* The primary animated brand logo block */}
                    <motion.div
                      layout
                      initial={{ scale: 0.3, rotate: -5, opacity: 0 }}
                      animate={stage === 'enter-dirpa' ? {
                        scale: 1,
                        rotate: 0,
                        opacity: 1,
                        y: 0
                      } : {
                        scale: 0.7,
                        rotate: -2,
                        opacity: 1,
                        y: -110
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 18,
                        layout: { duration: 0.55, ease: "easeInOut" }
                      }}
                      className="absolute z-10 bg-white border-4 border-black px-6 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer min-w-[240px]"
                    >
                      <DirpaLogo styleName={getActiveLogoStyle()} variant="full" size={stage === 'enter-dirpa' ? 'lg' : 'md'} animate={true} />
                    </motion.div>

                    {/* Sub-label for DIRPA at the very beginning */}
                    {stage === 'enter-dirpa' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-40 flex flex-col items-center gap-2"
                      >
                        <span className="px-3 py-1 bg-stone-900 text-amber-300 font-mono text-[10.5px] font-bold tracking-widest uppercase border border-black">
                          Dynamic Academic Roadmap Router
                        </span>
                        
                        
                      </motion.div>
                    )}

                    {/* STEP 2: MINIMIZED REVEAL OF "DISCOVER YOUR PATH!" */}
                    <AnimatePresence>
                      {stage === 'minimize-reveal' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 70 }}
                          exit={{ opacity: 0, y: 40 }}
                          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
                          className="w-full flex flex-col items-center"
                        >
                          {/* Spectacular banner showing path statement */}
                          <div className="bg-yellow-100 border-2 border-black p-6 md:p-8 rounded-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative max-w-xl">
                            
                            {/* Little badge ornament */}
                            <div className="absolute -top-4 -right-4 w-9 h-9 bg-[#2563EB] text-white border-2 border-black rounded-none flex items-center justify-center rotate-12">
                              <Sparkles className="w-4 h-4" />
                            </div>

                            <motion.h1
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.4 }}
                              className="text-3xl md:text-5xl font-display font-black uppercase text-black tracking-tight leading-none"
                            >
                              Discover your path!
                            </motion.h1>

                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.8 }}
                              transition={{ delay: 0.55 }}
                              className="text-xs text-stone-600 font-bold font-mono tracking-wider uppercase mt-3"
                            >
                              Interactive Career Pathways, Direct Lateral Admissions, and Alumni Insights mapped instantly.
                            </motion.p>
                          </div>

                
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>



                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* 100% LAYOUT FULL SCREEN GATEWAY WIPER (Toggled on stage 'curtain-wipe') */}
          <div className="absolute inset-0 pointer-events-none flex z-40">
            {Array.from({ length: 5 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ y: "100%" }}
                animate={stage === 'curtain-wipe' ? {
                  y: ["100%", "0%", "-100%"]
                } : {}}
                transition={{
                  duration: 0.85,
                  ease: [0.76, 0, 0.24, 1],
                  times: [0, 0.4, 1],
                  delay: idx * 0.08
                }}
                className="h-full flex-1 bg-amber-250 border-r-2 border-black pointer-events-auto"
                style={{
                  boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)',
                  backgroundImage: idx % 2 === 0 ? `radial-gradient(circle at 10px 10px, #000 1px, transparent 0)` : 'none',
                  backgroundSize: '16px 16px',
                  backgroundPosition: 'center'
                }}
              >
                {/* Micro branding stamp blinking inside the center gate panel */}
                {idx === 2 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-black font-display font-black uppercase">
                    <span className="text-xl tracking-tighter">DIRPA MAPS</span>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-800">CONNECTING...</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
