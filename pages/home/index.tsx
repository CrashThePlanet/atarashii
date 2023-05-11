import react from 'react';
import { NextRouter, useRouter } from 'next/router';

import CardsLayout from '@/components/CardsLayout';
import Card from '@/components/Card';

import { useAppContext } from '@/pages/_app';


interface HomeProps {
    context: any,
    router: NextRouter
}

class HomeClass extends react.Component<HomeProps> {
    state = {
        cards: []
    }
    async loadCards(): Promise<void> {
        const res = await getRootCards();
        if (res.error) {
            this.props.context.openSnackbar(res.code + ': ' + res.message, 'error');
            return;
        }
        this.setState({cards: res.cards});
    }
    componentDidMount(): void {
        this.loadCards();       
    }
    render() {
        return (
            <CardsLayout>
                {this.state.cards.map((card: any, index: number) => (
                    <Card {...card} key={index} />
                ))}
            </CardsLayout>
        )
    }
}
async function getRootCards() {
    const res = await fetch('/api/cards/get', {
        method: 'GET'
    });
    if (res.ok) return await res.json();
    // sends error back to client if error lol
    return {
        error: true,
        code: res.status,
        message: (await res.json()).error
    }
}
export default function Home(props: any) {
    const appContext = useAppContext();
    const router = useRouter();
    const elemeRef = react.useRef<any>();
    appContext.cardContainerRef = elemeRef;
    return <HomeClass context={appContext} ref={elemeRef} router={router} {...props} ></HomeClass>;
}
