import { useState } from 'react';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    async function handleLogin() {   
        if (!email) {
            setLoginError("Email is incorrect!");
            return 
        }
        if (!password) {
            setLoginError("Password is incorrect!");
            return 
        }
        
        try{
        const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, password: password })
        });
        if (response.ok) {
            props.onLoginSuccess();
        }

        else{
            const data = await response.json();
            setLoginError(data.error);
        }
    }   
        catch(err) {
            console.error(err);
            setLoginError("Something Went Wrong!");
        }
}
    

    return (
    <div id='login-form' className='glass-card auth-card'>
        <h2 className='auth-title'>Login</h2>
                <div className='auth-inputs'>
                    <div className='input-wrapper'>
                        <span className='input-icon'>@</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter Email" id="login-input-email" className="input-glass"/>
                    </div>
                    <div className='input-wrapper'>
                        <span className='input-icon'>⚿</span>
                        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter Password" id="login-input-password" autoComplete="off" className="input-glass"/>
                        <button onClick={null} className='btn-forgot'>Forgot?</button>
                    </div>
                </div>

                <p id="login-error" className="error-text">{loginError}</p>

                <button onClick={handleLogin} className="btn-primary auth-btn">
                    Login
                </button>

                <div className='auth-switch'>
                    <span>Not Registered?</span>
                    <button onClick={() => props.onSwitchToLogin(false)} className="btn-ghost">
                        Register
                    </button>
                </div>
    </div>
    )
}

export default Login;