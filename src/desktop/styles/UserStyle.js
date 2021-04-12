import { makeStyles } from '@material-ui/core/styles';

const UserStyle = makeStyles(theme => ({
    mainBox: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    buttonDelete: {
        height: '30px',
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
    excelButton: {
        height: '30px',
    },
    registerButton: {
        color: 'white',
        backgroundColor: '#FA8700',
        height: '40px',
        '&:hover': {
            color: 'white',
            backgroundColor: '#FA8700',
        },
    },
    customToolBar: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '30px',
    },
}));

export default UserStyle;
