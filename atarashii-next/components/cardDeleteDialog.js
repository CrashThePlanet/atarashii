import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
 
import Button from './button';

import AppContext from './../miscellaneous/appContext';
import { server } from './../config/index';

import { useContext } from 'react';
import { useRouter } from 'next/router';
 

export default function CardDeleteDialog(props) {
    const context = useContext(AppContext);
    const router = useRouter();

    const StyledDialog = styled(Dialog)({
        '& .MuiPaper-root': {
            backgroundColor: 'var(--secondary-color)'
        }
    });
    async function handleDelete() {
        await fetch(server + '/api/shortCuts/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + context.token
            },
            body: JSON.stringify({
                shortcutName: props.name,
                path: router.query.folderPath
            })
        })
        .then(res => res.json()
            .then(data => {
                if (res.status >= 200 && res.status < 300) {
                    context.openAlert({type: 'success', statusCode: res.status, message: 'Shortcut removed'});
                    props.closeDialog();
                    return;
                }
                context.openAlert({type: 'error', statusCode: res.status, message: data.error});
                props.closeDialog();
            })
        ).catch(error => {
            console.log(error);
            context.openAlert({type: 'error', message: 'Networkerror occured'});
            props.closeDialog();
        });
    }

    return (
        <StyledDialog
            open={true}
            onClose={props.closeDialog}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle className="text-center">Delete <u>{props.name}</u>?</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete this {props.type === 'folder' && "folder and all it's corresponding Sub Elements?"}{props.type === 'link' && "link?"}</p>
            </DialogContent>
            <DialogActions className="justify-around">
                <Button className="w-2/5 bg-succ" onClick={props.closeDialog} buttontext="Cancel" />
                <Button className="w-2/5" onClick={() => handleDelete()} buttontext="Delete" />
            </DialogActions>
        </StyledDialog>
    )
}