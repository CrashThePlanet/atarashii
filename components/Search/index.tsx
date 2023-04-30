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

async function getSearchHistory() { // from server
    const res = await fetch('/api/search/getLast', {
        method: 'GET'
    });
    if (res.ok) {
        return await res.json();
    }
} 

export default function Search() {
    const [searchValue, setSearchValue] = react.useState('');
    const [history, setHistory] = react.useState([]);
    const [focus, setFocus] = react.useState(false);

    const router = useRouter();
    const theme = useTheme();

    react.useEffect(() => {
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
                body: JSON.stringify({query})
            });
        } else {
            await fetch('/api/search/add', {
                method: 'POST',
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
                position: 'relative'
            }}
        >
            <Input 
                placeholder='Search for something...'
                disableUnderline
                sx={{
                    width: "calc(100% - 32px)"
                }}
                onKeyUp={(e) => {if(e.key === 'Enter') search()}}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setFocus(true)}
                /* waits 50ms so the click event of the List buttons is firering before the list disappears*/
                onBlur={() => {
                    setTimeout(() => {
                        setFocus(false);
                    }, 50);
                }}
            />
            <FontAwesomeIcon icon={faSearch} size="2x" className="cursor-pointer" onClick={() => search()} />
            {focus && (
                <List className="absolute w-full shadow-lg"
                    sx={{
                        top: '110%',
                        left: 0,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 2,
                        zIndex: 999
                    }}
                >
                    {history.map((query: any, index: number) => (
                        <>
                            <ListItem
                                disablePadding
                                key={index}
                                onClick={() => search(query.query)}
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