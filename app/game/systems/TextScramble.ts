// FILE: /app/game/systems/TextScramble.ts

/**
 * TextScramble — animates text revealing character-by-character
 * with a random cipher scramble effect.
 * Works with DOM elements in React overlays.
 */

const CHARS = "!<>-_\\/[]{}—=+*^?#________abcdefghijklmnopqrstuvwxyz0123456789";

interface ScrambleOptions {
  duration?: number;          // Total animation duration in ms (default: 1200)
  revealDelay?: number;       // Delay before starting (default: 0)
  charRevealSpeed?: number;   // How fast each char is revealed (default: 50ms per char)
  onComplete?: () => void;
}

export function scrambleText(
  element: HTMLElement,
  targetText: string,
  options: ScrambleOptions = {}
) {
  const {
    duration = 1200,
    revealDelay = 0,
    charRevealSpeed = 40,
    onComplete,
  } = options;

  let frame = 0;
  let frameReq: number;
  let startTime: number | null = null;
  const length = targetText.length;

  const update = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    // Number of characters to reveal so far
    const revealedCount = Math.min(
      length,
      Math.floor(elapsed / charRevealSpeed)
    );

    let output = "";

    for (let i = 0; i < length; i++) {
      if (i < revealedCount) {
        // Revealed: show actual character
        output += targetText[i];
      } else {
        // Scrambling: random cipher char
        output += targetText[i] === " "
          ? " "
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    element.textContent = output;

    if (revealedCount < length) {
      frameReq = requestAnimationFrame(update);
    } else {
      element.textContent = targetText;
      onComplete?.();
    }
  };

  const start = () => {
    cancelAnimationFrame(frameReq);
    startTime = null;
    frameReq = requestAnimationFrame(update);
  };

  if (revealDelay > 0) {
    setTimeout(start, revealDelay);
  } else {
    start();
  }

  // Return cleanup function
  return () => cancelAnimationFrame(frameReq);
}

/**
 * React hook version
 */
export function useScramble(
  text: string,
  trigger: boolean,
  options: ScrambleOptions = {}
) {
  if (typeof window === "undefined") return { ref: null };

  // Return a ref callback
  const refCallback = (el: HTMLElement | null) => {
    if (!el || !trigger) return;
    scrambleText(el, text, options);
  };

  return { ref: refCallback };
}

/**
 * Phaser Text scramble — for use with Phaser.GameObjects.Text
 */
export function scramblePhaserText(
  textObject: { setText: (t: string) => void },
  targetText: string,
  charRevealSpeed = 40
): Promise<void> {
  return new Promise((resolve) => {
    const length = targetText.length;
    let revealed = 0;

    const interval = setInterval(() => {
      let output = "";
      for (let i = 0; i < length; i++) {
        if (i < revealed) {
          output += targetText[i];
        } else {
          output +=
            targetText[i] === " "
              ? " "
              : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      textObject.setText(output);
      revealed++;

      if (revealed > length) {
        clearInterval(interval);
        textObject.setText(targetText);
        resolve();
      }
    }, charRevealSpeed);
  });
}
