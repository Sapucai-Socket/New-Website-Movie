import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';
import "react-toastify/dist/ReactToastify.css";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const adcUsuarioViaGoogle = async (uid, displayName) => {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!(userSnap.exists())) {
            try {
                await setDoc(doc(db, "users", uid), {
                    id_usr: uid,
                    nome_usr: displayName,
                    descricao: '',
                    fav: {},
                    review: {}
                });

                console.log('Data added to Firestore with custom document ID:', uid);
            } catch (error) {
                console.error('Error adding data:', error);
                toast.error('Falha no registro.');
            }
        }
        /*
        try {
            await setDoc(doc(db, "users", uid), {
                id_usr: uid,
                nome_usr: displayName,
                descricao: '',
                fav: {},
                review: {}
            });

            console.log('Data added to Firestore with custom document ID:', uid);
        } catch (error) {
            console.error('Error adding data:', error);
            toast.error('Falha no registro.');
        }
        */
    }

    const handleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                adcUsuarioViaGoogle(result.user.uid, result.user.displayName);
                navigate('/');
            })
            .catch(error => {
                toast.error('Falha no login via Google.\nContate o adminstrador.');
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
                                <ol className="googleSubmit">
                                    <div className="googleImg"><i className="fa-brands fa-google"></i></div>
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
