import React from 'react';
import './App.css';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

import Searchbar from './components/searchbar/searchbar';
import CreateLinkDialog from './components/linkDialog/linkDialog';
import ShortCutElement from './components/shortCutElement/shortCutElement';
import FolderViewWithHooks from './components/folderView/folderView';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { motion } from 'framer-motion';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    useParams
} from "react-router-dom";

function MainPageWithHooks() {
    const routeParams = useParams();
    return (
        <MainPage urlParams={routeParams} />
    )
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPageWithHooks/>}>
                    <Route path="/folder/:path"/>
                </Route>
            </Routes>
        </Router>
    )
}

class MainPage extends React.Component {
    state = {
        links: [],
        shownLinks: [],
        showDialog: false,

        firstElem: 0,
        lastElem: 20
    }

    async getLink() {
        await fetch('http://localhost:3001/links')
        .then(res => res.json())
        .then(data => {
            this.setState({
                links: data,
                shownLinks: data
            })
        });
    }
    nextPage() {
        let newStart = this.state.firstElem + 19;
        let newEnd = this.state.lastElem + 18;
        this.setState({
            firstElem:  newStart,
            lastElem: newEnd
        });
    }

    prevPage() {
        let newStart = this.state.firstElem - 19;
        let newEnd = this.state.lastElem - 18;
        this.setState({
            firstElem:  newStart,
            lastElem: newEnd
        });
    }
    async getSubLink(path) {
        await fetch('http://localhost:3001/getFolderSubLinks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: path
            })
        }).then(res => res.json())
        .then(data => {this.setState({shownLinks: data})});
    }
    closeDialog() {
        this.setState({showDialog: false});
        // wait because, idk why but it doesnt work without this -> some weird network error
        setTimeout(() => {
            this.props.urlParams.path === undefined ? this.getLink() : this.getSubLink(this.props.urlParams.path);
        }, 110);
    }

    componentDidMount () {
        if (Object.keys(this.props.urlParams).length !== 0) {
            this.getSubLink(this.props.urlParams.path);
        }
        if (Object.keys(this.props.urlParams).length === 0) {
            this.getLink();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.urlParams !== prevProps.urlParams) {
            if (Object.keys(this.props.urlParams).length !== 0) {
                this.getSubLink(this.props.urlParams.path);
            }
            if (Object.keys(this.props.urlParams).length === 0) {
                this.getLink();
            }
        }
    }

    render() {
        return (
            <div className="bg-prim w-full max-w-full h-screen">
                <div className="searchSection h-2/6 grid place-items-center">
                    <Searchbar />
                </div>
                <div className="shortCuts h-3/6 grid place-items-center">
                    <div className="shortCutsGrid grid">
                        { Object.keys(this.props.urlParams).length !== 0 ? (<ShortCutElement link={{type: 'button', name: 'folderUp'}} />) : '' }
                        {  
                            this.state.shownLinks.slice(this.state.firstElem, this.state.lastElem).map((link, i) => {
                                const index = i + this.state.firstElem;
                                if (index === this.state.firstElem && this.state.firstElem !== 0) {
                                    return [
                                        <ShortCutElement link={{type: 'button', name: 'previousPage'}} prevPage={() => this.prevPage()} key={'link:' + index}/>,
                                        <ShortCutElement link={link} key={index} />
                                    ]
                                }
                                if (index === this.state.lastElem - 1) {
                                    return <ShortCutElement link={{type: 'button', name: 'nextPage'}} nextPage={() => this.nextPage()} key={index} />
                                }
                                return (<ShortCutElement link={link} key={index} />)
                            })
                        }
                    </div>
                </div>
                <Tooltip title="add new Item" placement="bottom-end" arrow>
                    <Fab className="control-fab" size="small" onClick={() => this.setState({showDialog: true})}>
                            <FontAwesomeIcon icon={faPlus} />
                    </Fab>
                </Tooltip>
                { this.state.showDialog ? (<CreateLinkDialog path={this.props.urlParams.path} closeDialog={() => {this.closeDialog()}}/>) : ''}
            </div>
        )
    }
}

export default App;
