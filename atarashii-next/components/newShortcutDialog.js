import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';

import Select from './select';
import Input from './input';
import Button from './button';

import { server } from './../config/index';

import React from 'react';

import AppContext from './../miscellaneous/appContext';

import { useRouter } from 'next/router';

import { useCookies } from 'react-cookie';

class ShortcutDialog extends React.Component{
    state = {
        shortcutType: 'link',
        wUrl: '',
        dName: '',
        fName: ''
    }
    static contextType = AppContext;

    CustomDialog = styled(Dialog)({
        '& .MuiPaper-root': {
            backgroundColor: 'var(--secondary-color)'
        }
    });

    createNewShortcut = async () => {
        if ((this.state.dName.length > 0 && this.state.wUrl.length > 0) || this.state.fName.length > 0) {
            if (this.state.dName.includes('-') || this.state.fName.includes('-')) {
                this.context.openAlert({type: 'error', message: 'Shortcut name cannot contain "-"'});
                return;
            }
            await fetch(server + '/api/shortCuts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.cookies.token
                },
                body: JSON.stringify({
                    type: this.state.shortcutType,
                    name: this.state.shortcutType === 'folder' ? this.state.fName : this.state.dName,
                    url: this.state.shortcutType === 'link' ? this.state.wUrl : undefined,
                    path: this.props.router.query.folderPath
                })
            })
            .then(res => res.json()
                .then(data => {
                    if (res.status >= 200 && res.status < 300) {
                        this.context.openAlert({type: 'success', message: 'Shortcut created successfully'});
                        this.props.closeDialog();
                        // this.props.refreshShortcuts();
                        return;
                    }
                    this.context.openAlert({type: 'error', statusCode: res.status, message: data.error});
                })
            ).catch(err => {
                console.log(err);
                this.context.openAlert({type: 'error', message: 'A Networkerror occured'});
            });
        } else {
            this.context.openAlert({type: 'error', message: 'Please enter the requested Data'});
            return;
        }
    }

    render() {
        return (
            <this.CustomDialog
                open={true}
                onClose={this.props.closeDialog}
                fullWidth={true}
                maxWidth="xs"
            >
                <DialogTitle className="text-center">Create new Shortcut</DialogTitle>
                <DialogContent>
                    <Select selectedType={this.state.shortcutType} updateType={(value) => this.setState({shortcutType: value})} items={[
                        {value: 'link', content: 'Website'},
                        {value: 'folder', content: 'Folder'}
                    ]} className="w-3/4 mx-auto" />
                    {this.state.shortcutType === 'link' ? (
                        <>
                            <Input 
                                label="Website url"
                                value={this.state.wUrl}
                                onChange={(value) => this.setState({wUrl: value})}
                                className="w-3/4"
                            />
                            <Input 
                                label="Displayed name"
                                value={this.state.dName}
                                onChange={(value) => this.setState({dName: value})}
                                className="w-3/4"
                            />
                        </>
                    ) : (
                        <>
                            <Input 
                                label="Folder name"
                                value={this.state.fName}
                                onChange={(value) => this.setState({fName: value})}
                                className="w-3/4"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button buttontext="cancel" className="w-1/4" onClick={this.props.closeDialog} />
                    <Button buttontext="save" className="w-1/4 bg-succ" onClick={this.createNewShortcut} />
                </DialogActions>
            </this.CustomDialog>
        )
    }
}

function withRouter(Component) {
    return function WrappedComponent(props) {  
        const router = useRouter();
        const [cookies, setCookie] = useCookies(['token']);  
        return <Component {...props} router={router} cookies={cookies} />;
    }
}

export default withRouter(ShortcutDialog);