import styles from '@/styles/CardContextMenu.module.css';
import react from 'react';

import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    Divider
} from '@mui/material';

import {
    useTheme
} from '@mui/material/styles';

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome';

import {
    faTrashCan
} from '@fortawesome/free-solid-svg-icons';

import {
    useRouter
} from 'next/router';

import { useAppContext } from '@/pages/_app';

type ContextMenuProps = {
    cardName: string,
    x: number,
    y: number,
    Cref: any
}

let holdedSec = 0;
function Timer(this: any, fn: Function): any {
    let timerOBJ: NodeJS.Timer | undefined = setInterval(() => fn(), 1000);

    this.stop = () => {
        if (timerOBJ !== undefined) {
            clearInterval(timerOBJ);
            timerOBJ = undefined;
            holdedSec = 0;
            
        }
        return this;
    }

    this.start = () => {
        if (timerOBJ === undefined) {
            this.stop();
            timerOBJ = setInterval(() => fn(), 1000);
        }
        return this;
    }
    this.reset = () => {
        this.stop();
        this.start();
        return this;
    }
}
let timer: any;

export default function CardContextMenu(props: ContextMenuProps) {
    const [showDeleteAnimation, setShowDeleteAnimation] = react.useState('');
    const buttonRef = react.useRef<any>();
    const router= useRouter();
    const appContext = useAppContext();

    react.useEffect(() => {
        console.log(router)
        timer = new (Timer as any)(async () => {
            if (holdedSec === 2) {
                timer.stop();
                const res = await deleteCard(props.cardName, (router.asPath === '/home' ? undefined : router.query.cards));
                if (res?.error) {
                    console.log();
                    
                    appContext.openSnackbar(res?.status + ': ' + res?.msg, 'error');
                    return;
                }
                appContext.openSnackbar('Card deleted', 'success');
            }
            holdedSec++;
        });
        timer.stop();
    }, [])

    async function holdToDelete(): Promise<void> {
        setShowDeleteAnimation(styles.animation + ' ' + styles.test);
        timer.reset();
    }
    function cancleDelete(): any {
        timer.stop();
    }

    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    backgroundColor: theme.palette.primary.main,
                    width: 300,
                    left: props.x,
                    top: props.y,
                    zIndex: 999
                }}
                ref={props.Cref}
            >
                <List
                    disablePadding
                >
                    <Divider />
                    <ListItem
                        disablePadding
                        className={styles.DeleteListItem + ' ' + showDeleteAnimation}
                        onMouseDown={(e: any) => holdToDelete()}
                        onMouseUp={(e: any) => cancleDelete()}
                        ref={buttonRef}
                    >
                        <ListItemButton
                            disableRipple
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            <Typography
                                sx={{
                                    paddingLeft: 2
                                }}
                            >
                                Löschen
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </>
    )
}

async function deleteCard(cardName: string, path: string | Array<string> | undefined) {
    const res = await fetch('/api/cards/delete', {
        method: 'POST',
        body: JSON.stringify({
            cardName,
            path
        })
    });
    if (res.ok) {
        return;
    }
    return {
        error: true,
        status: res.status,
        msg: (await res.json()).msg
    }
}