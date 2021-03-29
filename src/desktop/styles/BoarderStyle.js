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
    chipText: {
        fontSize: '15px',
        fontWeight: '600',
        width: '60px',
        textAlign: 'center',
        color: 'white',
    },
}));

export default ApplicantStyle;
