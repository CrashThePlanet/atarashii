import React from "react"; 
import './linkDialog.css';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

class CreateLinkDialog extends React.Component {
    state = {
        type: 'link',
        wName: '',
        wUrl: '',

        fName: ''
    }

    PlainButton = styled(Button)({
        color: 'var(--font-color)',
        cursor: 'pointer'
    });
    SaveButton = styled(Button)({
        color: 'var(--font-color)',
        backgroundColor: 'var(--accent-color)',
        transition: 'all 200ms',
        '&:hover': {
            backgroundColor: 'var(--accent-color)',
            filter: 'brightness(87%)'
        }
    });
    PlainTextField = styled(TextField)({
        margin: '0.5rem 0',
        '& label.Mui-focused': {
            color: 'var(--accent-color)',
        },
        '& label': {
            color: 'var(--font-color)',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'var(--font-color)'
        },
        '&:hover .MuiInput-underline:before': {
            borderBottomColor: 'var(--accent-color)'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--accent-color)',
        },
        '& .MuiInputBase-input': {
            color: 'var(--font-color)',
        },
    });
    SelectTextField = styled(TextField)({
        marginTop: '0.5rem',
        '& label.Mui-focused': {
            color: 'var(--accent-color)',
        },
        '& label': {
            color: 'var(--font-color)',
        },
        '& .MuiSelect-standard': {
            color: 'var(--font-color)',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'var(--font-color)'
        },
        '&:hover .MuiInput-underline:before': {
            borderBottomColor: 'var(--accent-color)'
        },
        '&:hover .MuiInputBase-root': {
            borderBottomColor: 'var(--accent-color)',
        },
        '&:hover .MuiInput-root:before': {
            borderBottomColor: 'var(--accent-color)',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--accent-color)',
        }
    });

    createItem = async () => {
        // check if name is empty -> user has to put something in
        if ((this.state.wName.length > 0 && this.state.wUrl.length > 0) || this.state.fName.length > 0) {
            let itemName;
            if (this.state.type === 'link') {
                itemName = this.state.wName;
            } else if (this.state.type === 'folder') {
                itemName = this.state.fName;
            }
            // call api to create item
            await fetch('http://localhost:3001/createLink', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: this.state.type,
                        name: itemName,
                        url: this.state.wUrl,
                        path: this.props.path
                    })
                }
            )
            .then(res => res.json()).then(res => {
                this.props.closeDialog();
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <Dialog
                open={true}
                maxWidth="sm"
                fullWidth={true}
                onClose={this.props.closeDialog}
                className="linkDialog text"
            >
                <DialogTitle className="text-center">Add new link</DialogTitle>
                <DialogContent className="w-1/2">
                    <FormControl className="w-full">
                        <this.SelectTextField
                            select
                            label="select Type"
                            value={this.state.type}
                            onChange={(e) => this.setState({ type: e.target.value })}
                            variant="standard"
                        >
                            <MenuItem value="link">Website</MenuItem>
                            <MenuItem value="folder">Folder</MenuItem>
                        </this.SelectTextField>
                    </FormControl>
                    {this.state.type === 'link' ? (
                        <div>
                            <this.PlainTextField
                                label="Name of Website"
                                variant="standard"
                                value={this.state.wName}
                                onChange={(e) => {this.setState({ wName: e.target.value })}}
                                className="w-full"
                            />
                            <this.PlainTextField
                                label="Url of Website"
                                variant="standard"
                                value={this.state.wurl}
                                onChange={(e) => this.setState({ wUrl: e.target.value })}
                                className="w-full"
                            />
                        </div>
                    ) : (this.state.type === 'folder') ? (
                        <div className="">
                            <this.PlainTextField
                                label="Name of Folder"
                                variant="standard"
                                value={this.state.fName}
                                onChange={(e) => {this.setState({ fName: e.target.value })}}
                                className="w-full"
                            />
                        </div>
                    ) : ''}
                </DialogContent>
                <DialogActions>
                        <this.PlainButton onClick={this.props.closeDialog}>CANCEL</this.PlainButton>
                        <this.SaveButton variant="contained" onClick={this.createItem}>save</this.SaveButton>
                </DialogActions>
            </Dialog>
        )
    }
}

export default CreateLinkDialog;