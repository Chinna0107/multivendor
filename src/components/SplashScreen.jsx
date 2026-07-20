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

    // Phase 1: 3D Flip Reveal
    tl.from(logo.current, {
      rotationX: 90,
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.5)'
    })
      // Phase 2: Text gently fades in
      .from(textRef.current, {
        y: 15,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, "-=0.6")
      // Hold for a moment to let the user read
      .to({}, { duration: 0.8 })
      // Phase 3: Logo smoothly scales up and fades out
      .to(logo.current, {
        scale: 3,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.in'
      })
      // Phase 4: Container fades to transparent to reveal the app smoothly
      .to(container.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, "-=0.5");
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center w-full h-full"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div ref={logo} className="perspective-1000">
          <img
            src={logoImg}
            alt="Indbasket"
            className="w-56 md:w-80 object-contain"
          />
        </div>
        <div ref={textRef} className="text-center overflow-hidden">
          <p className="text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase opacity-80">
            Everything in one place - INDBASKET
          </p>
        </div>
      </div>
    </div>
  );
}
