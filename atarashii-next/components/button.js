import { motion } from 'framer-motion';

export default function Button(props) {
    return (
        <motion.div
            className={"w-full h-10 grid place-items-center bg-acc p-2 rounded-lg cursor-pointer shadow-lg " + props.className}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            onClick={props.onClick}
        >
            {props.buttontext}
        </motion.div>
    )
}