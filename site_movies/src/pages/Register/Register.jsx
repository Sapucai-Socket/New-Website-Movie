import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';

const Register = () => {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const adcUsuario = async (uid) => {
        try {
            const docRef = await addDoc(collection(db, "users"), {
                id_usr: uid,
                nome_usr: nomeUsuario
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                toast.success(`Sucesso! Você é o ${user.email}.\nPor favor, faça login.`);
                adcUsuario(user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    toast.error('E-mail já registrado');
                } else if (errorCode === 'auth/weak-password') {
                    toast.error('A senha deve conter no mínimo 6 caracteres');
                } else {
                    toast.error(`${errorCode}\n${errorMessage}`);
                }
            });
            
    };

    return (
        <>
            <ToastContainer />

            <body className="body-login">
                <div className="mayn-layout">
                    <div className="header">
                        <div className="header-login">
                            <div className="logo">
                                <a href="/">
                                    <img src="/images/cine.png" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="login_body">
                        <div className="login_box">
                            <h2>Registrar-se</h2>
                            <form onSubmit={signUp}>
                                <div className="input_box">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Usuário"
                                        value={nomeUsuario}
                                        onChange={(e) => setNomeUsuario(e.target.value)}
                                    />
                                </div>

                                <div className="input_box">
                                    <input
                                        required
                                        type="email"
                                        placeholder="E-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="input_box">
                                    <input
                                        required
                                        type="password"
                                        placeholder="Senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <button className="submit" onClick={signUp}>
                                        Entrar
                                    </button>
                                </div>
                            </form>

                            <div className="support">
                                <div className="remember">
                                    <span>
                                        <input
                                            type="checkbox"
                                            style={{ margin: 0, padding: 0, height: '13px' }}
                                        />
                                    </span>
                                    <span>Lembre-se de mim</span>
                                </div>
                                <div className="help">
                                    <a href="#">Precisa de ajuda?</a>
                                </div>
                            </div>

                            <div className="login_footer">
                                <div className="sign_up">
                                    <p>
                                        Já possui uma conta? <a href="/login">Entre agora.</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </>
    );
};

export default Register;
