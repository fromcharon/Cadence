import './App.css';
import Login from './Login'
import Register from './Register'
import HabitList from './HabitList';
import { useState, useEffect } from 'react';
import Dashboard from './DashBoard';
import Profile from './ProfilePage';
import NavBar from './NavBar';
import { LogOut } from 'lucide-react'

function App() {
  const [isLoggedIn, setLoginState] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  
  useEffect(() => {
    async function checkAuth(){
    try{
        const response = await fetch('http://localhost:3000/auth/check', {
            credentials: 'include'
        });

        if (response.ok) {
          setLoginState(true);
          }
        }

    catch(err) {
        console.error(err);
      }
    }
    checkAuth();
  }, []);

  function handleLoginSuccess() {
    setLoginState(true);
}
  return (
  <div className='app-bg'>
    {isLoggedIn 
      ? <div className="app-container">
          <NavBar className="navbar" onCurrentView={setCurrentView} activeView={currentView}/>
          <button onClick={() => setLoginState(false)} className='logout-btn'><LogOut size={20} /></button>
          {currentView === 'home' && <Dashboard />}
          {currentView === 'habits' && <HabitList/>}
          {currentView === 'profile' && <Profile />}
        </div>
      : <div className="auth-container">
          <div className="auth-branding">
            <h1>Build Better Habits.</h1>
            <p>A simple self-improvement tool by Charon.</p>
          </div>
          <div className='auth-card-wrapper'>
            {showLogin 
              ? <Login onLoginSuccess={handleLoginSuccess} onSwitchToLogin={setShowLogin}/>
              : <Register onLoginSuccess={handleLoginSuccess} onSwitchToLogin={setShowLogin}/>
            }
          </div>
        </div>
    }
  </div>
);
}

export default App;