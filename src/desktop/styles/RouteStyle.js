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
    errorButton: {
        color: '#f44336',
        borderColor: '#f44336',
        '&:hover': {
            color: '#f44336',
            borderColor: '#f44336',
        },
    },
    imageButton: {
        color: '#008AEE',
        '&:hover': {
            color: '#008AEE',
        },
    },
    imageText: {
        textTransform: 'none',
    },
    searchField: {
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    searchText: {
        backgroundColor: 'white',
        opacity: 1,
    },
    searchButton: {
        height: '40px',
        borderRadius: '5px',
    },
    placeName: {
        fontSize: '16px',
        fontWeight: '600',
    },
    addressName: {
        fontSize: '13px',
        fontWeight: '400',
    },
}));

export default RouteStyle;
