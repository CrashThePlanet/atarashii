import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FAB(props) {

    return (
        <div className={"absolute top-2 right-2 " + props.className} onClick={props.onClick}>
            <Tooltip title={props.tootltipInfo}>
                <Fab size="small" sx={{
                    bgcolor: 'var(--accent-color) !important'
                }}>
                    <FontAwesomeIcon icon={props.icon} ></FontAwesomeIcon>
                </Fab>
            </Tooltip>
        </div>
    )
}