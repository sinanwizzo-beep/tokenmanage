import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { ToastContainer } from './components/Toast';
import Home from './views/Home/Home';
import Kiosk from './views/Kiosk/Kiosk';
import Admin from './views/Admin/Admin';
import Login from './views/Login/Login';
import Display from './views/Display/Display';

function App() {
  return (
    <QueueProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kiosk" element={<Kiosk />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/display" element={<Display />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </QueueProvider>
  );
}

export default App;
