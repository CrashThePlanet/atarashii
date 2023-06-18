import styles from '@/style.NewDialog.module.css'

import react from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    useMediaQuery,
    Divider,
    Tab,
    Box,
    Tabs
} from '@mui/material';

import {
    useTheme
} from '@mui/material/styles';

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';

import {
    faXmark
} from '@fortawesome/free-solid-svg-icons';

import {
    useRouter
} from 'next/router';

import {
    useAppContext
} from '@/pages/_app';

import NormalInput from '@/components/Input';
import MotionButton from '@/components/MotionButton';

export default function NewDialog() {
    const appContenxt = useAppContext();
    const router = useRouter();

    const theme = useTheme()
    // if the dialog(the popup) should go fullscreen or not
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    // what should be created: website or folder
    const [type, setType] = react.useState('website');
    
    const [name, setName] = react.useState<any>(undefined);
    const [url, setUrl] = react.useState<any>(undefined);

    const handleChange = () => {
        if (type === 'website') return setType('folder');
        if (type === 'folder') return setType('website');
    }
    const close = () => {
        setName(undefined);
        setUrl(undefined);
        setType('website');
        appContenxt.newDialog.toggle(false)
    }
    const save = async () => {
        if (name === undefined || name.length <= 0) {
            appContenxt.openSnackbar("Please enter a name!", "error")
            return;
        }
        if (type === 'website' && (url === undefined || url.length <= 0)) {
            appContenxt.openSnackbar("Please enter a url!", "error")
            return;
        }
        // getrs the current path, so it knows where to create it
        const path = (router.query.cards?.length === 0 ? null : router.query?.cards);
        const res = await fetch('/api/cards/new', {
            method: 'POST',
            headers: {
                'Authorization': String(sessionStorage.getItem('userUUID'))
            },
            body: type === 'website' ? 
                JSON.stringify({
                    type,
                    name,
                    url,
                    path
                }) : JSON.stringify({
                    type,
                    name,
                    path
                })
        });
        if (!res.ok) {
            appContenxt.openSnackbar("Something went wrong. Please try again later!", "error")
            return;
        }
        appContenxt.openSnackbar((type === 'website' ? "Website" : "Folder") + " created!", "success");
        appContenxt.cardContainerRef?.current.loadCards();
        close();
    }

    return (<>
        <Dialog
            open={appContenxt.newDialog.isOpen}
            onClose={() => close()}
            maxWidth={"sm"}
            fullWidth
            fullScreen={fullScreen}
        >
            <DialogTitle>
                Create Something New
                <IconButton
                    onClick={() => close()}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 12
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{
                    padding: 0
                }}
            >
                <Box>
                    <Box
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Tabs
                            value={type}
                            onChange={() => handleChange()}
                            variant="fullWidth"
                            TabIndicatorProps={{
                                style: {
                                    background: theme.palette.secondary.main
                                }
                            }}
                            sx={{
                                "& button": {
                                    color: theme.palette.text.primary + " !important"
                                }
                            }}
                        >
                            <Tab
                                value="website"
                                label="Website"
                                />
                            <Tab
                                value="folder"
                                label="Folder"
                                />
                        </Tabs>
                    </Box>
                    <Box
                        sx={{
                            padding: 5
                        }}
                    >
                        {type === 'website' ? (<>
                            <NormalInput
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                                label="Name"
                                fullWidth
                                error={name !== undefined && name.length <= 0}
                            />
                            <Box sx={{width:'100%', height:20}}></Box>
                            <NormalInput
                                value={url}
                                onChange={(e: any) => setUrl(e.target.value)}
                                label="Website URL"
                                fullWidth
                                error={url !== undefined && url.length <= 0}
                            />
                        </>) : ''}
                        {type === 'folder' ? (<>
                            <NormalInput
                            value={name}
                            onChange={(e: any) => setName(e.target.value)}
                            label="Name"
                            fullWidth
                            error={name !== undefined && name.length <= 0}
                        />
                        </>) : ''}
                    </Box>
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions>
                <MotionButton
                    onClick={() => {save()}}
                >
                    Save
                </MotionButton>
            </DialogActions>
        </Dialog>
    </>)
}