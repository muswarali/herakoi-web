# 🎵 Herakoi Sonification Web App

This is an interactive **ReactJS application** that uses **MediaPipe Hands** and **Tone.js** to turn index finger position into sound based on background image color.

## 🧠 Features

- 🖐️ Detects only the **right hand**
- 🎯 Tracks the **index fingertip** (landmark 8)
- 🖼️ Upload any image to use as background
- 🎶 Sonifies fingertip color (Hue → pitch, Value → volume)
- 📷 Uses **MediaPipe Hands** 
- 🎵 Built with **Tone.js** for real-time sound synthesis
- 🎨 Styled using **Material UI (MUI)**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/muswarali/herakoi-web.git
cd herakoi-sonification
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## 📦 Technologies Used

- [React](https://reactjs.org/)
- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands)
- [Tone.js](https://tonejs.github.io/)
- [Material UI](https://mui.com/)
- [React Webcam](https://www.npmjs.com/package/react-webcam)

---

## 🧑‍💻 Folder Structure

```
src/
├── components/        # UI components (Canvas, Controls, Header)
├── hooks/             # Custom hook for hand detection
├── img/               # Background sample images
├── App.js             # Main app structure
├── theme.js           # MUI Theme config
├── index.js           # Entry point
├── public/index.html  # Main HTML file
```

---

## 🌍 Live Demo

> Coming soon via Vercel or Netlify deployment 🚀

---

