import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

const Auth = ({ onClose }) => {
    const [showLogin, setShowLogin] = useState(false);

    const handleSuccess = (user) => {
        if (onClose) {
            onClose(user);
        }
    };

    return (
        <div className="auth-overlay">
            {showLogin ? (
                <>
                <Login onSuccess={handleSuccess} />
                <p>
                    Don't have an account?{' '}
                    <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => setShowLogin(false)}
                    >
                        Register
                    </span>
                </p>
                </>
            ) : (
                <>
                <Register onSuccess={handleSuccess}/>
                <p>
                    Already have an account?{' '}
                    <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => setShowLogin(true)}
                    >
                        Login
                    </span>
                </p>
                </>
            )}
        </div>
    );
};

export default Auth;
