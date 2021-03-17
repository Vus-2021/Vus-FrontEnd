import { createUseStyles } from 'react-jss';
import background from '../images/Background.png';

const HomeStyle = createUseStyles({
    mainBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '90vh',
    },
    requireLogin: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '23px',
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
        height: '38%',
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
        backgroundColor: '#F6F6F6',
        border: '1px solid',
    },
    cardAction: {
        '&.MuiCardActionArea-root': {
            height: '100%',
        },
    },
    busInfo: {
        border: '1px solid',
        borderRadius: '30px',
        backgroundColor: '#0EBB1F',
        color: 'white',
    },
    moreBoard: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    board: {
        height: '27%',
        overflow: 'hidden',
        border: '1px solid',
        borderRadius: '15px',
        backgroundColor: '#F6F6F6',
    },
    tabBox: {
        overflow: 'auto',
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
            backgroundColor: '#F69017',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#F69017',
        },
    },
    signUpButton: {
        '&.MuiButton-root': {
            color: 'white',
            backgroundColor: '#7D82FD',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#7D82FD',
        },
    },
});

export default HomeStyle;
