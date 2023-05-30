import styles from '@/styles/Card.module.css'
import react, { MutableRefObject } from 'react';

import {
    Card as MuiCard,
    CardMedia,
    Typography,
    CardContent,
    TextField
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { motion } from 'framer-motion';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTurnUp } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'next/router';

import CardContextMenu from './contextMenu';
import { useAppContext } from '@/pages/_app';

interface Data {
    type: string,
    name: string,
    url?: string
}
export default function Card(props: Data): React.ReactElement {
    const theme = useTheme();
    const router = useRouter();
    const appContext = useAppContext();
    const [contextMenuData, setContextMenuData] = react.useState({open: false, x: 0, y: 0});
    const [editMode, setEditMode] = react.useState<Boolean>(false);
    const [editValue, setEditValue] = react.useState<String>(props.name);
    const cardRef = react.useRef<any>();
    const contextMenuRef = react.useRef<any>();
    const editNameRef = react.useRef<any>();

    const previousRoute = router.asPath.slice(0, router.asPath.lastIndexOf('/'));

    const test = () => editMode;

    react.useEffect(() => {
        function init() {
            // listen if for right click on a card --> open context menu
            cardRef.current?.addEventListener('contextmenu', (e: any) => {
                e.preventDefault();
                if (contextMenuRef.current?.contains(e.target)) return;
                setContextMenuData({open: true, x: e.x, y: e.y});
            });

            function handleMouseClick(e: any) {
                if (!cardRef.current?.contains(e.target) && !contextMenuRef.current?.contains(e.target)) {
                    setTimeout(() => {
                        setContextMenuData({...contextMenuData, open: false});
                    }, 100);
                }
                if (!(cardRef.current?.contains(e.target) || editNameRef.current?.contains(e.target))) {
                    resetEdit();
                }
            }
            // listen for click outside card or context menu --> close context menu
            document.addEventListener('mousedown', handleMouseClick);
            return () => {document.removeEventListener('mousedown', handleMouseClick)}
        };
        init()
    }, []);

    const handleEdit = (): void => {
        setEditMode(true);
        setContextMenuData({...contextMenuData, open: false});        
    }
    const resetEdit = (): void => {
        setEditMode(false);
        setEditValue(props.name)
    }
    const handleSubmit = async (e: any) => {
        if (e.code === 'Enter') {
            if (editValue.trim() === props.name) return resetEdit();
            if (editValue.trim().length <= 0) return resetEdit();

            const res = await fetch('/api/cards/edit', {
                method: 'POST',
                body: JSON.stringify({
                    target: props.name,
                    type: props.type,
                    newName: editValue.trim(),
                    path: router.query.cards
                })
            });
            if (!res.ok) {
                const resText = await res.text();
                appContext.openSnackbar(res.status + ': ' + (resText === undefined ? res.statusText : resText), 'error');
                return;
            }
            setEditMode(false);
            setEditValue(editValue.trim());
            appContext.openSnackbar('Name changed', 'success');
            appContext.cardContainerRef?.current.loadCards();
        }
    }

    return (
        <>
            <motion.div
                className={"mx-3 cursor-pointer h-max " + styles.card}
                whileHover={{scale: 1.1}}
                ref={cardRef}
            >
                <Link
                    href={props.type === 'website'? (props.url + '') : (props.type === "folder" ? (router.asPath + '/' + props.name) : previousRoute)}
                    onClick={(e:any) => {if (editMode) {e.preventDefault()}}}

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
                                {editMode ? (
                                    <TextField value={editValue} onChange={(e:any) => {setEditValue(e.target.value)}} onKeyUp={handleSubmit} ref={editNameRef} />
                                ) : (props.name)}
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
                    handleEdit={() => handleEdit()}
                />)
            }
        </>
    )
}