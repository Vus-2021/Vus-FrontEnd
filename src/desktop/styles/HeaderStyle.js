import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 250;

const HeaderStyle = makeStyles(theme => ({
    headerBar: {
        backgroundColor: '#D81717',
        zIndex: theme.zIndex.drawer + 1,
        padding: 0,
    },
    logoBox: {
        flexGrow: 1,
    },
    adminId: {
        fontSize: '18px',
        fontWeight: '700',
    },
    toolbar: theme.mixins.toolbar,
    menuDrawer: {
        flexShrink: 0,
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    listIcon: {
        fontSize: 30,
    },
    listText: {
        fontSize: '19px',
        fontWeight: '400',
    },
    nestedIcon: {
        fontSize: 25,
    },
    nested: {
        paddingLeft: theme.spacing(6),
    },
    nestedText: {
        fontSize: '17px',
        fontWeight: '400',
    },
}));

export default HeaderStyle;
