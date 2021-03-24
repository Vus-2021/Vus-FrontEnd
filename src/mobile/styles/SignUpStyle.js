import { createUseStyles } from 'react-jss';

const SignUpStyle = createUseStyles({
    idBox: {
        display: 'flex',
        flexFlow: 'column',
    },
    checkIdButton: {
        '&.MuiButton-outlined': {
            padding: '7px 5px',
        },
    },
    registerButton: {
        '&.MuiButton-root': {
            borderRadius: 50,
            color: 'white',
            backgroundColor: '#F69017',
            width: '100%',
            textTransform: 'none',
            fontSize: '16px',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#F69017',
        },
    },
});

export default SignUpStyle;
