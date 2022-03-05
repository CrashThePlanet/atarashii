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
	getShortcuts() {
		if (this.props.notFound) {
			if (this.props.token === 'notFound') {
				this.props.router.push('/login');
				return;
			}
			this.context.openAlert({type: 'error', statusCode: this.props.status, message: this.props.error});
			return;
		}
		this.setState({shortCuts: this.props.shortCuts});
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
					this.state.shortCuts.length > 0 && this.state.shortCuts.slice(this.state.firstElem, this.state.lastElem).map((shortcut, index) => {
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

export async function getServerSideProps(context) {
	if (context.req.headers.cookie === undefined || context.req.headers.cookie === null || context.req.headers.cookie === '') return {
		props: {
			notFound: true,
			token: 'notFound',
		}
	}
	try {
		const token = context.req.headers.cookie.replace('token=', '');
		const res = await fetch(server + '/api/shortCuts/getAll', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			}
		});
		const data = await res.json();
		if (res.status >= 200 && res.status < 300) return { props: {shortCuts: data.shortCuts} };
		else {
			return {
				props: {
					notFound: true,
					status: res.status,
					error: data.error
				}
			}
		}
	} catch (error) {
		console.log(error);
		return {
			props: {
				error: 'Networkerror occured'
			}
		}
	}
}

export default withRouter(Home);
