import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ============================================================================
// Web Audio Synthesizer (Cyber Robot Sound Effects)
// ============================================================================
class AstroBotAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playBleep(freq = 680) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 1.5,
        this.ctx.currentTime + 0.06,
      );

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.07,
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {}
  }

  playServo() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(540, this.ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(
        240,
        this.ctx.currentTime + 0.25,
      );

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.25,
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playShy() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        380,
        this.ctx.currentTime + 0.22,
      );

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + 0.22,
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [587.33, 739.99, 880.0, 1174.66];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.42);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.42);
      });
    } catch (e) {}
  }
}

export const astroAudio = new AstroBotAudio();

// ============================================================================
// AstroBot 3D Mascot React Component
// ============================================================================
const AstroBotAuthMascot = forwardRef(function AstroBotAuthMascot(
  {
    modelType = "robot", // 'robot' | 'xbot' | 'soldier'
    bodyColor = "white",
    ledColor = "cyan",
    onSpeechChange,
    className = "",
  },
  ref,
) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [speechText, setSpeechText] = useState(
    "Beep boop! Ready to roll! 🤖✨",
  );
  const [speechVisible, setSpeechVisible] = useState(true);
  const speechTimeoutRef = useRef(null);

  // Engine references
  const engineRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    clock: new THREE.Clock(),
    mixer: null,
    actions: {},
    activeAction: null,
    gltfModel: null,

    // Procedural robot rig nodes
    robotRoot: null,
    headGroup: null,
    visorMesh: null,
    eyeLeft: null,
    eyeRight: null,
    blushLeft: null,
    blushRight: null,
    leftEar: null,
    rightEar: null,
    leftArm: null,
    rightArm: null,

    // Materials
    matBody: null,
    matVisor: null,
    matLED: null,
    matBlush: null,
    matAccent: null,
    matChrome: null,

    // Lights
    ambientLight: null,
    keyLight: null,
    rimLight: null,

    // Kinematic targets
    targetRootRotY: 0,
    targetHeadRot: new THREE.Euler(0, 0, 0),
    targetEyePos: new THREE.Vector2(0, 0),
    targetLeftEyeScale: new THREE.Vector3(1, 1.18, 0.25),
    targetRightEyeScale: new THREE.Vector3(1, 1.18, 0.25),
    targetBlushOpacity: 0.0,

    targetLeftArm: {
      posX: -0.46,
      posY: -0.06,
      posZ: 0.26,
      rotX: 0.2,
      rotY: 0.1,
      rotZ: 0.2,
    },
    targetRightArm: {
      posX: 0.46,
      posY: -0.06,
      posZ: 0.26,
      rotX: 0.2,
      rotY: -0.1,
      rotZ: -0.2,
    },

    currentState: "IDLE",
    blinkTimer: 0,
    animFrameId: null,
  });

  const say = (text, duration = 3000) => {
    setSpeechText(text);
    setSpeechVisible(true);
    if (onSpeechChange) onSpeechChange(text);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechVisible(false);
    }, duration);
  };

  // Expose Imperative API to Parent Components
  useImperativeHandle(ref, () => ({
    trackInput: (inputElement) => {
      const eng = engineRef.current;
      if (eng.currentState === "PASSWORD_FOCUS") return;

      if (!inputElement || !containerRef.current) return;
      const rect = inputElement.getBoundingClientRect();
      const wrapRect = containerRef.current.getBoundingClientRect();

      const textLen = inputElement.value ? inputElement.value.length : 0;
      const maxLen = 28;
      const ratio = Math.min(textLen / maxLen, 1.0);

      const caretX = rect.left + 50 + (rect.width - 80) * ratio;
      const caretY = rect.top + rect.height / 2;

      const botCenterX = wrapRect.left + wrapRect.width / 2;
      const botCenterY = wrapRect.top + wrapRect.height / 2;

      const deltaX = (caretX - botCenterX) / (window.innerWidth * 0.45 || 500);
      const deltaY = (caretY - botCenterY) / (window.innerHeight * 0.45 || 500);

      const clampX = Math.max(-0.65, Math.min(0.65, deltaX));
      const clampY = Math.max(-0.2, Math.min(0.55, deltaY));

      eng.targetHeadRot.y = clampX * 0.6;
      eng.targetHeadRot.x = clampY * 0.45;
      eng.targetEyePos.set(clampX * 0.04, -clampY * 0.03);

      if (eng.gltfModel) {
        eng.targetRootRotY = clampX * 0.4;
      }
    },

    resetLook: () => {
      const eng = engineRef.current;
      if (eng.currentState === "PASSWORD_FOCUS") return;
      eng.targetHeadRot.set(0, 0, 0);
      eng.targetEyePos.set(0, 0);
      if (eng.gltfModel) eng.targetRootRotY = 0;
    },

    coverEyes: () => {
      const eng = engineRef.current;
      eng.currentState = "PASSWORD_FOCUS";

      // Turn robot 150° around
      eng.targetRootRotY = Math.PI * 0.82;
      eng.targetHeadRot.set(0.1, -0.45, -0.05);

      // Fold arms on back
      eng.targetLeftArm = {
        posX: -0.38,
        posY: 0.05,
        posZ: 0.22,
        rotX: -0.6,
        rotY: 0.4,
        rotZ: 0.4,
      };
      eng.targetRightArm = {
        posX: 0.38,
        posY: 0.05,
        posZ: 0.22,
        rotX: -0.6,
        rotY: -0.4,
        rotZ: -0.4,
      };

      eng.targetLeftEyeScale.set(1.2, 1.25, 0.3);
      eng.targetEyePos.set(-0.02, 0.02);
      eng.targetRightEyeScale.set(1.1, 0.15, 0.3);
      eng.targetBlushOpacity = 0.85;

      if (eng.mixer && eng.actions) {
        const animName = Object.keys(eng.actions).find(
          (k) =>
            k.toLowerCase().includes("idle") ||
            k.toLowerCase().includes("walk"),
        );
        if (animName && eng.actions[animName]) {
          eng.actions[animName].play();
        }
      }

      astroAudio.playServo();
      setTimeout(() => astroAudio.playShy(), 120);
      say("Turning around! Your password is 100% private 🙈🔒", 3500);
    },

    peek: () => {
      const eng = engineRef.current;
      eng.currentState = "PEEK";

      eng.targetRootRotY = 0.45;
      eng.targetHeadRot.set(0.2, 0.1, 0);

      eng.targetLeftArm = {
        posX: -0.46,
        posY: -0.06,
        posZ: 0.26,
        rotX: 0.2,
        rotY: 0.1,
        rotZ: 0.2,
      };
      eng.targetRightArm = {
        posX: 0.46,
        posY: -0.06,
        posZ: 0.26,
        rotX: 0.2,
        rotY: -0.1,
        rotZ: -0.2,
      };

      eng.targetEyePos.set(0.02, -0.04);
      eng.targetLeftEyeScale.set(1.35, 1.35, 0.3);
      eng.targetRightEyeScale.set(1.35, 1.35, 0.3);
      eng.targetBlushOpacity = 0.4;

      astroAudio.playBleep(820);
      say("Sneaking a peek! 👀", 2800);
    },

    uncoverEyes: () => {
      const eng = engineRef.current;
      eng.currentState = "IDLE";

      eng.targetRootRotY = 0;
      eng.targetHeadRot.set(0, 0, 0);
      eng.targetEyePos.set(0, 0);

      eng.targetLeftArm = {
        posX: -0.46,
        posY: -0.06,
        posZ: 0.26,
        rotX: 0.2,
        rotY: 0.1,
        rotZ: 0.2,
      };
      eng.targetRightArm = {
        posX: 0.46,
        posY: -0.06,
        posZ: 0.26,
        rotX: 0.2,
        rotY: -0.1,
        rotZ: -0.2,
      };

      eng.targetLeftEyeScale.set(1.0, 1.18, 0.25);
      eng.targetRightEyeScale.set(1.0, 1.18, 0.25);
      eng.targetBlushOpacity = 0.0;
    },

    celebrate: () => {
      const eng = engineRef.current;
      eng.currentState = "CELEBRATE";
      eng.targetRootRotY = 0;
      eng.targetHeadRot.set(-0.35, 0, 0);

      eng.targetLeftArm = {
        posX: -0.55,
        posY: 0.75,
        posZ: 0.2,
        rotX: -2.6,
        rotY: 0.3,
        rotZ: 0.6,
      };
      eng.targetRightArm = {
        posX: 0.55,
        posY: 0.75,
        posZ: 0.2,
        rotX: -2.6,
        rotY: -0.3,
        rotZ: -0.6,
      };

      eng.targetLeftEyeScale.set(1.4, 0.4, 0.3);
      eng.targetRightEyeScale.set(1.4, 0.4, 0.3);
      eng.targetBlushOpacity = 0.9;

      astroAudio.playSuccess();
      say("Woohoo! Welcome to the hub! 🎉", 5000);
    },

    think: () => {
      const eng = engineRef.current;
      eng.currentState = "THINK";
      eng.targetHeadRot.set(-0.25, 0.35, 0.12);
      if (eng.leftEar && eng.rightEar) {
        eng.leftEar.rotation.x = Math.PI / 2 + 0.3;
        eng.rightEar.rotation.x = Math.PI / 2 - 0.3;
      }

      astroAudio.playBleep(520);
      say("Processing neural telemetry... 🤔", 2400);

      setTimeout(() => {
        if (eng.leftEar && eng.rightEar) {
          eng.leftEar.rotation.x = 0;
          eng.rightEar.rotation.x = 0;
        }
        eng.currentState = "IDLE";
        eng.targetHeadRot.set(0, 0, 0);
      }, 2200);
    },

    wave: () => {
      const eng = engineRef.current;
      eng.currentState = "IDLE";
      eng.targetRightArm = {
        posX: 0.52,
        posY: 0.65,
        posZ: 0.25,
        rotX: -1.8,
        rotY: -0.4,
        rotZ: -0.5,
      };

      astroAudio.playBleep(740);
      say("Welcome to Titan Pulse! 👋", 2400);

      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (eng.rightArm) {
          eng.rightArm.rotation.z = count % 2 === 0 ? -0.6 : -0.1;
        }
        if (count >= 6) {
          clearInterval(interval);
          if (eng.rightArm) eng.rightArm.rotation.z = 0;
        }
      }, 150);
    },

    say: (msg, dur) => say(msg, dur),
  }));

  // Build Procedural Robot
  const buildProceduralRobot = (eng) => {
    eng.robotRoot = new THREE.Group();
    eng.robotRoot.position.set(0, -0.18, 0);
    eng.scene.add(eng.robotRoot);

    // Materials
    eng.matBody = new THREE.MeshStandardMaterial({
      color: getBodyColorHex(bodyColor),
      roughness: 0.18,
      metalness: 0.15,
    });

    eng.matVisor = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.1,
      metalness: 0.85,
    });

    eng.matLED = new THREE.MeshBasicMaterial({
      color: getLedColorHex(ledColor),
    });

    eng.matBlush = new THREE.MeshBasicMaterial({
      color: 0xff4d6d,
      transparent: true,
      opacity: 0.0,
    });

    eng.matAccent = new THREE.MeshStandardMaterial({
      color: 0xff1e27,
      roughness: 0.3,
      metalness: 0.4,
    });

    eng.matChrome = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.1,
      metalness: 0.9,
    });

    // Torso / Neck Collar
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.35, 32);
    const torso = new THREE.Mesh(torsoGeo, eng.matBody);
    torso.position.y = -0.15;
    eng.robotRoot.add(torso);

    const collarGeo = new THREE.TorusGeometry(0.36, 0.035, 16, 32);
    const collar = new THREE.Mesh(collarGeo, eng.matAccent);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.02;
    eng.robotRoot.add(collar);

    // Head Group
    eng.headGroup = new THREE.Group();
    eng.headGroup.position.set(0, 0.45, 0);
    eng.robotRoot.add(eng.headGroup);

    // Helmet Shell
    const helmetGeo = new THREE.SphereGeometry(0.54, 32, 32);
    helmetGeo.scale(1.08, 1.0, 1.0);
    const helmet = new THREE.Mesh(helmetGeo, eng.matBody);
    eng.headGroup.add(helmet);

    // Visor Screen
    const visorGeo = new THREE.SphereGeometry(0.49, 32, 32);
    visorGeo.scale(1.02, 0.84, 0.82);
    eng.visorMesh = new THREE.Mesh(visorGeo, eng.matVisor);
    eng.visorMesh.position.set(0, 0.02, 0.2);
    eng.headGroup.add(eng.visorMesh);

    // Glowing LED Eyes
    const eyeGeo = new THREE.SphereGeometry(0.082, 24, 24);
    eyeGeo.scale(1.0, 1.18, 0.25);

    eng.eyeLeft = new THREE.Mesh(eyeGeo, eng.matLED);
    eng.eyeLeft.position.set(-0.18, 0.04, 0.58);
    eng.headGroup.add(eng.eyeLeft);

    eng.eyeRight = new THREE.Mesh(eyeGeo, eng.matLED);
    eng.eyeRight.position.set(0.18, 0.04, 0.58);
    eng.headGroup.add(eng.eyeRight);

    // Blush Indicators
    const blushGeo = new THREE.SphereGeometry(0.045, 16, 16);
    blushGeo.scale(1.5, 0.6, 0.2);

    eng.blushLeft = new THREE.Mesh(blushGeo, eng.matBlush);
    eng.blushLeft.position.set(-0.24, -0.09, 0.56);
    eng.headGroup.add(eng.blushLeft);

    eng.blushRight = new THREE.Mesh(blushGeo, eng.matBlush);
    eng.blushRight.position.set(0.24, -0.09, 0.56);
    eng.headGroup.add(eng.blushRight);

    // Side Ear Antennae
    const earPodGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 24);
    const earRingGeo = new THREE.TorusGeometry(0.11, 0.02, 12, 24);

    eng.leftEar = new THREE.Group();
    eng.leftEar.position.set(-0.58, 0.04, 0);
    eng.leftEar.rotation.z = Math.PI / 2;
    const leftPodMesh = new THREE.Mesh(earPodGeo, eng.matAccent);
    const leftRingMesh = new THREE.Mesh(earRingGeo, eng.matLED);
    leftRingMesh.position.y = 0.08;
    leftRingMesh.rotation.x = Math.PI / 2;
    eng.leftEar.add(leftPodMesh, leftRingMesh);
    eng.headGroup.add(eng.leftEar);

    eng.rightEar = new THREE.Group();
    eng.rightEar.position.set(0.58, 0.04, 0);
    eng.rightEar.rotation.z = -Math.PI / 2;
    const rightPodMesh = new THREE.Mesh(earPodGeo, eng.matAccent);
    const rightRingMesh = new THREE.Mesh(earRingGeo, eng.matLED);
    rightRingMesh.position.y = 0.08;
    rightRingMesh.rotation.x = Math.PI / 2;
    eng.rightEar.add(rightPodMesh, rightRingMesh);
    eng.headGroup.add(eng.rightEar);

    // Top Antenna
    const topAntennaStemGeo = new THREE.CylinderGeometry(
      0.015,
      0.015,
      0.22,
      12,
    );
    const topStem = new THREE.Mesh(topAntennaStemGeo, eng.matChrome);
    topStem.position.set(0, 0.62, 0);
    eng.headGroup.add(topStem);

    const topOrbGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const topOrb = new THREE.Mesh(topOrbGeo, eng.matLED);
    topOrb.position.set(0, 0.73, 0);
    eng.headGroup.add(topOrb);

    // Articulated Arms
    const buildArm = () => {
      const armGroup = new THREE.Group();
      const shoulder = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        eng.matChrome,
      );
      armGroup.add(shoulder);

      const armPod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.08, 0.22, 16),
        eng.matBody,
      );
      armPod.position.set(0, -0.12, 0.06);
      armPod.rotation.x = -0.35;
      armGroup.add(armPod);

      const hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        eng.matBody,
      );
      hand.scale.set(1.15, 0.85, 1.15);
      hand.position.set(0, -0.24, 0.14);
      armGroup.add(hand);

      const padAccent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16),
        eng.matAccent,
      );
      padAccent.position.set(0, -0.28, 0.17);
      padAccent.rotation.x = Math.PI / 2;
      armGroup.add(padAccent);

      return armGroup;
    };

    eng.leftArm = buildArm();
    eng.leftArm.position.set(-0.46, -0.06, 0.26);
    eng.robotRoot.add(eng.leftArm);

    eng.rightArm = buildArm();
    eng.rightArm.position.set(0.46, -0.06, 0.26);
    eng.robotRoot.add(eng.rightArm);
  };

  // Load GLTF Model (Xbot or Soldier)
  const loadGLTFModel = (eng, gltfPath) => {
    const loader = new GLTFLoader();
    loader.load(
      gltfPath,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.9, 0.9, 0.9);
        model.position.set(0, -0.85, 0);

        eng.gltfModel = model;
        eng.scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          eng.mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            eng.actions[clip.name] = eng.mixer.clipAction(clip);
          });
          const firstAnim = gltf.animations[0];
          if (firstAnim) {
            eng.actions[firstAnim.name].play();
          }
        }
      },
      undefined,
      (err) => {
        console.warn("Fallback to procedural robot mascot:", err);
        buildProceduralRobot(eng);
      },
    );
  };

  const getBodyColorHex = (key) => {
    const map = {
      white: 0xf8fafc,
      black: 0x18181b,
      gold: 0xf59e0b,
      purple: 0x8b5cf6,
      crimson: 0xff1e27,
    };
    return map[key] || map.white;
  };

  const getLedColorHex = (key) => {
    const map = {
      cyan: 0x00f2fe,
      emerald: 0x10b981,
      amber: 0xf59e0b,
      pink: 0xec4899,
      red: 0xff1e27,
    };
    return map[key] || map.cyan;
  };

  // Update Colors Dynamically
  useEffect(() => {
    const eng = engineRef.current;
    if (eng.matBody) {
      eng.matBody.color.setHex(getBodyColorHex(bodyColor));
    }
  }, [bodyColor]);

  useEffect(() => {
    const eng = engineRef.current;
    if (eng.matLED) {
      eng.matLED.color.setHex(getLedColorHex(ledColor));
    }
    if (eng.rimLight) {
      eng.rimLight.color.setHex(getLedColorHex(ledColor));
    }
  }, [ledColor]);

  // Three.js Mount & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const eng = engineRef.current;
    eng.scene = new THREE.Scene();

    const width = container.clientWidth || 250;
    const height = container.clientHeight || 175;

    eng.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    eng.camera.position.set(0, 0.45, 3.8);
    eng.camera.lookAt(0, 0.25, 0);

    eng.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    eng.renderer.setSize(width, height);
    eng.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Studio Lighting
    eng.ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    eng.scene.add(eng.ambientLight);

    eng.keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    eng.keyLight.position.set(3, 5, 4);
    eng.scene.add(eng.keyLight);

    eng.rimLight = new THREE.DirectionalLight(getLedColorHex(ledColor), 1.4);
    eng.rimLight.position.set(-4, 2, -2);
    eng.scene.add(eng.rimLight);

    // Build Model
    if (modelType === "xbot") {
      loadGLTFModel(eng, "/assets/Xbot.glb");
    } else if (modelType === "soldier") {
      loadGLTFModel(eng, "/assets/Soldier.glb");
    } else {
      buildProceduralRobot(eng);
    }

    // Pointer Tracking
    const handlePointerMove = (clientX, clientY) => {
      if (eng.currentState !== "IDLE") return;
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = -(clientY / window.innerHeight) * 2 + 1;
      eng.targetHeadRot.y = normX * 0.52;
      eng.targetHeadRot.x = -normY * 0.38;
      eng.targetEyePos.set(normX * 0.038, normY * 0.028);

      if (eng.gltfModel) {
        eng.targetRootRotY = normX * 0.35;
      }
    };

    const onMouseMove = (e) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    const onResize = () => {
      if (!eng.renderer || !eng.camera || !container) return;
      const w = container.clientWidth || 250;
      const h = container.clientHeight || 175;
      eng.camera.aspect = w / h;
      eng.camera.updateProjectionMatrix();
      eng.renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    const animate = () => {
      eng.animFrameId = requestAnimationFrame(animate);

      const delta = eng.clock.getDelta();
      const t = eng.clock.getElapsedTime();

      if (eng.mixer) {
        eng.mixer.update(delta);
      }

      if (eng.robotRoot) {
        // Idle Breathing
        if (
          eng.currentState === "IDLE" ||
          eng.currentState === "PASSWORD_FOCUS"
        ) {
          eng.robotRoot.position.y = -0.18 + Math.sin(t * 2.2) * 0.015;
          if (eng.leftEar && eng.rightEar) {
            eng.leftEar.rotation.y = Math.sin(t * 1.5) * 0.08;
            eng.rightEar.rotation.y = -Math.sin(t * 1.5) * 0.08;
          }
        } else if (eng.currentState === "CELEBRATE") {
          eng.robotRoot.position.y = -0.18 + Math.abs(Math.sin(t * 8)) * 0.06;
        }

        const lerpSpeed = Math.min(10 * delta, 1.0);
        eng.robotRoot.rotation.y = THREE.MathUtils.lerp(
          eng.robotRoot.rotation.y,
          eng.targetRootRotY,
          lerpSpeed,
        );

        if (eng.headGroup) {
          eng.headGroup.rotation.x = THREE.MathUtils.lerp(
            eng.headGroup.rotation.x,
            eng.targetHeadRot.x,
            lerpSpeed,
          );
          eng.headGroup.rotation.y = THREE.MathUtils.lerp(
            eng.headGroup.rotation.y,
            eng.targetHeadRot.y,
            lerpSpeed,
          );
          eng.headGroup.rotation.z = THREE.MathUtils.lerp(
            eng.headGroup.rotation.z,
            eng.targetHeadRot.z,
            lerpSpeed,
          );
        }

        if (eng.eyeLeft && eng.eyeRight) {
          eng.eyeLeft.position.x = THREE.MathUtils.lerp(
            eng.eyeLeft.position.x,
            -0.18 + eng.targetEyePos.x,
            lerpSpeed,
          );
          eng.eyeLeft.position.y = THREE.MathUtils.lerp(
            eng.eyeLeft.position.y,
            0.04 + eng.targetEyePos.y,
            lerpSpeed,
          );
          eng.eyeRight.position.x = THREE.MathUtils.lerp(
            eng.eyeRight.position.x,
            0.18 + eng.targetEyePos.x,
            lerpSpeed,
          );
          eng.eyeRight.position.y = THREE.MathUtils.lerp(
            eng.eyeRight.position.y,
            0.04 + eng.targetEyePos.y,
            lerpSpeed,
          );

          eng.eyeLeft.scale.x = THREE.MathUtils.lerp(
            eng.eyeLeft.scale.x,
            eng.targetLeftEyeScale.x,
            lerpSpeed,
          );
          eng.eyeLeft.scale.y = THREE.MathUtils.lerp(
            eng.eyeLeft.scale.y,
            eng.targetLeftEyeScale.y,
            lerpSpeed,
          );
          eng.eyeLeft.scale.z = THREE.MathUtils.lerp(
            eng.eyeLeft.scale.z,
            eng.targetLeftEyeScale.z,
            lerpSpeed,
          );

          eng.eyeRight.scale.x = THREE.MathUtils.lerp(
            eng.eyeRight.scale.x,
            eng.targetRightEyeScale.x,
            lerpSpeed,
          );
          eng.eyeRight.scale.y = THREE.MathUtils.lerp(
            eng.eyeRight.scale.y,
            eng.targetRightEyeScale.y,
            lerpSpeed,
          );
          eng.eyeRight.scale.z = THREE.MathUtils.lerp(
            eng.eyeRight.scale.z,
            eng.targetRightEyeScale.z,
            lerpSpeed,
          );
        }

        if (eng.leftArm && eng.rightArm) {
          eng.leftArm.position.x = THREE.MathUtils.lerp(
            eng.leftArm.position.x,
            eng.targetLeftArm.posX,
            lerpSpeed,
          );
          eng.leftArm.position.y = THREE.MathUtils.lerp(
            eng.leftArm.position.y,
            eng.targetLeftArm.posY,
            lerpSpeed,
          );
          eng.leftArm.position.z = THREE.MathUtils.lerp(
            eng.leftArm.position.z,
            eng.targetLeftArm.posZ,
            lerpSpeed,
          );
          eng.leftArm.rotation.x = THREE.MathUtils.lerp(
            eng.leftArm.rotation.x,
            eng.targetLeftArm.rotX,
            lerpSpeed,
          );
          eng.leftArm.rotation.y = THREE.MathUtils.lerp(
            eng.leftArm.rotation.y,
            eng.targetLeftArm.rotY,
            lerpSpeed,
          );
          eng.leftArm.rotation.z = THREE.MathUtils.lerp(
            eng.leftArm.rotation.z,
            eng.targetLeftArm.rotZ,
            lerpSpeed,
          );

          eng.rightArm.position.x = THREE.MathUtils.lerp(
            eng.rightArm.position.x,
            eng.targetRightArm.posX,
            lerpSpeed,
          );
          eng.rightArm.position.y = THREE.MathUtils.lerp(
            eng.rightArm.position.y,
            eng.targetRightArm.posY,
            lerpSpeed,
          );
          eng.rightArm.position.z = THREE.MathUtils.lerp(
            eng.rightArm.position.z,
            eng.targetRightArm.posZ,
            lerpSpeed,
          );
          eng.rightArm.rotation.x = THREE.MathUtils.lerp(
            eng.rightArm.rotation.x,
            eng.targetRightArm.rotX,
            lerpSpeed,
          );
          eng.rightArm.rotation.y = THREE.MathUtils.lerp(
            eng.rightArm.rotation.y,
            eng.targetRightArm.rotY,
            lerpSpeed,
          );
          eng.rightArm.rotation.z = THREE.MathUtils.lerp(
            eng.rightArm.rotation.z,
            eng.targetRightArm.rotZ,
            lerpSpeed,
          );
        }

        if (eng.matBlush) {
          eng.matBlush.opacity = THREE.MathUtils.lerp(
            eng.matBlush.opacity,
            eng.targetBlushOpacity,
            lerpSpeed,
          );
        }

        // Blinking
        eng.blinkTimer += delta;
        if (
          eng.blinkTimer > 3.5 &&
          eng.currentState === "IDLE" &&
          eng.eyeLeft &&
          eng.eyeRight
        ) {
          eng.eyeLeft.scale.y = 0.1;
          eng.eyeRight.scale.y = 0.1;
          setTimeout(() => {
            if (eng.currentState === "IDLE" && eng.eyeLeft && eng.eyeRight) {
              eng.eyeLeft.scale.y = 1.18;
              eng.eyeRight.scale.y = 1.18;
            }
          }, 110);
          eng.blinkTimer = 0;
        }
      }

      if (eng.gltfModel) {
        const lerpSpeed = Math.min(10 * delta, 1.0);
        eng.gltfModel.rotation.y = THREE.MathUtils.lerp(
          eng.gltfModel.rotation.y,
          eng.targetRootRotY,
          lerpSpeed,
        );
      }

      eng.renderer.render(eng.scene, eng.camera);
    };

    animate();

    return () => {
      if (eng.animFrameId) cancelAnimationFrame(eng.animFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (eng.renderer) eng.renderer.dispose();
    };
  }, [modelType]);

  return (
    <div
      className={`astro-robot-avatar-wrapper ${className}`}
      id="robot-wrapper"
    >
      {/* Animated Speech Bubble */}
      <div
        className={`astro-robot-speech-bubble ${speechVisible ? "visible" : ""}`}
        aria-live="polite"
      >
        <span>{speechText}</span>
      </div>

      {/* Three.js 3D WebGL Canvas */}
      <div className="astro-three-canvas-container" ref={containerRef}>
        <canvas ref={canvasRef} id="astro-robot-canvas" />
      </div>
    </div>
  );
});

export default AstroBotAuthMascot;
