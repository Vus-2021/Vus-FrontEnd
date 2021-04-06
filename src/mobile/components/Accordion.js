import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: '1px solid rgba(0, 0, 0, .125)',
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            marginTop: '0',
            marginBotton: '5px',
        },
    },
    expanded: {},
})(MuiAccordion);

export default Accordion;
