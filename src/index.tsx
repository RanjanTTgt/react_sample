import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';

import { store } from './store';
import App from './App';
import theme from './theme';
import Toaster from "./components/Toaster";
import Animation from "./components/Animation";
import DialogContainer from "./components/Dialog/DialogContainer";
import "./assets/css/products.css";
import './assets/css/toaster.css';
import "./assets/css/style.css";
import { ScrollToTop } from "./helper";
const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
const persistor = persistStore(store);

root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
            <Toaster />
            <App />
            <Animation />
            <ScrollToTop />
            <DialogContainer />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ThemeProvider>
);
