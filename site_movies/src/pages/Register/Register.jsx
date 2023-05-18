
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
//import { auth } from "../firebase"
//import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(`Sucessou! Você é o ${user.email}.\nPor favor, faça login.`);
                alert(`Sucessou! Você é o ${user.email}.\nPor favor, faça login.`);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`${errorCode}\n${errorMessage}`);
            });
    }


    return (
        <>
            <body className="body-login">
                <div className="mayn-layout">
                    <div className="header">
                        <div className="header-login">
                            <div className="logo">
                                <a href="#">
                                    <img src="./public/images/cine.png" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="login_body">
                        <div className="login_box">
                            <h2>Registrar-se</h2>
                            <form onSubmit={signUp}>
                                <div className="input_box">
                                    <input required type="user" placeholder="Usuário" />
                                </div>

                                <div className="input_box">
                                    <input required type='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="input_box">
                                    <input required type='password' placeholder='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <div>
                                    <button className="submit">Entrar</button>
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
                                        Já possui uma conta?{' '}
                                        <a href="/login">Entre agora.</a>
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
