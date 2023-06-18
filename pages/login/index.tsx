import React from "react"

import {
    Box,
    Typography,
    Checkbox,
    FormControlLabel
} from '@mui/material';

import MotionButton from '@/components/MotionButton/index';
import Input from '@/components/Input';

import { useAppContext } from "@/pages/_app";

//import { redirect } from 'next/navigation'
import { useRouter } from 'next/router';

type LoginProps = {
    context: any,
    router: any
}

class LoginClass extends React.Component<LoginProps> {
    state = {
        username: "",
        create: false
    }
    login = async (): Promise<void> => {
        if (this.state.username.length < 1) return;
        const res = await getLogin(this.state.username, this.state.create);
        console.log(res);
        
        if (res.uuid !== undefined) {
            sessionStorage.setItem('userUUID', res.uuid);
            this.props.router.push('/home');
            return;
        }
        this.props.context.openSnackbar(res.status + ": " + (await res.json()).err ,'error');
    }
    render() {
        return (
            <>
            <Box
                sx={{
                    height: '100vh',
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'primary.main',
                        borderRadius: 5,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%,-50%)',
                        height: 400,
                        width: 300
                    }}
                    className="shadow-xl"
                >
                    <div
                        className="relative h-full flex flex-col items-center"
                    >
                        <Typography
                            variant="h3"
                            className="text-center font-medium"
                            >
                            LOGIN
                        </Typography>
                        <Input
                            className="mt-24"
                            placeholder="username"
                            value={this.state.username}
                            onChange={(e: any) => this.setState({username: e.target.value})}
                        />
                        <FormControlLabel control={
                                <Checkbox
                                    sx={{
                                        color: "primary.light",
                                        '&.Mui-checked': {
                                            color: 'secondary.main'
                                        }
                                    }}
                                    checked={this.state.create}
                                    onChange={() => this.setState({create: !this.state.create})}
                                />
                            }
                            label="Create User if not found" />
                        <MotionButton
                            className="absolute bottom-4"
                            onClick={() => this.login()}
                        >
                            Login
                        </MotionButton>
                    </div>
                </Box>
            </Box>
            </>
        )
    }
}

async function getLogin(username: string, create: boolean = false) {
    const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({username, create})
    });
    if (res.ok) {
        return (await res.json());
    }
    return res;
}

export default function Login() {
    return (
    <LoginClass context={useAppContext()} router={useRouter()} />
    )
}