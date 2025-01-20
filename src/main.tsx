import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'd:/workssw/Project_BEAM_llamaParser/NEW_PROJECT/src/App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
