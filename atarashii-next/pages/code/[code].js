import React from 'react';

import { withRouter } from 'next/router'

import { server } from './../../config/index';
import AppContext from './../../miscellaneous/appContext';

import io from 'socket.io-client';
let socket;

class FastLogin extends React.Component {
    static contextType = AppContext;

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props || this.props.router.ready) {
            this.connectToSocket(this.props.router.query);
        }
    }
    componentDidMount() {
        this.connectToSocket(this.props.router.query);
    }

    async connectToSocket(query) {
        if (this.context.token === undefined) {
            this.context.openAlert({type: 'error', message: 'You must be logged in to use this feature.'});
            this.props.router.push('/login');
            return;
        }
        await fetch(server + '/api/user/fastLogin')
        socket = io();
        
        socket.emit('joinRoom', {id: query.code});
        socket.on('connectSuccessfull', () => {
            socket.emit('emitToken', {token: this.context.token, room: query.code});
        });
        socket.on('roomNotFound', () => {
            this.context.openAlert({type: 'error', message: 'Login failed. Device not found.'});
            this.props.router.push('/');
        });
        socket.on('invalidToken', () => {
            this.context.openAlert({type: 'error', message: 'Login failed. Invalid token.'});
            this.props.router.push('/login');
        });
        socket.on('closeRoom', () => {
            console.log('close');
            this.props.router.push('/');
        });
    }

    render() {
        return (
            <p>Trying to login. Please wait. You will be redirected!</p>
        )
    }
}

export default withRouter(FastLogin);