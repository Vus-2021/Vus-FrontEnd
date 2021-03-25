// import { createUseStyles } from 'react-jss';
import { makeStyles } from '@material-ui/core/styles';
import background from '../images/Background.png';

const AdminStyle = makeStyles(theme => ({
    rootBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100%',
        overflow: 'auto',
    },
    mainBox: {
        padding: '10px',
        height: 'calc(100% - 80px)',
        overflow: 'auto',
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },
    mainBoxShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 250,
    },
    viewBox: {
        height: `calc(100% - 40px)`,
        paddingLeft: '30px',
    },
    titleText: {
        fontSize: '23px',
        fontWeight: '500',
    },
}));

export default AdminStyle;
