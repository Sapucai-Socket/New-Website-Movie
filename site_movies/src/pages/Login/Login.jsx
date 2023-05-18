import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

function Login() {
    const [user, setUser] = useState(null)

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                setUser(loggedUser);
                navigate('/'); // navigate to the Home page
            })
            .catch(error => {
                console.log(error)
            });
    }

    // botão sair
    const handleSignOut = () => {
        signOut(auth).then((result) => {
            // Sign-out successful.
            console.log(result)
            setUser(null)
        }).catch((error) => {
            // An error happened.
            console.log(error);
        });
    }

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(userCredential);
                navigate("/");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);

            });

    }

    return (
        <body className="body-login">
            <div className="mayn-layout">
                <div className="header-login">
                    <div className="logo">
                        <a href="#">
                            <img src="./public/images/cine.png" alt="" />
                        </a>
                    </div>
                </div>


                <div className="login_body">
                    <div className="login_box">
                        <h2>Entrar</h2>
                        <form onSubmit={signIn}>
                            <div className="input_box">
                                <input required type='email' placeholder='Enter your e-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="input_box">
                                <input required type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div>
                                <button className="submit">
                                    Entrar
                                </button>
                            </div>
                        </form>

                        <div className="support">
                            <div className="remember">
                                <span><input type="checkbox" style={{ margin: '0', padding: '4', height: '13px' }} /></span>
                                <span>Lembre-se de mim</span>
                            </div>
                            <div className="help">
                                <p>Precisa de <a href="#">ajuda?</a></p>

                            </div>
                        </div>
                        <div className="sign_up">
                            <p>Ainda não possui uma conta? <a href="/Register">Crie uma!</a></p>

                        </div>

                        <div className="login_footer">

                            <button onClick={handleSignIn}>
                                <ol class="googleSubmit">
                                    <div class="googleImg"><i className="fa-brands fa-google"></i></div>
                                    <p>Login através do Google</p>
                                </ol>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </body>
    );
}

export default Login;
