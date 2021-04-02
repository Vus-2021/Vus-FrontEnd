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
}));

export default RegisterStyle;
