// App.js
import React, { useRef, useState } from 'react';
import { ThemeProvider, Container, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Controls from './components/Controls';
import CanvasDisplay from './components/CanvasDisplay';
import useHandDetection from './hooks/useHandDetection';
import theme from './theme';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const synthRef = useRef(null);

  
  useHandDetection({ webcamRef, canvasRef, image, isAudioInitialized, synthRef });


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Controls
          setImage={setImage}
          isAudioInitialized={isAudioInitialized}
          setIsAudioInitialized={setIsAudioInitialized}
          synthRef={synthRef}
        />
        <CanvasDisplay webcamRef={webcamRef} canvasRef={canvasRef} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
