import { YouVersionProvider } from "@youversion/platform-react-ui";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <YouVersionProvider

      appKey="sGSqxfVDLbGG6Sp8nGcJEf1IPxHhHMIRxWjEcivO2Z2i1Vb5"
      theme="light"
      includeAuth={true}
      authRedirectUrl="http://localhost:5173"
    >

      <App />

    </YouVersionProvider>


  </React.StrictMode>
);