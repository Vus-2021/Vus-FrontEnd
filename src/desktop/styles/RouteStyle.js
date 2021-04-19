import { makeStyles } from '@material-ui/core/styles';

const RouteStyle = makeStyles(theme => ({
    menuDrawer: {
        flexShrink: 0,
    },
    menuButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        position: 'absolute',
        top: '40%',
        height: '50px',
        zIndex: '5600',
        display: 'flex',
        alignItems: 'center',
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        left: 0,
        borderRadius: '0 50px 50px 0',
    },
    menuButtonShift: {
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        left: 290,
        borderRadius: '50px 0 0 50px',
    },

    routeModal: {
        keepMounted: true,
        container: document.getElementById('kakaoMap'),
        style: { position: 'absolute' },
    },
    routePaper: {
        position: 'absolute',
        zIndex: '5500',
        top: '60px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: '325px',
    },
    timeLineOpposite: {
        padding: '1px 6px 0 0',
        flex: 0.1,
    },
    boardingTimeText: {
        fontSize: '15px',
    },
    timeLineDotIcon: {
        borderColor: 'red',
    },
    iconSize: {
        fontSize: '15px',
        color: 'red',
    },
    timeLineContentPaper: {
        width: '100%',
        textAlign: 'left',
    },

    buttonBase: {
        display: 'flex',
        width: '100%',
        alignItems: 'flex-start',
        flexDirection: 'column',
    },

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
