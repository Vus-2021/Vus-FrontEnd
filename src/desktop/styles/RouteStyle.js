import { makeStyles } from '@material-ui/core/styles';

const RouteStyle = makeStyles(theme => ({
    registerPaper: {
        backgroundColor: '#F4F4F4',
    },
    registerButton: {
        borderRadius: '50px',
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
            color: 'white',
        },
    },
}));

export default RouteStyle;
