import { makeStyles } from '@material-ui/core/styles';
import background from '../images/Background.png';

const HomeStyle = makeStyles(theme => ({
    mainBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
    },
    applyText: {
        '&.MuiTypography-body1': {
            fontSize: '17px',
            fontWeight: '500',
        },
    },
    requireLogin: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '20px',
        lineHeight: '19px',
        /* identical to box height */
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
        display: 'flex',
        justifyContent: 'center',
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
    busSlide: {
        height: '40px',
    },

    chipYes: {
        '&.MuiChip-root': {
            backgroundColor: '#23D107',
            height: '20px',
        },
    },
    chipNo: {
        '&.MuiChip-root': {
            backgroundColor: '#FF3A3A',
            height: '20px',
        },
    },
    chipWait: {
        '&.MuiChip-root': {
            backgroundColor: '#FDB600',
            height: '23px',
        },
    },
    chipCancel: {
        '&.MuiChip-root': {
            backgroundColor: '#E4E4E4',
            color: 'black',
            height: '23px',
        },
    },
    chipEmpty: {
        '&.MuiChip-root': {
            backgroundColor: '#A5A8A2',
            height: '23px',
        },
    },
    darkChipText: {
        fontSize: '15px',
        fontWeight: '400',
        width: '50px',
        textAlign: 'center',
        color: 'black',
    },
    chipText: {
        fontSize: '15px',
        fontWeight: '600',
        width: '50px',
        textAlign: 'center',
        color: 'white',
    },
}));

export default HomeStyle;
