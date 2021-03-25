import { makeStyles } from '@material-ui/core/styles';

const UserStyle = makeStyles(theme => ({
    mainBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    buttonDelete: {
        backgroundColor: '#F63434',
        '&:hover': {
            backgroundColor: '#F63434',
        },
    },
    searchBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchButton: {
        color: '#FA8700',
        borderColor: '#FA8700',
        height: '40px',
        width: '60px',
        fontSize: '16px',
        padding: 0,
    },
    registerBox: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    registerButton: {
        color: 'white',
        backgroundColor: '#0078CE',
        height: '40px',
    },
}));

export default UserStyle;
