import { makeStyles } from '@material-ui/core/styles';

const MyInformationStyle = makeStyles(theme => ({
    accountText: {
        backgroundColor: '#DCDCDC',
        display: 'flex',
        alignItems: 'center',
        fontSize: '15px',
        fontWeight: '500',
        borderTop: '1px solid #B0B0B0',
        borderBottom: '1px solid #B0B0B0',
    },
    textTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginRight: '30px',
    },
    textContent: {
        fontSize: '17px',
        fontWeight: '600',
        color: '#FF8686',
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
    chipCancel: {
        backgroundColor: '#E4E4E4',
        color: 'black',
        height: '23px',
    },
    chipEmpty: {
        backgroundColor: '#A5A8A2',
        height: '23px',
    },
    darkChipText: {
        fontSize: '15px',
        fontWeight: '400',
        width: '60px',
        textAlign: 'center',
        color: 'black',
    },
    chipText: {
        fontSize: '15px',
        fontWeight: '600',
        width: '60px',
        textAlign: 'center',
        color: 'white',
    },
}));

export default MyInformationStyle;
