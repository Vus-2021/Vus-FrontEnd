import { makeStyles } from '@material-ui/core/styles';

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
}));

export default BusInfoStyle;
