import { withStyles } from '@material-ui/core/styles';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

const AccordionSummary = withStyles(theme => ({
    root: {
        paddingX: theme.spacing(2),
        backgroundColor: '#F8F8F8',
    },
}))(MuiAccordionDetails);

export default AccordionSummary;
