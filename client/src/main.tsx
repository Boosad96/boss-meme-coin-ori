import { createRoot } from "react-dom/client";
import { sdk } from '@farcaster/miniapp-sdk';
import App from "./App";
import "./index.css";

// Initialize Farcaster Mini App
async function initializeFarcasterMiniApp() {
  try {
    // Signal that the app is ready to display
    await sdk.actions.ready();
    console.log('Farcaster Mini App SDK initialized successfully');
  } catch (error) {
    console.log('Not running in Farcaster context:', error);
  }
}

// Render the app
createRoot(document.getElementById("root")!).render(<App />);

// Initialize SDK after app is rendered
window.addEventListener('load', initializeFarcasterMiniApp);
