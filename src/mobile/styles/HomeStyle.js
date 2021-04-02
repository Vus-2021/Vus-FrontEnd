import { makeStyles } from '@material-ui/core/styles';
import background from '../images/Background.png';

const HomeStyle = makeStyles(theme => ({
    mainBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '90vh',
    },
    requireLogin: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '20px',
        lineHeight: '19px',
        /* identical to box height */

        display: 'flex',
        alignItems: 'center',
    },
    getMyData: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    buttonFont: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '15px',
    },
    chooseBus: {
        overflowX: 'auto',
        overflowY: 'hidden',
    },
    busList: {
        '&.MuiGridList-root': {
            flexWrap: 'nowrap',
        },
        transform: 'translateZ(0)',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
    },
    busCard: {
        '&.MuiPaper-root': {
            borderRadius: '13px',
        },
        marginRight: '10px',
        height: '95%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1.5px solid',
    },
    cardAction: {
        '&.MuiCardActionArea-root': {
            height: '100%',
        },
    },
    busInfo: {
        border: '1px solid',
    },
    busNumber: {
        '&.MuiTypography-body1': {
            fontWeight: 600,
        },
    },
    busNotify: {
        border: '1px solid',
        borderRadius: '10px',
        borderColor: '#FF0000',
        backgroundColor: 'white',
    },
    notifyText: {
        '&.MuiTypography-body1': {
            fontSize: '15px',
        },
    },
    board: {
        overflow: 'hidden',
        border: '1px solid',
        borderRadius: '15px',
        borderColor: '#FF0000',
        backgroundColor: 'white',
    },
    boardTitle: {
        '&.MuiTypography-body1': {
            fontSize: '18px',
            fontWeight: 600,
        },
    },
    boardMore: {
        '&.MuiTypography-body1': {
            fontSize: '15px',
            fontWeight: 450,
        },
    },
    boardDivider: {
        '&.MuiDivider-root': {
            backgroundColor: 'black',
        },
    },
    noticeTitle: {
        '&.MuiTypography-body1': {
            fontSize: '16px',
        },
    },
    noticeDate: {
        '&.MuiTypography-body1': {
            fontSize: '13px',
            color: '#766766',
        },
    },
    buttonList: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignContent: 'center',
    },
    buttonCommon: {
        '&.MuiButtonBase-root': {
            marginBottom: '10px',
            width: '60%',
            borderRadius: '25px',
            fontSize: '15px',
        },
    },
    loginButton: {
        '&.MuiButton-root': {
            color: 'white',
            backgroundColor: '#FD3434',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#FD3434',
        },
    },
    signUpButton: {
        '&.MuiButton-root': {
            color: 'white',
            backgroundColor: '#9640D9',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#9640D9',
        },
    },
    countText: {
        '&.MuiTypography-body1': {
            fontSize: '15px',
        },
    },
}));

export default HomeStyle;
