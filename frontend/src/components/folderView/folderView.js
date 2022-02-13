import React from 'react';
import './folderView.css';

import {
    useParams
} from 'react-router-dom';

class FolderView extends React.Component {
    state = {
        folderPath: '',
    }

    componentDidMount() {
        const path = this.props.urlParams.replace('-', '.');
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default function FolderViewWithHooks() {
    const urlParams = useParams();
    return (
        <FolderView urlParams={urlParams} />
    )
};