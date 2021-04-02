import { createUseStyles } from 'react-jss';

const LogInStyle = createUseStyles({
    registerButton: {
        '&.MuiButton-root': {
            borderRadius: 50,
            color: 'white',
            backgroundColor: '#FD3434',
            width: '100%',
            textTransform: 'none',
            fontSize: '16px',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#FD3434',
        },
    },
});

export default LogInStyle;
