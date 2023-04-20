import react from 'react';

import {
    TextField
} from '@mui/material';

import {
    useTheme
} from '@mui/material/styles';

export default function NormalInput(Props: any) {
    const theme = useTheme();
    return (
        <TextField
            {...Props}
            variant='outlined'
            sx={{
                "& label": {
                    color: theme.palette.text.primary + " !important"
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary.main + " !important"
                }
            }}
        />
    );
}