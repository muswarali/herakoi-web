// hooks/useHandDetection.js
import { useEffect, useRef, useCallback } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { HAND_CONNECTIONS, Hands } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as Tone from 'tone';

const useHandDetection = ({ webcamRef, canvasRef, image, isAudioInitialized, synthRef }) => {
  const handsRef = useRef(null);
  
  const lastProcessedRef = useRef(Date.now());





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

  const handleSonification = useCallback((landmarks) => {
    const timer = setTimeout(() => {
      if (!isAudioInitialized) return;
      console.log(landmarks);

      if (landmarks && landmarks.length > 0) {
        const fingertip = landmarks[8];
        console.log(fingertip);
        if (canvasRef.current && fingertip) {
          const ctx = canvasRef.current.getContext('2d');
          const pixelData = ctx.getImageData(
            fingertip.x * canvasRef.current.width,
            fingertip.y * canvasRef.current.height,
            1, 1
          ).data;

          const [r, g, b] = pixelData;
          const hsv = rgbToHsv(r, g, b);

          const pitch = Tone.Frequency(hsv[0] / 2 + 60, 'midi').toNote();
          const volume = hsv[2] / 255;

          if (synthRef.current) {
            synthRef.current.triggerAttackRelease(pitch, '8n', undefined, volume);
          }
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAudioInitialized, canvasRef,synthRef]);

  const onResults = useCallback((results) => {
    const now = Date.now();

    if (now - lastProcessedRef.current > 400) {
      lastProcessedRef.current = now;

      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (image) drawBackgroundImage();

      if (
        results.multiHandLandmarks &&
        results.multiHandedness &&
        results.multiHandedness.length > 0
      ) {
        const handedness = results.multiHandedness[0].label;
        const correctedHandedness = handedness === 'Left' ? 'Right' : 'Left';

        if (correctedHandedness === 'Right') {
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 0.5,
            });
            drawLandmarks(ctx, landmarks, {
              color: '#FF0000',
              lineWidth: 0.2,
            });
          }

          handleSonification(results.multiHandLandmarks[0]);
        }
      }
    }
  }, [canvasRef, image, drawBackgroundImage, handleSonification]);

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

      hands.onResults(onResults);
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
        camera.start();
      }

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

  useEffect(() => {
    if (image) drawBackgroundImage();
  }, [image, drawBackgroundImage]);
};

export default useHandDetection;
