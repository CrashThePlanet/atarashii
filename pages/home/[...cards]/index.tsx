import react from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useAppContext } from '@/pages/_app';

import CardsLayout from '@/components/CardsLayout';
import Card from '@/components/Card';

interface WithRouterProps {
    context: any,
    router: NextRouter
}

interface CardsGridProps extends WithRouterProps {}

class CardsGridClass extends react.Component<CardsGridProps> {
    state = {
        cards: []
    }
    async loadCards(): Promise<void> {
        const data = await getCards(this.props.router.query.cards);
        if (data.error) {
            this.props.context.openSnackbar(data.code + ': ' + data.message, 'error');
            return;
        }
        this.setState({cards: data});
    }
    async componentDidMount(): Promise<void> {
        this.loadCards();
    }
    componentDidUpdate(prevProps: Readonly<CardsGridProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.router.asPath !== this.props.router.asPath) {
            this.loadCards();
        }
    }
    render() {
        return (
            <CardsLayout>
                <Card type="action" name="Back" />
                {this.state.cards.map((cardData: any, index: number) => (
                    <Card {...cardData} key={index} />
                ))}
            </CardsLayout>
        )
    }
}

async function getCards(pathArray: any) {
    const res = await fetch('/api/cards/get', {
        method: 'POST',
        body: JSON.stringify({
            path: pathArray
        })
    });
    if (res.ok) {
        return await res.json();
    }
    return {error: true, errorCode: res.status, message: (await res.json()).error}
}
export default function CardsGrid(props: any) {
    const appContext = useAppContext();
    const router = useRouter();
    const elemeRef = react.useRef<any>();
    appContext.cardContainerRef = elemeRef;
    return <CardsGridClass context={appContext} ref={elemeRef} router={router} {...props} />
}