import React from 'react';
import './searchbar.css';

import Input from '@mui/material/Input';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { motion } from 'framer-motion';

function Searchbar () {
    const inputRef = React.useRef(null);
    const [inputIsFocused, setInputIsFocused] = React.useState(false);

    const search = () => {
        if (inputRef.current.value !== '') {
            let searchTerm = inputRef.current.value;
            searchTerm = searchTerm.replace(/ /g, '+');
            window.location.href = `https://duckduckgo.com/?q=${searchTerm}&t=ffab&ia=web`;
        }
    }

    document.addEventListener('keypress', (e) => {
        if (e.keyCode === 13 && inputIsFocused) {
            search();
        }
    });
    React.useEffect(() => {
        inputRef.current.addEventListener('focus', () => {
            setInputIsFocused(true);
        });
        inputRef.current.addEventListener('blur', () => {
            setInputIsFocused(false);
        });
    }, [])

    return (
        <div className="flex flex-row items-center bg-sec py-1 px-4 pr-0 rounded-full w-3/5 h-16">
            <Input inputRef={inputRef} placeholder="Search on DuckDuckGo" className="searchInput mt-1" />
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={search}
                className="searchIcon text-4xl mx-2 bg-acc py-1 px-2 rounded-full w-24 grid place-items-center cursor-pointer h-full text"
            >
                <FontAwesomeIcon icon={faSearch} />
            </motion.div>
        </div>
    )
}

export default Searchbar;