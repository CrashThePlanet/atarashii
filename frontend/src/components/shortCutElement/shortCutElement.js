import React from 'react';
import './shortCutElement.css';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faArrowRight, faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons';

import { motion } from 'framer-motion';

import { Link, useParams } from 'react-router-dom';


function ShortCutElement(props) {
    const { path } = useParams();

    // get the "path" from the url and split it into an array
    // delete the last array item to get the "path" of the previous folder
    let upperFolderPath = '/'
    if (path !== undefined) {
        const tempPathArray = path.split('-');
        tempPathArray.pop();
        if (tempPathArray.length > 0) upperFolderPath += 'folder/' + tempPathArray.join('-');
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

    if (props.link.type === 'link') return (
        <motion.a
            className="shortCut"
            whileHover={{ scale: 1.1, y: -10 }}
            href={'http://' + props.link.url}
        >
            <StyledCard>
                <CardMedia>
                    <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://" + props.link.url + "&size=96"} alt="" className="urlIcon" />
                </CardMedia>
                <CardContent>
                    <p>{props.link.name}</p>
                </CardContent>
            </StyledCard>
        </motion.a>
    )
    if (props.link.type === 'folder') return (
        <motion.div 
            className="shortCut"
            whileHover={{ scale: 1.1, y: -10 }}
        >
            <Link to={
                path !== undefined ? '/folder/' + path + '-' + props.link.name : '/folder/' + props.link.name
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
        </motion.div>
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
            <Link to={upperFolderPath}>
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
    return (<div key={props.index}></div>)
}

export default ShortCutElement;