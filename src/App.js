// App.js
// Main entry point of the application. 
// Sets up the UI layout, manages global state (image, audio), and initializes hand detection logic.

import React, { useRef, useState } from 'react';
import { ThemeProvider, Container, CssBaseline } from '@mui/material'; // Material UI components for styling
import Header from './components/Header'; // Top header of the app
import Controls from './components/Controls'; // Controls for uploading image and starting audio
import CanvasDisplay from './components/CanvasDisplay'; // Canvas to display webcam and hand landmarks
import useHandDetection from './hooks/useHandDetection'; // Custom hook to handle hand tracking
import theme from './theme'; // Custom Material UI theme

function App() {
  // References for webcam and canvas elements
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // State to hold the uploaded image
  const [image, setImage] = useState(null);

  // State to track if audio (sound synthesis) is initialized
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Reference for the audio synth object (Tone.js or similar)
  const synthRef = useRef(null);

  // Custom hook to run hand detection logic
  // Passes necessary refs and states to detect the hand and trigger sound/color interaction
  useHandDetection({ setImage, webcamRef, canvasRef, image, isAudioInitialized, synthRef });

  return (
    <ThemeProvider theme={theme}> {/* Applies the custom Material UI theme */}
      <CssBaseline /> {/* Resets default browser CSS for consistency */}
      <Header /> {/* Top header */}
      <Container maxWidth="md" sx={{ mt: 4 }}> {/* Main container for controls and canvas */}
        <Controls
          setImage={setImage} // Allows the Controls component to update the uploaded image
          isAudioInitialized={isAudioInitialized} // Passes current audio initialization state
          setIsAudioInitialized={setIsAudioInitialized} // Allows Controls to initialize audio
          synthRef={synthRef} // Passes synth reference to Controls for setup
        />
        <CanvasDisplay 
          webcamRef={webcamRef} // Pass webcam reference to capture video feed
          canvasRef={canvasRef} // Pass canvas reference to draw landmarks
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
