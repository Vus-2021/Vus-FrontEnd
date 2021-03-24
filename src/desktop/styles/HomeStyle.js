import { createUseStyles } from 'react-jss';
import background from '../images/Background.png';

const HomeStyle = createUseStyles({
    rootBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100%',
        overflow: 'auto',
    },
    mainBox: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    loginPaper: {
        '&.MuiPaper-root': {
            backgroundColor: '#F4F4F4',
        },
    },
    registerButton: {
        '&.MuiButton-root': {
            borderRadius: 50,
            color: 'white',
            backgroundColor: '#F69017',
            width: '100%',
            textTransform: 'none',
            fontSize: '16px',
        },
        '&.MuiButton-root:hover': {
            color: 'white',
            backgroundColor: '#F69017',
        },
    },
    alert: {
        width: '360px',
    },
});

export default HomeStyle;
