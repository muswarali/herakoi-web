// components/CanvasDisplay.js
import React from 'react';
import Webcam from 'react-webcam';

const CanvasDisplay = ({ webcamRef, canvasRef }) => {
  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          width: 640,
          height: 480,
          visibility: 'hidden',
          transform: 'scaleX(-1)',
        }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position: 'relative',
          width: 640,
          height: 480,
          transform: 'scaleX(-1)',
        }}
      />
    </div>
  );
};

export default CanvasDisplay;
