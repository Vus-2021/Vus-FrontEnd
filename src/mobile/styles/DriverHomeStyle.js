import background from '../images/Background.png';
import { makeStyles } from '@material-ui/core/styles';

const DriverHomeStyle = makeStyles(theme => ({
    mainBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '90vh',
    },
    requireLogin: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '25px',
        lineHeight: '19px',
        display: 'flex',
        alignItems: 'center',
    },
    buttonBase: {
        paddingLeft: '8px',
        paddingRight: '8px',
    },
    loginButton: {
        color: 'white',
        backgroundColor: '#FD3434',
        '&:hover': {
            backgroundColor: '#FD3434',
        },
    },
    signUpButton: {
        color: 'white',
        backgroundColor: '#9640D9',
        '&:hover': {
            backgroundColor: '#9640D9',
        },
    },
    registerButton: {
        color: 'white',
        backgroundColor: '#CD0000',
        '&:hover': {
            backgroundColor: '#CD0000',
        },
    },
    subButton: {
        fontSize: '15px',
    },
    watchRoute: {
        height: '100%',
    },
    prevButton: {
        width: '100%',
        height: '100%',
    },
    nextButton: {
        width: '100%',
        height: '100%',
    },
    buttonText: {
        fontSize: '23px',
        fontWeight: '600',
    },
    timeLineOpposite: {
        '&.MuiTimelineOppositeContent-root': {
            padding: '1px 6px 0 0',
            flex: 0.1,
        },
    },
    timeLineDotIcon: {
        '&.MuiTimelineDot-outlinedGrey': {
            borderColor: 'grey',
            display: 'flex',
            width: '12px',
            height: '12px',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    timeLineBigDotIcon: {
        '&.MuiTimelineDot-outlinedGrey': {
            borderColor: 'red',
            display: 'flex',
            width: '35px',
            height: '35px',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    iconSize: {
        fontSize: '12px',
        color: 'grey',
    },
    iconBigSize: {
        color: 'red',
        fontSize: '35px',
    },
    timeLineContentPaper: {
        width: '100%',
    },
    locationText: {
        fontSize: '15px',
        color: 'grey',
    },
    locationBigText: {
        fontSize: '20px',
        fontWeight: 600,
    },
    passengerText: {
        fontSize: '13px',
        color: 'grey',
    },
    passengerBigText: {
        fontSize: '16px',
        color: 'black',
        fontWeight: 600,
    },
    detailButton: {
        padding: 0,
        fontSize: '13px',
        color: 'grey',
    },
    detailBigButton: {
        padding: 0,
        fontSize: '15px',
    },
}));

export default DriverHomeStyle;
