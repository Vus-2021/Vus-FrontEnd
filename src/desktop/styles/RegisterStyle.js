import { makeStyles } from '@material-ui/core/styles';

const RegisterStyle = makeStyles(theme => ({
    tab: {
        minWidth: props => (props ? 60 : 90),
        alignItems: 'center',
    },
    tabText: {
        fontSize: props => (props ? '15px' : '17px'),
        fontWeight: '500',
    },
    checkIdButton: {
        height: '40px',
    },
    registerButton: {
        width: '100%',
        borderRadius: '5px',
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
        },
        alignItems: 'center',
    },
    passwordButton: {
        width: '100%',
        borderRadius: '5px',
        backgroundColor: '#FF3A3A',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF3A3A',
        },
        alignItems: 'center',
    },
    warningTitle: {
        fontSize: '23px',
        fontWeight: 600,
    },
    warningText: {
        fontSize: '18px',
        fontWeight: 400,
    },
    decideButton: {
        width: '100%',
        backgroundColor: '#008AEE',
        color: 'white',
        '&:hover': {
            backgroundColor: '#008AEE',
        },
    },
    resetButton: {
        width: '100%',
        backgroundColor: '#FF3A3A',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF3A3A',
        },
    },
}));

export default RegisterStyle;
