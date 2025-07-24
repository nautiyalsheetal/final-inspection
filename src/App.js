import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Loginpage from './components/login-page';
import Navbar from './components/navbar'
import Dashboard from './components/dashboard';
import Inspectiontable from './components/inspectiontable';

// import Navbar from './components/navbar.css'; 




function App() {
  return (
   <>
       <Router>
       
        <Routes>
          {/* <Route path="/" element={<Loginpage />} /> */}

          <Route path="/" element={<Loginpage />}/>
          <Route path="/nav-bar" element={<Navbar />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
           <Route path="/inspect-table" element={<Inspectiontable />} /> 
        </Routes>
      
   </Router>
   </>
  );
}

export default App;


