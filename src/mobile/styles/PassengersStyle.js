import { makeStyles } from '@material-ui/core/styles';

const PassengersStyle = makeStyles(theme => ({
    mainTitle: {
        fontSize: '18px',
        fontWeight: '600',
    },
    listItem: {
        padding: 0,
    },
    phoneNumberList: {
        textAlign: 'right',
    },
}));

export default PassengersStyle;
