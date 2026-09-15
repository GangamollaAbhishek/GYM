/**
 * FrameLoader Utility
 * Manages high-performance preloading and memory caching for sequence animations.
 */

export class FrameLoader {
  constructor({
    framePath = "/frames/ezgif-frame-",
    frameCount = 300,
    frameExtension = "jpg",
    digits = 3,
    onProgress = null,
    onComplete = null,
  }) {
    this.framePath = framePath;
    this.frameCount = frameCount;
    this.frameExtension = frameExtension;
    this.digits = digits;
    this.onProgress = onProgress;
    this.onComplete = onComplete;

    this.images = new Array(frameCount);
    this.loadedSet = new Set();
    this.isDestroyed = false;
    this.batchTimer = null;
  }

  formatIndex(index) {
    const frameNum = index + 1; // 1-indexed filenames (001 to 300)
    return String(frameNum).padStart(this.digits, "0");
  }

  getFrameUrl(index) {
    return `${this.framePath}${this.formatIndex(index)}.${this.frameExtension}`;
  }

  loadFrame(index) {
    if (this.images[index] || this.isDestroyed) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.getFrameUrl(index);

    img.onload = () => {
      if (this.isDestroyed) return;
      this.loadedSet.add(index);
      if (this.onProgress) {
        this.onProgress(this.loadedSet.size, this.frameCount);
      }
      if (this.loadedSet.size === this.frameCount && this.onComplete) {
        this.onComplete();
      }
    };

    img.onerror = () => {
      // Mark as attempted to avoid infinite retries
      if (this.isDestroyed) return;
      this.loadedSet.add(index);
    };

    this.images[index] = img;
  }

  startPreloading() {
    // 1. Load critical initial frames (0 to 14) immediately
    const priorityCount = Math.min(15, this.frameCount);
    for (let i = 0; i < priorityCount; i++) {
      this.loadFrame(i);
    }

    // 2. Load evenly spaced keyframes across the sequence (e.g. every 10th frame)
    for (let i = 15; i < this.frameCount; i += 10) {
      this.loadFrame(i);
    }

    // 3. Queue remaining frames in background batches
    let currentIndex = 0;
    const batchSize = 6;

    const loadNextBatch = () => {
      if (this.isDestroyed) return;

      let loadedInBatch = 0;
      while (currentIndex < this.frameCount && loadedInBatch < batchSize) {
        if (!this.loadedSet.has(currentIndex) && !this.images[currentIndex]) {
          this.loadFrame(currentIndex);
          loadedInBatch++;
        }
        currentIndex++;
      }

      if (currentIndex < this.frameCount) {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(() => loadNextBatch(), { timeout: 200 });
        } else {
          this.batchTimer = setTimeout(loadNextBatch, 30);
        }
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => loadNextBatch(), { timeout: 100 });
    } else {
      this.batchTimer = setTimeout(loadNextBatch, 50);
    }
  }

  getFrame(index) {
    const validIndex = Math.max(
      0,
      Math.min(this.frameCount - 1, Math.floor(index)),
    );
    const img = this.images[validIndex];
    if (img && img.complete && img.naturalWidth !== 0) {
      return img;
    }
    return this.getNearestLoadedFrame(validIndex);
  }

  getNearestLoadedFrame(targetIndex) {
    if (this.loadedSet.has(targetIndex) && this.images[targetIndex]?.complete) {
      return this.images[targetIndex];
    }

    for (let offset = 1; offset < this.frameCount; offset++) {
      const prev = targetIndex - offset;
      if (
        prev >= 0 &&
        this.loadedSet.has(prev) &&
        this.images[prev]?.complete &&
        this.images[prev]?.naturalWidth !== 0
      ) {
        return this.images[prev];
      }
      const next = targetIndex + offset;
      if (
        next < this.frameCount &&
        this.loadedSet.has(next) &&
        this.images[next]?.complete &&
        this.images[next]?.naturalWidth !== 0
      ) {
        return this.images[next];
      }
    }
    return null;
  }

  destroy() {
    this.isDestroyed = true;
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    this.images = [];
    this.loadedSet.clear();
  }
}
