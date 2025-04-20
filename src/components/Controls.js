// components/Controls.js
import React from 'react';
import { Button, Stack } from '@mui/material';
import * as Tone from 'tone';

const Controls = ({ setImage, isAudioInitialized, setIsAudioInitialized, synthRef }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const initializeAudio = async () => {
    if (!isAudioInitialized) {
      await Tone.start(); // Start the audio context
      synthRef.current = new Tone.Synth().toDestination(); // Create and assign synth
      setIsAudioInitialized(true); // Mark as initialized
    }
  };

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
      <Button variant="contained" component="label">
        Upload Background
        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
      </Button>
      <Button
        variant="outlined"
        onClick={initializeAudio}
        disabled={isAudioInitialized}
      >
        Initialize Audio
      </Button>
    </Stack>
  );
};

export default Controls;
