import React from 'react';
import Input from '../../components/input';
import Button from '../../components/button';

import Link from 'next/link';

import { server } from '../../config/index';
import AppContext from '../../miscellaneous/appContext';

export default function Registration() {
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);

    const openAlert = React.useContext(AppContext).openAlert;

    const handleEmailChange = (e) => setEmail(e)
    const handlePasswordChange = (e) => setPassword(e)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        if (email.length < 1 || !email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)*$/)) {
            setEmailError(true);
            return;
        }
        if (password.length < 1) {
            setPasswordError(true);
            return;
        }
        await fetch(server + '/api/user/register', {
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
            .then((data) => {
                if (res.status >= 200 && res.status < 300) {
                    openAlert({type: 'success', statusCode: res.status, message: data.success});
                    return;
                }
                openAlert({type: 'error', statusCode: res.status, message: data.error});
            })
        })
        .catch(err => {
            console.log(err);
            openAlert({type: 'error', statusCode: 'Network Error', message: 'Please try again later'});
        });
    }

    return (
        <div className="grid place-items-center w-full h-screen">
            <div className="flex flex-col bg-sec p-10 rounded-2xl shadow-lg">
                <h1 className="text-5xl mb-4 text-center">Registration</h1>
                <Input
                    label="Email"
                    value={email}
                    type="email"
                    required
                    error={!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)*$/) || emailError}
                    onChange={handleEmailChange}
                />
                <Input
                    label="Password"
                    value={password}
                    type="password"
                    required
                    error={password === '' || passwordError}
                    onChange={handlePasswordChange}
                />
                <Button
                    className="mt-4"
                    buttontext="Register"
                    onClick={(e) => handleSubmit(e)}
                />
                <p className="mt-2 text-md">
                    <span className="opacity-70">You already have a account? Login </span>
                    <span className="underline text-acc"><Link href="/login">here</Link></span>
                    <span className="opacity-70">.</span>
                </p>
            </div>
        </div>
    )
}