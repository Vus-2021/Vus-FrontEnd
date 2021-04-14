import { makeStyles } from '@material-ui/core/styles';

const heightValue = '100px';

const BusInfoStyle = makeStyles(theme => ({
    tab: {
        height: '40px',
    },
    busNotify: {
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'red',
    },
    notifyText: {
        fontSize: '15px',
    },
    routePaper: {
        height: '95%',
        overflow: 'auto',
    },
    timeLineOpposite: {
        padding: '1px 6px 0 0',
        flex: 0.1,
    },
    timeLineDotIcon: {
        borderColor: 'red',
    },
    iconSize: {
        fontSize: '11px',
        color: 'red',
    },
    timeLineContentPaper: {
        width: '100%',
    },
    busLocation: {
        height: '80%',
        color: '#FF6666',
    },

    menuDrawer: {
        flexShrink: 0,
    },
    menuButton: {
        backgroundColor: 'rgba(255,149,128,0.9)',
        position: 'absolute',
        bottom: '0%',
        left: '50%',
        transform: 'translate(-50%,0)',
        zIndex: '5600',
        display: 'flex',
        alignItems: 'center',
        transition: theme.transitions.create('bottom', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: '50px',
        borderRadius: '100px 100px 0 0',
    },
    menuButtonShift: {
        transition: theme.transitions.create('bottom', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        bottom: heightValue,
        width: '50px',
        borderRadius: '50px 50px 0 0',
    },
    infoModal: {
        keepMounted: true,
        container: document.getElementById('kakaoMap'),
        style: { position: 'absolute' },
    },
    infoPaper: {
        position: 'absolute',
        zIndex: '5500',
        bottom: '0%',
        backgroundColor: 'rgba(255,149,128,0.9)',
        width: '100%',
        height: heightValue,
    },
    busInfoTitle: {
        fontSize: '20px',
        fontWeight: '600',
    },
    busInfoPaper: {
        border: '1px solid',
        padding: '2px 10px 2px 10px',
    },
    busNumber: {
        fontWeight: 600,
        wordSpacing: '5px',
    },
}));

export default BusInfoStyle;
