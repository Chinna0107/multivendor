import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logoImg from '../assets/logo.jpeg';

export function SplashScreen({ onComplete }) {
  const container = useRef(null);
  const logo = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Phase 1: Logo fades in and scales up
    tl.from(logo.current, {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.5)'
    })
    // Phase 2: Text fades in below
    .from(textRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, "-=0.4")
    // Phase 3: Gentle float effect (breathing)
    .to(logo.current, {
      y: -10,
      duration: 0.8,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    })
    // Phase 4: Container sweeps up to reveal app
    .to(container.current, {
      yPercent: -100,
      borderBottomLeftRadius: '50%',
      borderBottomRightRadius: '50%',
      duration: 0.8,
      ease: 'power3.inOut'
    });
  }, { scope: container });

  return (
    <div 
      ref={container} 
      className="fixed inset-0 z-[100] bg-brand-cream flex flex-col items-center justify-center w-full h-full shadow-2xl"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <img 
          ref={logo}
          src={logoImg} 
          alt="Indbasket" 
          className="w-48 md:w-72 object-contain mix-blend-multiply drop-shadow-xl"
        />
        <div ref={textRef} className="text-center overflow-hidden">
          <p className="text-brand-orange text-xs md:text-sm font-semibold tracking-[0.3em] uppercase">
            Everything for your divine rituals
          </p>
        </div>
      </div>
    </div>
  );
}
