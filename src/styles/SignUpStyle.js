import { createUseStyles } from 'react-jss';

const SignUpStyle = createUseStyles({
    headerBox: {
        backgroundColor: '#E43131',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
    },
    headerTitle: {
        '&.MuiTypography-body1': {
            letterSpacing: '4px',
            fontSize: '17px',
        },
    },
    idBox: {
        display: 'flex',
        flexFlow: 'column',
    },
    registerBox: {},
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
