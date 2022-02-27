import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export default class Input extends React.Component{
    PlainTextField = styled(TextField)({
        margin: '0.5rem 0',
        '& label.Mui-focused': {
            color: 'var(--accent-color)',
        },
        '& label': {
            color: 'var(--font-color)',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: 'var(--font-color)'
        },
        '&:hover .MuiInput-underline:before': {
            borderBottomColor: 'var(--accent-color)'
        },
        '&:hover .MuiInputBase-root:before': {
            borderBottomColor: 'var(--accent-color) !important'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'var(--accent-color)',
        },
        '& .MuiInputBase-input': {
            color: 'var(--font-color)',
        },
    });
    render() {
        return (
            <this.PlainTextField
                label={this.props.label}
                variant="standard"
                value={this.props.value}
                type={this.props.type}
                required={this.props.required}
                onChange={(e) => this.props.onChange(e.target.value)}
                className={this.props.className}
                error={this.props.error}
            />
        )
    }
}