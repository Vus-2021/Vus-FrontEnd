import { makeStyles } from '@material-ui/core/styles';

const RegisterStyle = makeStyles(theme => ({
    tab: {
        minWidth: '50%',
        width: '50%',
    },
    tabText: {
        fontSize: '17px',
        fontWeight: '500',
    },
    registerButton: {
        borderRadius: 50,
        color: 'white',
        backgroundColor: '#FD3434',
        width: '100%',
        textTransform: 'none',
        fontSize: '16px',
        '&:hover': {
            color: 'white',
            backgroundColor: '#FD3434',
        },
    },
    cancelButton: {
        borderRadius: 50,
        color: 'white',
        backgroundColor: '#FD3434',
        width: '100%',
        textTransform: 'none',
        fontSize: '16px',
        '&:hover': {
            color: 'white',
            backgroundColor: '#FD3434',
        },
    },
    warningTitle: {
        fontSize: '23px',
        fontWeight: 600,
    },
    warningText: {
        fontSize: '18px',
        fontWeight: 400,
    },
    resetButton: {
        width: '100%',
        backgroundColor: '#FF3A3A',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF3A3A',
        },
    },
    decideButton: {
        width: '100%',
        backgroundColor: '#008AEE',
        color: 'white',
        '&:hover': {
            backgroundColor: '#008AEE',
        },
    },
}));

export default RegisterStyle;
