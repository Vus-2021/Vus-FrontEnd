import { makeStyles } from '@material-ui/core/styles';

const RegisterStyle = makeStyles(theme => ({
    tab: {
        minWidth: 90,
        alignItems: 'center',
    },
    tabText: {
        fontSize: '17px',
        fontWeight: '500',
    },
    checkIdButton: {
        height: '40px',
    },
    registerButton: {
        width: '100%',
        borderRadius: '50px',
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
        },
        alignItems: 'center',
    },
}));

export default RegisterStyle;
