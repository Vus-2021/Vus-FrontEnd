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
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
        },
    },
    reviseButton: {
        backgroundColor: '#0E8AE3',
        color: 'white',
        '&:hover': {
            backgroundColor: '#0E8AE3',
        },
    },
    deleteButton: {
        backgroundColor: '#FF0000',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF0000',
        },
    },
    placeName: {
        fontSize: '16px',
        fontWeight: '600',
    },
    addressName: {
        fontSize: '13px',
        fontWeight: '400',
    },
    deleteRouteTitle: {
        fontSize: '22px',
        fontWeight: '600',
    },
}));

export default RouteStyle;
