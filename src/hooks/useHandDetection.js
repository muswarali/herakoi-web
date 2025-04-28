// hooks/useHandDetection.js
// This custom hook manages hand tracking, canvas drawing, and color-to-sound sonification
// using MediaPipe Hands and Tone.js.

import { useEffect, useRef, useCallback } from 'react';
import { Camera } from '@mediapipe/camera_utils'; // MediaPipe helper for webcam input
import { HAND_CONNECTIONS, Hands } from '@mediapipe/hands'; // MediaPipe Hands solution
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'; // MediaPipe drawing utilities
import * as Tone from 'tone'; // Tone.js for audio generation

/**
 * useHandDetection Hook
 * 
 * Props:
 * - webcamRef: Reference to the webcam element.
 * - canvasRef: Reference to the canvas element where landmarks are drawn.
 * - image: Uploaded background image (base64).
 * - isAudioInitialized: Boolean indicating if audio context is ready.
 * - synthRef: Reference to the Tone.js Synth for sound output.
 * 
 * What it does:
 * - Initializes MediaPipe Hands for real-time hand detection.
 * - Draws the uploaded image and hand landmarks on the canvas.
 * - Detects fingertip (index finger) color and triggers corresponding audio notes.
 */
const useHandDetection = ({ webcamRef, canvasRef, image, isAudioInitialized, synthRef }) => {
  const handsRef = useRef(null); // Reference to the MediaPipe Hands instance
  const lastProcessedRef = useRef(Date.now()); // To throttle the processing rate (every 80ms)

  /**
   * Draws the uploaded background image onto the canvas, scaled to fit while maintaining aspect ratio.
   */
  const drawBackgroundImage = useCallback(() => {
    if (canvasRef.current && image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
    }
  }, [image, canvasRef]);

  /**
   * Converts RGB color values to HSV color space.
   * Useful to map hue/brightness to pitch and volume for sonification.
   */
  const rgbToHsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return [h * 360, s * 100, v * 100];
  };

  /**
   * Handles converting fingertip color data into a sound event.
   * Extracts pixel color where index finger tip is located and maps it to sound pitch and volume.
   */
  const handleSonification = useCallback((landmarks) => {
    const timer = setTimeout(() => {
      if (!isAudioInitialized) return;

      if (landmarks && landmarks.length > 0) {
        const fingertip = landmarks[8]; // Index fingertip landmark

        if (canvasRef.current && fingertip) {
          const ctx = canvasRef.current.getContext('2d');
          const pixelData = ctx.getImageData(
            fingertip.x * canvasRef.current.width,
            fingertip.y * canvasRef.current.height,
            1, 1
          ).data; // Get the color under fingertip

          const [r, g, b] = pixelData;
          const hsv = rgbToHsv(r, g, b); // Convert to HSV

          const pitch = Tone.Frequency(hsv[0] /5 + 10 , 'midi').toNote(); // Map hue to musical note
          const volume = hsv[2] /100; // Map brightness to volume

          if (synthRef.current) {
            synthRef.current.triggerAttackRelease(pitch, '8n', undefined, volume);
          }
        }
      }
    }, 20); // Delay for smoother processing

    return () => clearTimeout(timer);
  }, [isAudioInitialized, canvasRef, synthRef]);

  /**
   * Handles results from MediaPipe Hands.
   * Draws landmarks and triggers sonification if a right hand is detected.
   */
  const onResults = useCallback((results) => {
    const now = Date.now();

    if (now - lastProcessedRef.current > 90) { // Throttle frame processing
      lastProcessedRef.current = now;

      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (image) drawBackgroundImage(); // Redraw background if needed

      if (
        results.multiHandLandmarks &&
        results.multiHandedness &&
        results.multiHandedness.length > 0
      ) {
        const handedness = results.multiHandedness[0].label;
        const correctedHandedness = handedness === 'Left' ? 'Right' : 'Left'; // Correct mirror view

        if (correctedHandedness === 'Right') {
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 0.5,
            }); // Draw finger connections
            drawLandmarks(ctx, landmarks, {
              color: '#FF0000',
              lineWidth: 0.2,
            }); // Draw landmarks

            handleSonification(landmarks); // Trigger sound based on fingertip
          }
        }
      }
    }
  }, [canvasRef, image, drawBackgroundImage, handleSonification]);

  /**
   * Initializes MediaPipe Hands and starts the webcam input.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults); // Attach the results callback
      handsRef.current = hands;

      let camera;
      if (webcamRef.current && webcamRef.current.video) {
        camera = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            if (webcamRef.current && webcamRef.current.video) {
              await hands.send({ image: webcamRef.current.video });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start(); // Start camera capture
      }

      // Clean up on component unmount
      return () => {
        if (camera) camera.stop();
        if (handsRef.current) {
          handsRef.current.close();
          handsRef.current = null;
        }
      };
    }, 0);

    return () => clearTimeout(timer);
  }, [onResults, webcamRef]);

  /**
   * Redraw background image when it changes.
   */
  useEffect(() => {
    if (image) drawBackgroundImage();
  }, [image, drawBackgroundImage]);
};

export default useHandDetection;
