// components/Controls.js
// This component provides user controls to upload an image and initialize audio playback (synthesizer).

import React from 'react';
import { Button, Stack } from '@mui/material'; // Material UI components
import * as Tone from 'tone'; // Tone.js library for audio synthesis

/**
 * Controls Component
 * 
 * Props:
 * - setImage: Function to update the uploaded background image in parent state.
 * - isAudioInitialized: Boolean indicating if the audio context has been initialized.
 * - setIsAudioInitialized: Function to update the audio initialization status.
 * - synthRef: Reference object to store the created Tone.js Synth.
 * 
 * What it does:
 * - Allows user to upload a background image, which will later be used for color detection.
 * - Provides a button to initialize the Tone.js audio context and synthesizer (necessary due to browser restrictions).
 */
const Controls = ({ setImage, isAudioInitialized, setIsAudioInitialized, synthRef }) => {

  // Handle image upload event
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader(); // Create a file reader
      reader.onload = (e) => setImage(e.target.result); // Set uploaded image as base64 data URL
      reader.readAsDataURL(file); // Read file as Data URL
    }
  };

  // Initialize audio context and synth
  const initializeAudio = async () => {
    if (!isAudioInitialized) {
      await Tone.start(); // Start/resume the audio context (required by modern browsers after user interaction)
      synthRef.current = new Tone.Synth().toDestination(); // Create a simple synth and connect it to output
      setIsAudioInitialized(true); // Mark audio as initialized
    }
  };

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
      {/* Upload Button */}
      <Button variant="contained" component="label">
        Upload Background
        <input 
          type="file" 
          accept="image/*" 
          hidden 
          onChange={handleImageUpload} // Trigger image upload handler
        />
      </Button>

      {/* Initialize Audio Button */}
      <Button
        variant="outlined"
        onClick={initializeAudio} // Trigger audio initialization
        disabled={isAudioInitialized} // Disable if already initialized
      >
        Initialize Audio
      </Button>
    </Stack>
  );
};

export default Controls;
