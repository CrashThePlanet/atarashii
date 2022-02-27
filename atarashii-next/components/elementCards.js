import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faArrowRight, faArrowLeft, faArrowUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';

import Link from 'next/link';

import { useRouter } from 'next/router';

import CStyle from './../styles/Card.module.css'

import React from 'react';

import CardDeleteDialog from './cardDeleteDialog';

export default function NavigationCard (props) {
    const router = useRouter();
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    // get the "path" from the url and split it into an array
    // delete the last array item to get the "path" of the previous folder
    let upperFolderPath = '/';
    if (router.asPath !== '/') {
        const tempPathArray = router.asPath.split('-');
        tempPathArray.pop();
        if (tempPathArray.length > 0) upperFolderPath += tempPathArray.join('-');
    }

    const StyledCard = styled(Card)({
        backgroundColor: 'var(--secondary-color)',
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        '& .MuiCardMedia-root': {
            display: 'grid',
            placeItems: 'center',
            padding: 5,
            height: '65%',
            fontSize: '60px'
        }
    });
    const CustomFab = styled(Fab)({
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'var(--secondary-color) !important',
        opacity: 0.8,
        boxShadow: '0px 0px 9px 4px rgba(0,0,0,0.8)'
    })

    if (props.link.type === 'link') return (
        <>
        <motion.div
            className={CStyle.shortCut}
            whileHover={{ scale: 1.1, y: -10 }}
        >
            <a href={'http://' + props.link.url}>
                <StyledCard>
                    <CardMedia>
                        <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://" + props.link.url + "&size=96"} alt="" className="urlIcon" />
                    </CardMedia>
                    <CardContent>
                        <p>{props.link.name}</p>
                    </CardContent>
                </StyledCard>
            </a>
            <CustomFab size="small" className={CStyle.fab} onClick={() => setDeleteOpen(true)}>
                <FontAwesomeIcon icon={faTrashCan} />
            </CustomFab>
        </motion.div>
        {deleteOpen && <CardDeleteDialog name={props.link.name} type={props.link.type} closeDialog={() => setDeleteOpen(false)} />}
        </>
    )
    if (props.link.type === 'folder') return (
        <>
            <motion.div 
                className={CStyle.shortCut}
                whileHover={{ scale: 1.1, y: -10 }}
            >
                <Link href={
                    router.pathname !== '/' ? router.asPath + '-' + props.link.name : '/folder/' + props.link.name
                }>
                    <StyledCard>
                        <CardMedia>
                            <FontAwesomeIcon icon={faFolderOpen} />
                        </CardMedia>
                        <CardContent>
                            <p>{props.link.name}</p>
                        </CardContent>
                    </StyledCard>
                </Link>
                <CustomFab size="small" className={CStyle.fab} onClick={() => setDeleteOpen(true)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </CustomFab>
            </motion.div>
            {deleteOpen && <CardDeleteDialog name={props.link.name} type={props.link.type} closeDialog={() => setDeleteOpen(false)} />}
        </>
    )
    if (props.link.type === 'button' && props.link.name === 'nextPage') return (
        <motion.div 
            className="shortCut"
            whileHover={{ scale: 1.1, y: -10 }}
            onClick={() => props.nextPage()}
        >
            <StyledCard>
                <CardMedia>
                    <FontAwesomeIcon icon={faArrowRight} />
                </CardMedia>
                <CardContent>
                    <p>next Page</p>
                </CardContent>
            </StyledCard>
        </motion.div>
    )
    if (props.link.type === 'button' && props.link.name === 'previousPage') return (
        <motion.div 
            className="shortCut"
            whileHover={{ scale: 1.1, y: -10 }}
            onClick={() => props.prevPage()}
        >
            <StyledCard>
                <CardMedia>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </CardMedia>
                <CardContent>
                    <p>previous Page</p>
                </CardContent>
            </StyledCard>
        </motion.div>
    )
    if (props.link.type === 'button' && props.link.name === 'folderUp') return (
        <motion.div 
            className="shortCut"
            whileHover={{ scale: 1.1, y: -10 }}
        >
            <Link href={upperFolderPath}>
                <StyledCard>
                    <CardMedia>
                        <FontAwesomeIcon icon={faArrowUp} />
                    </CardMedia>
                    <CardContent>
                        <p>back</p>
                    </CardContent>
                </StyledCard>
            </Link>
        </motion.div>
    )
}