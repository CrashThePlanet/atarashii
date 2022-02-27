import React from 'react';

import { useRouter } from 'next/router';

import { server } from './../../config/index';

import AppContext from './../../miscellaneous/appContext';

import NavigationCard from './../../components/elementCards';

import hStyle from './../../styles/Home.module.css';

class SubElements extends React.Component {
    state = {
        subElements: [],
        firstElem: 0,
        lastElem: 20
    }
    static contextType = AppContext;

    async getSubElements() {
        await fetch(server + '/api/shortCuts/getSubElements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            },
            body: JSON.stringify({
                path: this.props.router.query.folderPath
            })
        })
        .then(res => res.json()
            .then(data => {
                if (res.status >= 200 && res.status < 300) {
                    this.setState({subElements: data.shortCuts})
                    return;
                }
                this.context.openAlert({type: 'error', statusCode: res.status, message: data.error});
            })
        ).catch(err => {
            console.log(err);
            this.context.opelAlert({type: 'error', message: 'Networkerror occured'});
        })
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

    componentDidMount () {
        if (this.props.router.isReady) this.getSubElements();
    }
    componentDidUpdate(prevProps) {
        if (this.props.router.isReady && prevProps !== this.props) this.getSubElements();
    }


    render() {
        return (
            <div className={"h-full w-full px-6 py-2 mx-auto " + hStyle.Wrapper}>
                <NavigationCard link={{type: 'button', name: 'folderUp'}} />
            {
                this.state.subElements.map((element, index) => {
                    const i = index + this.state.firstElem;
                    if (i === this.state.firstElem && this.state.firstElem !== 0) {
                        return [
                            <NavigationCard link={{type: 'button', name: 'previousPage'}} prevPage={() => this.prevPage()} key={'link:' + i}/>,
                            <NavigationCard link={element} key={i} />
                        ]
                    }
                    if (i === this.state.lastElem - 1) {
                        return <NavigationCard link={{type: 'button', name: 'nextPage'}} nextPage={() => this.nextPage()} key={i} />
                    }
                    return (<NavigationCard link={element} key={i} />)
                })
            }
            </div>
        )
    }
}

function withRouter(Component) {
    return function Folder(props) {  
        const router = useRouter();
        return <Component {...props} router={router} />;
    }
}

export default withRouter(SubElements);