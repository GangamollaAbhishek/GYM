import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLandingPageCMS } from "../context/LandingPageCMSContext";
import "./HorizontalWords.css";

gsap.registerPlugin(ScrollTrigger);

const HorizontalWords = () => {
  const { cmsData } = useLandingPageCMS();
  const hwData = cmsData?.horizontalWords || {};
  const sentence = hwData.sentence || "PAIN IS TEMPORARY GLORY IS FOREVER";
  const bottomText =
    hwData.bottomText ||
    "Your only limit is you. Every rep, every drop of sweat, and every painful set brings you closer to your ultimate transformation. Rise above average. Dominate your limits.";
  const words = sentence.split(" ");

  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      const pinTarget = pinRef.current;
      if (!container || !pinTarget) return;

      const textRef = container.querySelector(".horizontal-words__relative");
      const letters = container.querySelectorAll(".letter");
      const stickers = container.querySelectorAll(
        ".horizontal-words__sticker-watch, .horizontal-words__sticker-cursor, .horizontal-words__sticker-phone",
      );
      const arrows = container.querySelectorAll(
        ".horizontal-words__arrow-svg path, .horizontal-words__arrow-end-svg path",
      );

      // Timeline for smooth horizontal scrolling - Pins inner container so section remains direct child of React root
      const scrollTween = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: pinTarget,
          pinSpacing: true,
          start: "top top",
          end: "+=2800",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Move text across screen horizontally until text is completely in view
      scrollTween.fromTo(
        textRef,
        {
          xPercent: 30,
        },
        {
          xPercent: -75,
          ease: "none",
          duration: 0.82,
        },
      );

      // 2. Smooth stationary hold buffer at the end so user reads full sentence before Section 3 scrolls in
      scrollTween.to({}, { duration: 0.18 });

      // Bounce each letter randomly with elastic spring
      letters.forEach((letter) => {
        gsap.from(letter, {
          yPercent: (Math.random() - 0.5) * 80,
          rotation: (Math.random() - 0.5) * 40,
          ease: "elastic.out(1.2, 1)",
          scrollTrigger: {
            trigger: letter,
            containerAnimation: scrollTween,
            start: "left 92%",
            end: "left 8%",
            scrub: 0.5,
          },
        });
      });

      // Bounce equipment stickers
      stickers.forEach((sticker) => {
        gsap.from(sticker, {
          scale: 0.2,
          yPercent: (Math.random() - 0.5) * 90,
          rotation: (Math.random() - 0.5) * 45,
          ease: "elastic.out(1.2, 1)",
          scrollTrigger: {
            trigger: sticker,
            containerAnimation: scrollTween,
            start: "left 90%",
            end: "left 10%",
            scrub: 0.5,
          },
        });
      });

      // Animate Drawing SVG Arrows
      arrows.forEach((arrowPath) => {
        if (arrowPath.getTotalLength) {
          const pathLen = arrowPath.getTotalLength();
          gsap.set(arrowPath, {
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen,
          });
          gsap.to(arrowPath, {
            strokeDashoffset: 0,
            duration: 1,
            scrollTrigger: {
              trigger: arrowPath.parentElement,
              containerAnimation: scrollTween,
              start: "left 90%",
              end: "left 30%",
              scrub: 0.5,
            },
          });
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="horizontal-words-section content-section"
    >
      <div
        ref={pinRef}
        className="horizontal-words-pin-container w-full h-full"
      >
        <div className="horizontal-words__relative">
          <div className="horizontal-words__sticker-svg">
            {/* Start Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 386 127"
              fill="none"
              className="horizontal-words__arrow-svg"
            >
              <path
                d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            {/* Gym Sticker 1: Heavy Iron Dumbbell SVG */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="horizontal-words__sticker-watch w-20 sm:w-28 lg:w-32 h-auto filter drop-shadow-[0_0_15px_rgba(229,9,20,0.6)]"
            >
              <rect x="8" y="32" width="16" height="36" rx="4" fill="#E50914" />
              <rect
                x="24"
                y="24"
                width="12"
                height="52"
                rx="4"
                fill="#FF2B35"
              />
              <rect
                x="36"
                y="44"
                width="28"
                height="12"
                rx="3"
                fill="#FFFFFF"
              />
              <rect
                x="64"
                y="24"
                width="12"
                height="52"
                rx="4"
                fill="#FF2B35"
              />
              <rect
                x="76"
                y="32"
                width="16"
                height="36"
                rx="4"
                fill="#E50914"
              />
            </svg>

            {/* Gym Sticker 2: Cast Iron Kettlebell SVG */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="horizontal-words__sticker-cursor w-20 sm:w-28 lg:w-32 h-auto filter drop-shadow-[0_0_15px_rgba(255,43,53,0.6)]"
            >
              <path
                d="M30 40 C30 18, 70 18, 70 40"
                stroke="#FF2B35"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="50" cy="62" r="32" fill="#E50914" />
              <circle
                cx="50"
                cy="62"
                r="14"
                fill="#151515"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <text
                x="50"
                y="66"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="900"
                fontFamily="sans-serif"
              >
                KG
              </text>
            </svg>

            {/* Gym Sticker 3: Olympic Barbell & Weight Plates SVG */}
            <svg
              viewBox="0 0 120 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="horizontal-words__sticker-phone w-24 sm:w-32 lg:w-36 h-auto filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              <rect
                x="10"
                y="46"
                width="100"
                height="8"
                rx="2"
                fill="#FFFFFF"
              />
              <rect
                x="22"
                y="20"
                width="10"
                height="60"
                rx="3"
                fill="#E50914"
              />
              <rect x="34" y="28" width="8" height="44" rx="2" fill="#FF2B35" />
              <rect x="78" y="28" width="8" height="44" rx="2" fill="#FF2B35" />
              <rect
                x="88"
                y="20"
                width="10"
                height="60"
                rx="3"
                fill="#E50914"
              />
              <rect x="18" y="42" width="4" height="16" fill="#FFFFFF" />
              <rect x="98" y="42" width="4" height="16" fill="#FFFFFF" />
            </svg>

            {/* End Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 140 127"
              fill="none"
              className="horizontal-words__arrow-end-svg"
            >
              <path
                d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.437 125.078L99.6875 107.891"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.438 125.078L137.969 110.234"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            {/* Gym Quote Headline */}
            <h2 className="display horizontal-words__h2" aria-label={sentence}>
              {words.map((word, wIdx) => (
                <span key={wIdx} className="word">
                  {word.split("").map((char, cIdx) => (
                    <span key={cIdx} className="letter" aria-hidden="true">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <div className="horizontal-words__bottom-text">
          <div className="horizontal-words__bottom-text-l">{bottomText}</div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalWords;
