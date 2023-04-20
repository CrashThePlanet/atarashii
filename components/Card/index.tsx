import styles from '@/styles/Card.module.css'

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

interface Data {
    type: string,
    name: string,
    url?: string
}
export default function Card(props: Data): React.ReactElement {
    const theme = useTheme();
    const router = useRouter();

    const prevRoute = router.asPath.slice(0, router.asPath.lastIndexOf('/'));
    return (
        <>
            <motion.div
                className={"mx-3 cursor-pointer h-max " + styles.card}
                whileHover={{scale: 1.1}}
            >
                <Link
                    href={props.type === 'website'? (props.url + '') : (props.type === "folder" ? ('/home/' + props.name) : prevRoute)}
                    passHref
                >
                    <MuiCard className="grid place-items-center h-40 rounded">
                        {props.type === 'website'? (
                            <CardMedia
                                component='img'
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
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio='none'
                        className={styles.backgroundLines}
                    >
                        <path d="M0,0 L100,0 L100,100 L0,100 L0,0" stroke={theme.palette.secondary.main} />
                    </svg>
                </Link>
            </motion.div>
        </>
    )
}