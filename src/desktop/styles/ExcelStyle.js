import { makeStyles } from '@material-ui/core/styles';

const ExcelStyle = makeStyles(theme => ({
    excelButton: {
        border: '1px solid green',
    },
    submitButton: {
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
            backgroundColor: 'green',
        },
    },
}));

export default ExcelStyle;
