import styles from '@/styles/Card.module.css'
import react, { MutableRefObject } from 'react';

import {
    Card as MuiCard,
    CardMedia,
    Typography,
    CardContent
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { motion } from 'framer-motion';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTurnUp } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';

import CardContextMenu from './contextMenu';

interface Data {
    type: string,
    name: string,
    url?: string
}
export default function Card(props: Data): React.ReactElement {
    const theme = useTheme();
    const router = useRouter();
    const [contextMenuData, setContextMenuData] = react.useState({open: false, x: 0, y: 0});
    const cardRef = react.useRef<any>();
    const contextMenuRef = react.useRef<any>();

    const previousRoute = router.asPath.slice(0, router.asPath.lastIndexOf('/'));

    react.useEffect(() => {
        // listen if for right click on a card --> open
        cardRef.current?.addEventListener('contextmenu', (e: any) => {
            e.preventDefault();
            if (contextMenuRef.current?.contains(e.target)) return;
            setContextMenuData({open: true, x: e.x, y: e.y});
        });
        // listen for click outside card or context menu --> close context menu
        document.addEventListener('mousedown', (e: any) => {
            if (!cardRef.current?.contains(e.target) && !contextMenuRef.current?.contains(e.target)) {
                setTimeout(() => {
                    setContextMenuData({...contextMenuData, open: false});
                }, 100);
            }
        })
    }, [])

    return (
        <>
            <motion.div
                className={"mx-3 cursor-pointer h-max " + styles.card}
                whileHover={{scale: 1.1}}
                ref={cardRef}
            >
                <Link
                    href={props.type === 'website'? (props.url + '') : (props.type === "folder" ? (router.asPath + '/' + props.name) : previousRoute)}
                    passHref
                >
                    <MuiCard className="grid place-items-center h-40 rounded">
                        {props.type === 'website'? (
                            <CardMedia
                                component='img'
                                /*with this links its gets the fav icon of the targeted page*/
                                image={"http://www.google.com/s2/favicons?domain=" + props.url}
                                alt={"Logo of " + props.name}
                                sx={{
                                    height: '32px !important',
                                    width: '32px !important'
                                }}
                            />
                        ) : props.type === "folder" ? (
                            <FontAwesomeIcon icon={faFolderOpen} size="2x" />
                        ) : (
                            <FontAwesomeIcon icon={faTurnUp} size="2x" className={styles.backIcon} />
                        )}
                        <CardContent className='pt-0'>
                            <Typography
                                variant='h6'
                                >
                                {props.name}
                            </Typography>
                        </CardContent>
                    </MuiCard>
                    {/*this svg is for the hover animation*/}
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio='none'
                        className={styles.backgroundLines}
                    >
                        <path d="M0,0 L100,0 L100,100 L0,100 L0,0" stroke={theme.palette.secondary.main} />
                    </svg>
                </Link>
            </motion.div>
            {
                contextMenuData.open && (
                <CardContextMenu
                    cardName={props.name}
                    cardType={props.type}
                    x={contextMenuData.x}
                    y={contextMenuData.y}
                    Cref={contextMenuRef}
                />)
            }
        </>
    )
}