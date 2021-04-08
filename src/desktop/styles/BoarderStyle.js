import { makeStyles } from '@material-ui/core/styles';

const ApplicantStyle = makeStyles(theme => ({
    tab: {
        minWidth: 120,
        width: 120,
    },
    tabText: {
        fontSize: '17px',
        fontWeight: '500',
    },
    searchButton: {
        color: '#FA8700',
        borderColor: '#FA8700',
        height: '40px',
        width: '60px',
        fontSize: '16px',
        padding: 0,
    },
    resetAllButton: {
        width: '100%',
        backgroundColor: '#FDB600',
        color: 'black',
        '&:hover': {
            backgroundColor: '#FDB600',
        },
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
    chipYes: {
        backgroundColor: '#23D107',
        height: '23px',
    },
    chipNo: {
        backgroundColor: '#FF3A3A',
        height: '23px',
    },
    chipWait: {
        backgroundColor: '#FDB600',
        height: '23px',
    },
    chipEmpty: {
        backgroundColor: '#A5A8A2',
        height: '23px',
    },
    chipText: {
        fontSize: '15px',
        fontWeight: '600',
        width: '60px',
        textAlign: 'center',
        color: 'white',
    },
    addButton: {
        width: '110px',
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
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

export default ApplicantStyle;
