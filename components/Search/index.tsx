import react from 'react';
import styles from '@/styles/Search.module.css';
import {
    Paper,
    Input
} from '@mui/material'

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
    faSearch
} from '@fortawesome/free-solid-svg-icons';

import {
    useRouter
} from 'next/router';

export default function Search() {
    const [searchValue, setSearchValue] = react.useState('');
    const router = useRouter()

    const search = () => {
        if (searchValue === '') return;
        router.push('https://www.google.com/search?q=' + searchValue);
    }



    return (<>
        <Paper
            sx={{
                display: "flex",
                alignItems: "flex-end",
                bgcolor: "primary.dark",
                width: 600,
                p: 1.5,
                borderRadius: "30px"
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
            />
            <FontAwesomeIcon icon={faSearch} size="2x" className="cursor-pointer" onClick={() => search()} />
        </Paper>
    </>);
}