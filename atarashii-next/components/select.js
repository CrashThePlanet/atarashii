import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

import React from 'react';

export default class Select extends React.Component{
    SelectTextField = styled(TextField)({
        marginTop: '0.5rem',
        '& label.Mui-focused': {
            color: 'var(--accent-color)',
        },
        '& label': {
            color: 'var(--font-color)',
        },
        '& .MuiSelect-standard': {
            color: 'var(--font-color)',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'var(--font-color)'
        },
        '&:hover .MuiInput-underline:before': {
            borderBottomColor: 'var(--accent-color)'
        },
        '&:hover .MuiInputBase-root': {
            borderBottomColor: 'var(--accent-color)',
        },
        '&:hover .MuiInput-root:before': {
            borderBottomColor: 'var(--accent-color) !important',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--accent-color)',
        }
    });
    render() {
        return (
            <this.SelectTextField
                select
                label="select Type"
                value={this.props.selectedType}
                onChange={(e) => this.props.updateType(e.target.value)}
                variant="standard"
                className={this.props.className}
            >
                {this.props.items.map((item, index) => <MenuItem key={index} value={item.value}>{item.content}</MenuItem> )}
            </this.SelectTextField>
        )
    }
}