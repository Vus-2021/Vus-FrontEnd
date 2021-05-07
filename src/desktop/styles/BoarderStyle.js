import { makeStyles } from '@material-ui/core/styles';

const BoarderStyle = makeStyles(theme => ({
    tab: {
        minWidth: 120,
        width: 120,
        alignItems: 'center',
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
    reviseButton: {
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
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
    customToolBar: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '30px',
    },
    buttonDelete: {
        backgroundColor: '#F63434',
        height: '30px',
        '&:hover': {
            backgroundColor: '#F63434',
        },
    },
    selectionDecideButton: {
        width: '100%',
        height: '30px',
        fontWeight: 400,
        backgroundColor: '#FA8700',
        color: 'white',
        '&:hover': {
            backgroundColor: '#FA8700',
        },
    },
    selectionResetButton: {
        width: '100%',
        height: '30px',
        fontWeight: 400,
        backgroundColor: '#D81717',
        color: 'white',
        '&:hover': {
            backgroundColor: '#D81717',
        },
    },
    deleteIcon: {
        fontSize: '18px',
    },
    deleteText: {
        fontSize: '13px',
    },
}));

export default BoarderStyle;
