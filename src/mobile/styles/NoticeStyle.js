import { makeStyles } from '@material-ui/core/styles';

const NoticeStyle = makeStyles(theme => ({
    searchButton: {
        color: '#FA0000',
        borderColor: '#FA0000',
        height: '40px',
        width: '60px',
        fontSize: '16px',
        padding: 0,
    },
    menuItem: {
        minHeight: '33px',
    },
    noticeField: {
        borderRadius: '4px',
        border: '1px solid #FF6666',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    noticeTitle: {
        fontSize: '17px',
        fontWeight: 600,
    },
    noticeCreatedAt: {
        fontSize: '14px',
        fontWeight: 400,
    },
    noticeAuthor: {
        fontSize: '13px',
        fontWeight: 400,
    },
    noticeUpdatedAt: {
        fontSize: '14px',
        fontWeight: 400,
    },
}));

export default NoticeStyle;
