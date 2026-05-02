import './NavBar.css'
import { Home, ListChecks, User } from 'lucide-react'

function NavBar(props) {



    return(
        <div className='navbar'>
            <button className={props.activeView === 'home' ? 'active' : ''} onClick={() => props.onCurrentView('home')}>
                <Home size={20} />
                </button>
            <button className={props.activeView === 'habits' ? 'active' : ''} onClick={() => props.onCurrentView('habits')}>
                <ListChecks size={20}/>
                </button>
            <button className={props.activeView === 'profile' ? 'active' : ''} onClick={() => props.onCurrentView('profile')}>
                <User size={20}/>
                </button>
        </div>
)}

export default NavBar;