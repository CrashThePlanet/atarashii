import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { styled } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'


export default function SettingsSpeedDial(props) {

    const StyledSpeeDail = styled(SpeedDial)({
        '& .MuiSpeedDial-fab': {
            '&:hover': {
                backgroundColor: 'var(--accent-color)',
            },
            backgroundColor: 'var(--secondary-color)',
            fontSize: '20px'
        },
        '& .MuiSpeedDial-actions': {
            '& .MuiSpeedDialAction-fab': {
                backgroundColor: 'var(--accent-color)',
                marginTop: '1px'
            }
        }
    })

    return (
        <StyledSpeeDail
            ariaLabel="SpeedDial functions"
            icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
            direction="down"
        >
            {
                props.actions.map((action, index) => {
                    return (
                        <SpeedDialAction
                            key={index}
                            icon={<FontAwesomeIcon icon= {action.icon} />}
                            tooltipTitle={action.title}
                            onClick={action.onClick}
                        />
                    )
                })
            }
        </StyledSpeeDail>
    )
}