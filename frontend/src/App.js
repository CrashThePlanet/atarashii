import React from 'react';
import './App.css';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/material/styles';

import Searchbar from './components/searchbar/searchbar';
import CreateLinkDialog from './components/linkDialog/linkDialog';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFolderOpen } from '@fortawesome/free-solid-svg-icons'

import { motion } from 'framer-motion';

class App extends React.Component {
    state = {
        links: [],
        showDialog: false,
    }

    async getLink() {
        await fetch('http://localhost:3001/links')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.setState({
                links: data
            })
        });
    }
    
    styledCard = styled(Card)({
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
    })

    componentDidMount () {
        this.getLink();
    }

    render () {
        return (
            <div className="bg-prim w-full max-w-full h-screen max-h-screen">
                <div className="searchSection h-1/3 grid place-items-center">
                    <Searchbar />
                </div>
                <div className="shortCuts h-2/3 grid place-items-center">
                    <div className="shortCutsGrid grid">
                        {
                            this.state.links.map((link, index) => {
                                if (link.type === 'link') return (
                                    <motion.a
                                        className="shortCut"
                                        whileHover={{ scale: 1.1, y: -10 }}
                                        key={index}
                                        href={'http://' + link.url}
                                    >
                                        <this.styledCard>
                                            <CardMedia>

                                            </CardMedia>
                                            <CardContent>
                                                <p>{link.name}</p>
                                            </CardContent>
                                        </this.styledCard>
                                    </motion.a>
                                )
                                if (link.type === 'folder') return (
                                    <motion.div 
                                        className="shortCut"
                                        whileHover={{ scale: 1.1, y: -10 }} 
                                        key={index}   
                                    >
                                        <this.styledCard>
                                            <CardMedia>
                                                <FontAwesomeIcon icon={faFolderOpen} />
                                            </CardMedia>
                                            <CardContent>
                                                <p>{link.name}</p>
                                            </CardContent>
                                        </this.styledCard>
                                    </motion.div>
                                )
                                return (<div key={index}></div>)
                            })
                        }
                    </div>
                </div>
                <Tooltip title="add new Item" placement="bottom-end" arrow>
                    <Fab className="control-fab" size="small" onClick={() => this.setState({showDialog: true})}>
                            <FontAwesomeIcon icon={faPlus} />
                    </Fab>
                </Tooltip>
                { this.state.showDialog ? (<CreateLinkDialog closeDialog={() => {this.setState({showDialog: false}); this.getLink()}}/>) : ''}
            </div>
        )
    }
}

export default App;
