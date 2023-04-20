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
    async componentDidMount(): Promise<void> {
        const data = await getCards(this.props.router.query.cards);
        if (data.error) {
            this.props.context.openSnackbar(data.code + ': ' + data.message, 'error');
            return;
        }
        this.setState({cards: data});
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
    return <CardsGridClass context={appContext} router={router} {...props} />
}