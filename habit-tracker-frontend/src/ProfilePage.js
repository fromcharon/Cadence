import { useState, useEffect } from 'react';
import './Profile.css';
import './App.css';

function Profile() {
  const [userName, setUserName] = useState(''); 
  const [dateJoined, setDateJoined] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');  

  async function getProfileInfo() {
    try {
      const response = await fetch(`http://localhost:3000/profileinfo`, {
                credentials: 'include',
            });

            if (!response.ok) {
              console.log("failed to fetch User Info");
            }
            const profileInfo = await response.json();
            setUserName(profileInfo.username)
            setDateJoined(profileInfo.created_at.split('T')[0])
            setRegisteredEmail(profileInfo.email)
            console.log(`Info Recd.: ${JSON.stringify(profileInfo)}`);
            return
    }
    catch(err) {
      console.error(err);
    }
  }

  getProfileInfo();

  return(
    <div>
      <div id='profile-page' className='main-layout'>
        <h1>Profile</h1>
        <div className='profile-card'>
          <div className='profile-info'>
            <h2>{userName}</h2>
            <p>Joined on: {dateJoined}</p>
            <p>Registered Email: {registeredEmail}</p>
          </div>
          <div className='profile-image'>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile;