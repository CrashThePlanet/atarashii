import React from 'react';
import loginStyle from './../../styles/Login.module.css';
import Input from '../../components/input';
import Button from '../../components/button';

import Divider from '@mui/material/Divider';

import Link from 'next/link'
import { useRouter } from 'next/router';

import { server } from '../../config/index';
import AppContext from '../../miscellaneous/appContext';

import { useCookies } from 'react-cookie';

import QRCode from 'qrcode.react'

import io from 'socket.io-client';
let socket;



export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [fastID, setFastID] = React.useState('');

    const openAlert = React.useContext(AppContext).openAlert;
    const updateToken = React.useContext(AppContext).updateToken;

    const [cookies, setCookie] = useCookies(["token"]);

    const router = useRouter();

    let gSocket;

    const handleEmailChange = (e) => setEmail(e)
    const handlePasswordChange = (e) => setPassword(e)

    async function handleSubmit(e) {
        e.preventDefault();
        await fetch(server + '/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            res.json()
            .then(data => {
                if (res.status >= 200 && res.status < 300) {
                    openAlert({type: 'success', statusCode: res.status, message: data.success});
                    setCookie("token", data.token, {
                        path: "/",
                        secure: true,
                        maxAge: 2592000
                    });
                    router.push('/');
                    return;
                }
                openAlert({type: 'error', statusCode: res.status, message: data.error});
            });
        }).catch(err => {
            console.log(err);
            this.context.opelAlert({type: 'error', message: 'Networkerror occured'});
        })
    }

    React.useEffect(async () => {
        try {
            await fetch(server + '/api/user/fastLogin')
            socket = io();
    
            let loginID = (Math.random() + 1).toString(36).substring(6);
    
            socket.emit('checkID', {id: loginID});
    
            socket.on('answerID', data => {
                if (data.result) {
                    setFastID(loginID);
                } else {
                    loginID = (Math.random() + 1).toString(36).substring(6);
                    socket.emit('checkID', {id: loginID});
                }
            });
            socket.on('token', data => {
                updateToken(data.token);
                router.push('/');
                socket.emit('closeRoom', {room: fastID});
                return;
            });
        } catch (error) {
            openAlert({type: 'error', statusCode: 500, message: error.message});
        }
    }, []);

    return (
        <div className="grid place-items-center w-full h-screen">
            <div className="flex flex-row bg-sec p-10 rounded-2xl shadow-lg">
                <div className="flex flex-col">
                    <h1 className="text-5xl mb-4 text-center">Login</h1>
                    <Input
                        label="Email"
                        value={email}
                        type="email"
                        error={email === ''}
                        onChange={handleEmailChange}
                        />
                    <Input
                        label="Password"
                        value={password}
                        type="password"
                        error={password === ''}
                        onChange={handlePasswordChange}
                        />
                    <Button
                        className="mt-4"
                        buttontext="Login"
                        onClick={(e) => handleSubmit(e)}
                    />
                    <p className="mt-2 text-md">
                        <span className="opacity-70">You don&apos;t have a account? Register </span>
                        <span className="underline text-acc"><Link href="/registration">here</Link></span>
                        <span className="opacity-70">.</span>
                    </p>
                </div>
                <Divider orientation='vertical' variant="middle" flexItem className={loginStyle.divider} sx={{borderWidth: 1, borderColor: 'var(--font-color)', opacity: 0.6, borderRadius: 20}} />
                <div>
                    <QRCode 
                        className="mx-auto"
                        value={"http://www.atarashii.til-hempel.com/code/" + fastID}
                        size={144}
                        bgColor="#444444"
                        fgColor="#ffffff"
                    />
                    <h1 className="text-2xl text-center mt-2"><b>{fastID}</b></h1>
                    <p className={loginStyle.infoText + " mt-6"}>Scan this QR Code or enter this Code on a device you&apos;re logged in with to log in.</p>
                </div>
            </div>
        </div>
    )

}