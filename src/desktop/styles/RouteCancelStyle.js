import { makeStyles } from '@material-ui/core/styles';

const RouteCancelStyle = makeStyles(theme => ({
    buttonAdmit: {
        backgroundColor: '#008AEE',
        '&:hover': {
            backgroundColor: '#008AEE',
        },
    },
    buttonReject: {
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
}));

export default RouteCancelStyle;
