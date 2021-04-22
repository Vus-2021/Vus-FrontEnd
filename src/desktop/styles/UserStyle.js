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
    decideButton: {
        width: '100%',
        backgroundColor: '#008AEE',
        color: 'white',
        '&:hover': {
            backgroundColor: '#008AEE',
        },
    },
    resetButton: {
        width: '100%',
        backgroundColor: '#FF3A3A',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FF3A3A',
        },
    },
    warningTitle: {
        fontSize: '23px',
        fontWeight: 600,
    },
    warningText: {
        fontSize: '18px',
        fontWeight: 400,
    },
}));

export default UserStyle;
