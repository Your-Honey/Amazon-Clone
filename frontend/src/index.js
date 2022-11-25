import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from "./Store";

ReactDOM.render(
  <StoreProvider>
    <HelmetProvider>
      <PayPalScriptProvider deferLoading={true}>
           <App />
      </PayPalScriptProvider>
    </HelmetProvider>
  </StoreProvider> ,document.getElementById("root"));

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import App from './App';


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//     <HelmetProvider>
//       <App />
//     </HelmetProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );