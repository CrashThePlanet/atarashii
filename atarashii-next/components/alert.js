import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';

export default class Alert extends React.Component {
    state= {
        colors: {
            success: '#00C851',
            error: '#FF5252',
            warning: '#FFA000'
        }

    }
    componentDidUpdate(prevProps) {
        if (this.props.open) {
            setTimeout(() => {
                this.props.closeAlert();
            }, 5000);
        }
    }

    render() {
        return (
            <AnimatePresence>
                {this.props.open && (
                    <motion.div
                    className={"absolute bottom-2 right-2 p-3 rounded-lg shadow-lg z-50 w-full"}
                    style={{
                        backgroundColor: (this.props.data.type === 'success' ? this.state.colors.success : (this.props.data.type === 'error' ? this.state.colors.error : this.state.colors.warning)),
                        maxWidth: '250px',
                        zIndex: 9999
                    }}
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    >
                        <p>{this.props.data.statusCode}</p>
                        <p>{this.props.data.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }
}