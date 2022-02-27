import styles from '../styles/Home.module.css'
import React from 'react';

import NavigationCard from './../components/elementCards';

import hStyle from './../styles/Home.module.css';

import { server } from './../config';

import AppContext from './../miscellaneous/appContext';

import { withRouter } from 'next/router';

class Home extends React.Component {
	state = {
		shortCuts: [],
		firstElem: 0,
		lastElem: 20
	}
	static contextType = AppContext;
	async getShortcuts() {
		if (this.context.token === undefined) {
			this.props.router.prush('/login');
			return;
		}
		await fetch(server + '/api/shortCuts/getAll', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.context.token
			}
		})
		.then (res => res.json()
			.then (data => {
				if (res.status >= 200 && res.status < 300) this.setState({shortCuts: data.shortCuts});
				else this.context.openAlert({type: 'error', statusCode: res.status, message: data.error});
			})

		).catch(err => {
			console.log(err)
			this.context.openAlert({type: 'error', message: 'Networterror occured'});
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

	componentDidMount() {
		this.getShortcuts();
	}
	componentDidUpdate(prevProps) {
		if (prevProps !== this.props) this.getShortcuts();
	}

	render () {
		return (
			<div className={"h-full w-full px-6 py-2 mx-auto " + hStyle.Wrapper}>
				{
					this.state.shortCuts.slice(this.state.firstElem, this.state.lastElem).map((shortcut, index) => {
						const i = index + this.state.firstElem;
						if (i === this.state.firstElem && this.state.firstElem !== 0) {
							return [
								<NavigationCard link={{type: 'button', name: 'previousPage'}} prevPage={() => this.prevPage()} key={'link:' + i}/>,
								<NavigationCard link={shortcut} key={i} />
							]
						}
						if (i === this.state.lastElem - 1) {
							return <NavigationCard link={{type: 'button', name: 'nextPage'}} nextPage={() => this.nextPage()} key={i} />
						}
						return (<NavigationCard link={shortcut} key={i} />)
					})
				}
			</div>
		)
	}
}

export default withRouter(Home);
