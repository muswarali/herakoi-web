// components/CanvasDisplay.js
// This component manages the webcam feed and canvas display for hand tracking.
// It hides the webcam feed and shows the processed landmarks on a canvas.

import React from 'react';
import Webcam from 'react-webcam'; // React component to capture webcam input

/**
 * CanvasDisplay Component
 * 
 * Props:
 * - webcamRef: Reference to the Webcam component (to access webcam video frames).
 * - canvasRef: Reference to the Canvas element (to draw hand landmarks or any processed output).
 * 
 * What it does:
 * - Captures live webcam feed using react-webcam.
 * - Hides the webcam video (makes it invisible).
 * - Displays a canvas on top where the hand-tracking landmarks will be drawn.
 * - Both webcam and canvas are horizontally flipped (mirrored view).
 */
const CanvasDisplay = ({ webcamRef, canvasRef }) => {
  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      {/* Hidden webcam feed */}
      <Webcam
        ref={webcamRef} // Save reference to access webcam frames
        style={{
          position: 'absolute', // Stack underneath the canvas
          width: 640,
          height: 480,
          visibility: 'hidden', // Hide the webcam, only use its data
          transform: 'scaleX(-1)', // Mirror the webcam for natural hand movements
        }}
      />
      {/* Visible canvas for drawing hand landmarks */}
      <canvas
        ref={canvasRef} // Save reference to draw on canvas
        width={640}
        height={480}
        style={{
          position: 'relative', // On top of the webcam
          width: 640,
          height: 480,
          transform: 'scaleX(-1)', // Mirror canvas to match webcam feed
        }}
      />
    </div>
  );
};

export default CanvasDisplay;
