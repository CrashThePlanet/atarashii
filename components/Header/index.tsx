import styles from '@/styles/Header.module.css';

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
    Box
} from '@mui/material'

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';

import {
    faPlus,
    faMoon,
    faSun,
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import react from 'react';
import {
    useAppContext 
} from '@/pages/_app';

export default function Header() {
    const appContext = useAppContext();
    const router = useRouter();
    return (<>
        <AppBar
            position='static'
        >
            <Toolbar>
                <Box sx={{flexGrow: 1}}></Box>
                <Tooltip
                    title="Logout"
                >
                    <IconButton
                    onClick={() => {
                        sessionStorage.clear();
                        router.push('/login');
                    }}
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </IconButton>
                </Tooltip>
                <Box>
                    {
                        appContext.darkMode.is ? (
                            <Tooltip
                                title="Change to Light Mode"
                            >   
                                <IconButton
                                    onClick={() => {
                                        appContext.darkMode.toggle(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSun} />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip
                                title="Change to Dark Mode"
                            >   
                                <IconButton
                                    onClick={() => {
                                        appContext.darkMode.toggle(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faMoon} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                    <Tooltip
                        title="Add Something"
                    >   
                        <IconButton
                            onClick={() => {
                                appContext.newDialog.toggle(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    </>)
}