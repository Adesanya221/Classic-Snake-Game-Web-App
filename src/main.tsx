import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import FirebaseInitializer from './components/FirebaseInitializer'

createRoot(document.getElementById("root")!).render(
  <FirebaseInitializer>
    <App />
  </FirebaseInitializer>
);
