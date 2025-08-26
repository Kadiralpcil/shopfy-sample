import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

import Auth from './pages/Auth';
import Home from './pages/Home';

function App() {
  return (
    <AppProvider i18n={{}}>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;