import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                console.log(error);
            });
    }

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Desconectado com sucesso!");
                setUser(null);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(userCredential);
                navigate("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/user-not-found') {
                    toast.error('Usuário não encontrado');
                } else if (errorCode === 'auth/wrong-password') {
                    toast.error('Senha incorreta');
                } else if (errorCode === 'auth/too-many-requests') {
                    toast.error('Conta bloqueada temporariamente devido ao grande número de acessos. Tente novamente mais tarde');
                } else {
                    toast.error(`${errorCode}\n${errorMessage}`);
                }
            });
    }

    return (
        <body className="body-login">
            <div className="mayn-layout">
                <div className="header-login">
                    <div className="logo">
                        <a href="/">
                            <img src="/images/cine.png" alt="" />
                        </a>
                    </div>
                </div>

                <div className="login_body">
                    <div className="login_box">
                        <h2>Entrar</h2>
                        <form onSubmit={signIn}>
                            <div className="input_box">
                                <input required type='email' placeholder='Digite seu e-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="input_box">
                                <input required type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
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
                            <p>Ainda não possui uma conta? <a href="/register">Crie uma!</a></p>
                        </div>

                        <div className="login_footer">
                            <br></br>
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

            <ToastContainer />
        </body>
    );
}

export default Login;
