import { makeStyles } from '@material-ui/core/styles';

const BoarderSelectionStyle = makeStyles(theme => ({
    selectedTitle: {
        fontSize: '20px',
        fontWeight: '600',
    },
    selectedTable: {
        minHeight: '95px',
        overflow: 'hidden',
    },
    tableHead: {
        backgroundColor: '#E5E5E5',
    },
    tableHeadCell: {
        borderRight: '1px solid #FFFFFF',
        padding: '8px',
        fontWeight: '600',
    },
    tableBodyCell: {
        border: '1px solid #E2E2E2',
        padding: '14px',
    },
    monthText: {
        height: '15px',
        width: '28px',
    },
    selectionButton: {
        width: '100%',
        backgroundColor: '#008AEE',
        color: 'white',
        '&:hover': {
            backgroundColor: '#008AEE',
        },
    },
}));

export default BoarderSelectionStyle;
