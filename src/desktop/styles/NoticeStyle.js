import { makeStyles } from '@material-ui/core/styles';

const NoticeStyle = makeStyles(theme => ({
    buttonDelete: {
        backgroundColor: '#F63434',
        '&:hover': {
            backgroundColor: '#F63434',
        },
    },
    searchButton: {
        color: '#FA8700',
        borderColor: '#FA8700',
        height: '40px',
        width: '60px',
        fontSize: '16px',
        padding: 0,
    },
    registerButton: {
        color: 'white',
        backgroundColor: '#0078CE',
        height: '40px',
        '&:hover': {
            color: 'white',
            backgroundColor: '#0078CE',
        },
        alignItems: 'center',
    },
    createButton: {
        width: '80px',
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: '3px',
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
        },
    },
    reviseButton: {
        width: '80px',
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: '3px',
        backgroundColor: '#008AEE',
        color: 'white',
        '&:hover': {
            backgroundColor: '#008AEE',
        },
    },
    deleteButton: {
        width: '80px',
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: '3px',
        backgroundColor: '#FF3A3A',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF3A3A',
        },
    },
    iconStyle: {
        fontSize: 30,
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
    warningTitle: {
        fontSize: '23px',
        fontWeight: 600,
    },
    warningText: {
        fontSize: '18px',
        fontWeight: 400,
    },
}));
export default NoticeStyle;
