import { useState } from 'react';

function Register(props) {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    
    async function handleRegister() {
        if (!email) {
            setRegisterError("Email is incorrect!");
            return 
        }
        if (!password) {
            setRegisterError("Password is incorrect!");
            return 
        }
        if (!userName) {
            setRegisterError("Username is Required!");
            return 
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({email: email, password: password, userName: userName})
            })
            if (response.ok) {
                setRegisterError('Registered Successfully');
                props.onLoginSuccess();
            }
            else{
                const data = await response.json();
                setRegisterError(data.error);
            }
        }
        catch(err) {
            console.error(err);
            setRegisterError('Something Went Wrong!');
        }
    }
    
    return (
        <div id="register-form" className='glass-card auth-card register-card'>
            <h2 className='auth-title'>Register</h2>
            <div className='auth-inputs'> 
                <div className='input-wrapper'>
                    <span className='input-icon'>@</span>
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="text" placeholder="Enter Email" id="register-input-email" className="input-glass"/>  
                </div>
                <div className='input-wrapper'>
                    <span className='input-icon'>✦</span>
                    <input value={userName} onChange={(event) => setUserName(event.target.value)} type="text" placeholder="Enter Username" id="register-input-username" className="input-glass"/>
                </div>
                <div className='input-wrapper'>
                    <span className='input-icon'>⚿</span>
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter Password" id="register-input-password" className="input-glass" autoComplete="off"/> 
                </div>
                
                <p className="error-text">{registerError}</p>

                <button onClick={handleRegister} className="btn-primary">
                    Register
                </button>

                <div className='auth-switch'>
                    <span>Already have an Account?</span> 
                    <button onClick={() => props.onSwitchToLogin(true)} className="btn-ghost">
                        Login
                    </button>
                </div>
            </div>
                
        </div>
    )
}

export default Register;