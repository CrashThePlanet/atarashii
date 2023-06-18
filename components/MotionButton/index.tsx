import styles from '@/styles/Button.module.css'

import react from 'react'
import { motion } from 'framer-motion';


import {
    Typography
} from '@mui/material';

import {
    useTheme
} from '@mui/material/styles';

export default function MotionButton(Props: any) {
    const theme = useTheme();
    return (
        <motion.div
            {...Props}
            className={Props.className + " " + styles.Button}
            style={{
                backgroundColor: theme.palette.secondary.main
            }}
            whileHover={{
                scale: 1.15
            }}
            whileTap={{
                scale: 0.95
            }}
        >
            <Typography variant="button">
                {Props.children}
            </Typography>
        </motion.div>
    )
}