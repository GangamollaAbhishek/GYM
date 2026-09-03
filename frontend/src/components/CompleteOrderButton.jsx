import React, { useState, useRef } from "react";
import "./CompleteOrderButton.css";
import { ShieldCheck } from "lucide-react";

export default function CompleteOrderButton({
  label = "Complete Order",
  amountText = "",
  disabled = false,
  onComplete = () => {},
  className = "",
}) {
  const [btnState, setBtnState] = useState(""); // '' | 'animating show-box' | 'animating speeding' | 'completed'
  const [truckState, setTruckState] = useState(""); // '' | 'doors-open' | 'lights-on'
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const truckRef = useRef(null);

  // Timeline Step Durations
  const BASE_TIMINGS = {
    BOX_DROP: 250,
    TRUCK_ENTRY: 500,
    DOORS_OPEN: 350,
    REVERSE_LOAD: 750,
    DOORS_CLOSE: 300,
    FORWARD_START: 500,
    LIGHTS_ON: 400,
    DRIVE_OUT: 1800,
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const setTruckTransition = (
    seconds,
    easing = "cubic-bezier(0.25, 1, 0.5, 1)",
  ) => {
    if (truckRef.current) {
      truckRef.current.style.transition = `transform ${seconds}s ${easing}`;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (disabled || isAnimating || isCompleted) return;

    setIsAnimating(true);
    setIsCompleted(false);

    // Step 1: Click -> Button depresses, "Complete Order" slides up, Box drops in
    setBtnState("animating show-box");
    await delay(BASE_TIMINGS.BOX_DROP);

    // Step 2: Truck drives in from the right to center-right
    setTruckTransition(0.5, "cubic-bezier(0.25, 1, 0.5, 1)");
    if (truckRef.current) {
      truckRef.current.style.transform = "translateX(120px)";
    }
    await delay(BASE_TIMINGS.TRUCK_ENTRY);

    // Step 3: Rear doors swing open wide (\ /)
    setTruckState("doors-open");
    await delay(BASE_TIMINGS.DOORS_OPEN);

    // Step 4: Truck reverses left over the package at left: 52px
    setTruckTransition(
      BASE_TIMINGS.REVERSE_LOAD / 1000,
      "cubic-bezier(0.4, 0, 0.2, 1)",
    );
    if (truckRef.current) {
      truckRef.current.style.transform = "translateX(40px)";
    }

    // Halfway through reverse, package disappears into cargo
    await delay(BASE_TIMINGS.REVERSE_LOAD * 0.45);
    setBtnState((prev) => `${prev} box-loaded`);
    await delay(BASE_TIMINGS.REVERSE_LOAD * 0.55);

    // Step 5: Rear doors close properly
    setTruckState("");
    await delay(300);

    // Step 6: Truck shifts gear to forward -> HEADLIGHTS TURN ON & Accelerate Forward!
    setTruckState("lights-on");
    setBtnState((prev) => `${prev} speeding`);

    // Truck accelerates smoothly out to the right
    setTruckTransition(1.8, "cubic-bezier(0.2, 0, 0.4, 1)");
    if (truckRef.current) {
      truckRef.current.style.transform = "translateX(390px)";
    }
    await delay(1800);

    // Step 7: Order Placed state with green checkmark!
    setTruckState("");
    setBtnState("completed");
    setIsCompleted(true);
    setIsAnimating(false);

    // Trigger completion callback to display invoice modal / finalize purchase
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div className={`complete-order-container ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isAnimating}
        className={`order-btn ${btnState} ${disabled ? "disabled-btn" : ""}`}
        aria-label="Complete Order"
      >
        {/* Button Text: Complete Order / Default */}
        <span className="btn-text default-text">
          <ShieldCheck size={17} className="text-[#FF1E27]" />
          <span>
            {label} {amountText ? `• ${amountText}` : ""}
          </span>
        </span>

        {/* Button Text: Order Placed / Success */}
        <span className="btn-text success-text">
          <svg
            className="check-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Order Confirmed & Placed!</span>
        </span>

        {/* Dashed Highway Road Line */}
        <div className="road-dashed"></div>

        {/* Cardboard Box Package SVG */}
        <div className="box-wrapper">
          <svg
            className="box-svg"
            viewBox="0 0 26 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="26" height="24" rx="4" fill="#E5A853" />
            <rect x="9.5" width="7" height="24" fill="#C48432" />
            <line
              x1="0"
              y1="1"
              x2="26"
              y2="1"
              stroke="#FCE7C8"
              strokeOpacity="0.6"
            />
          </svg>
        </div>

        {/* Delivery Truck SVG Container */}
        <div ref={truckRef} className={`truck-wrapper ${truckState}`}>
          <svg
            className="truck-svg"
            viewBox="0 0 140 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="beamGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#FACC15" stopOpacity="0.45" />
                <stop offset="85%" stopColor="#FACC15" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Headlight Light Cones */}
            <g className="light-beams">
              <polygon points="96,7 165,-8 165,24" fill="url(#beamGlow)" />
              <polygon points="96,41 165,24 165,56" fill="url(#beamGlow)" />
              <polygon
                points="96,24 175,10 175,38"
                fill="url(#beamGlow)"
                opacity="0.5"
              />
            </g>

            {/* Side Mirrors */}
            <line
              x1="72"
              y1="4"
              x2="65"
              y2="-1"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="72"
              y1="44"
              x2="65"
              y2="49"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Rear Doors (Hinge at rear corners, meet in center) */}
            <g className="truck-doors">
              <line
                className="door-top"
                x1="16"
                y1="4"
                x2="16"
                y2="24"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                className="door-bottom"
                x1="16"
                y1="44"
                x2="16"
                y2="24"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* White Cargo Container Body */}
            <rect x="16" y="4" width="56" height="40" rx="4" fill="#FFFFFF" />
            <line
              x1="62"
              y1="4"
              x2="62"
              y2="44"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Crimson/Red Truck Cab */}
            <path
              d="M72 4 H88 C94 4 98 9 98 24 C98 39 94 44 88 44 H72 V4 Z"
              fill="#FF1E27"
            />

            {/* Dark Windshield with Shine */}
            <path
              d="M76 7 H86 C89.5 7 92 11 92 24 C92 37 89.5 41 86 41 H76 V7 Z"
              fill="#0F172A"
            />
            <line
              x1="79"
              y1="10"
              x2="89"
              y2="20"
              stroke="#FFFFFF"
              strokeOpacity="0.35"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Headlights */}
            <rect
              className="headlight-top"
              x="94"
              y="6"
              width="4"
              height="7"
              rx="1.5"
              fill="#FACCB1"
            />
            <rect
              className="headlight-bottom"
              x="94"
              y="35"
              width="4"
              height="7"
              rx="1.5"
              fill="#FACCB1"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
