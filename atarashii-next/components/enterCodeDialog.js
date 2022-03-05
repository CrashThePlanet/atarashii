import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
 
import Button from './button';
import Input from './input';

import { withRouter } from 'next/router';

import CardStyle from './../styles/deleteCard.module.css';

class EnterCodeDialog extends React.Component {
    state = {
        code: ''
    }

    StyledDialog = styled(Dialog)({
        '& .MuiPaper-root': {
            backgroundColor: 'var(--secondary-color)'
        }
    });

    redirect() {
        this.props.closeDialog();
        this.props.router.push('/code/' + this.state.code);  
    }
    render() {
        return (
            <this.StyledDialog
                open={true}
                onClose={this.props.closeDialog}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle className="text-center">Enter Login Code</DialogTitle>
                <DialogContent className="flex place-items-center flex-col">
                    <Input className="mx-auto w-3/5" label="enter login code" onChange={(value) => this.setState({code: value})} />
                    <p className="opacity-60 leading-tight mt-2">Please enter the code you&apos;ll see on your device you try to login with. The code is placed on the right side right below the QR-Code.</p>
                </DialogContent>
                <DialogActions className={CardStyle.buttonWrapper}>
                    <Button className="w-2/5" onClick={this.props.closeDialog} buttontext="Cancel" />
                    <Button className="w-2/5 bg-succ" onClick={() => this.redirect()} buttontext="Log Device In" />
                </DialogActions>
            </this.StyledDialog>
        )
    }
}

export default withRouter(EnterCodeDialog);