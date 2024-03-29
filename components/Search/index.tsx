import react from 'react';
import styles from '@/styles/Search.module.css';
import {
    Paper,
    Input,
    Divider,
    List,
    ListItem,
    ListItemButton,
    Typography,
    Box
} from '@mui/material'

import {
    useTheme
} from '@mui/material/styles'

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons';

import {
    useRouter
} from 'next/router';

import {
    useAppContext
} from '@/pages/_app';


async function getSearchHistory() { // from server
    const res = await fetch('/api/search/getLast', {
        method: 'GET',
        headers: {
            'Authorization': String(sessionStorage.getItem('userUUID'))
        }
    });
    if (res.ok) {
        return await res.json();
    }
} 

export default function Search() {
    const [searchValue, setSearchValue] = react.useState('');
    const [history, setHistory] = react.useState([]);
    const [focus, setFocus] = react.useState(false);
    const theme = useTheme();

    const appContext = useAppContext();
    const router = useRouter();

    react.useEffect(() => {
        if (sessionStorage.getItem('userUUID') === undefined) {
            appContext.openSnackbar('Please login again!', 'error');
            router.push('/login');
            return;
        }
        const shit = async () => {
            setHistory(await getSearchHistory());       
        }
        shit();
    }, [])

    // redirects to the search page (google)
    // if there is a query (given when using the history list) it uses this instead of the input value
    const search = async (query:string | undefined = undefined) => {
        if (searchValue === '' && query === undefined) return;
        if (query !== undefined) {
            await fetch('/api/search/add', {
                method: 'POST',
                headers: {
                    'Authorization': String(sessionStorage.getItem('userUUID'))
                },
                body: JSON.stringify({query})
            });
        } else {
            await fetch('/api/search/add', {
                method: 'POST',
                headers: {
                    'Authorization': String(sessionStorage.getItem('userUUID'))
                },
                body: JSON.stringify({query: searchValue})
            });
        }
        router.push('https://www.google.com/search?q=' + (query === undefined ? searchValue : query));
    }

    return (<>
        <Paper
            sx={{
                display: "flex",
                alignItems: "flex-end",
                bgcolor: "primary.dark",
                width: 600,
                p: 1.5,
                borderRadius: "30px",
                position: 'relative',
                pointerEvents: 'none'
            }}
        >
            <Input 
                placeholder='Search for something...'
                disableUnderline
                sx={{
                    width: "calc(100% - 32px)",
                    pointerEvents: 'auto'
                }}
                onKeyUp={(e) => {if(e.key === 'Enter') search()}}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setFocus(true)}
                /* waits 50ms so the click event of the List buttons is firering before the list disappears*/
                onBlur={() => {
                    setTimeout(() => {
                        setFocus(false);
                    }, 250);
                }}
            />
            <FontAwesomeIcon icon={faSearch} size="2x" className="cursor-pointer pointer-events-auto" onClick={() => search()} />
            {focus && history.length > 0 && (
                <List className="w-full shadow-lg"
                    key={1}
                    sx={{
                        top: '110%',
                        left: 0,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 2,
                        zIndex: 999,
                        position: 'absolute'
                    }}
                >
                    {history.map((query: any, index: number) => (
                        <>
                            <ListItem
                                disablePadding
                                key={index}
                                onClick={() => search(query.query)}
                                className="pointer-events-auto"
                            >
                                <ListItemButton>
                                    <Typography>
                                        {query.query}
                                    </Typography>
                                    <Box sx={{flexGrow: 1}}></Box>
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="opacity-20" />
                                </ListItemButton>
                            </ListItem>
                            {index < history.length -1 ? (
                                <Divider variant='middle' />
                            ) : ''}
                        </>
                    ))}
                </List>
            )}
        </Paper>
    </>);
}