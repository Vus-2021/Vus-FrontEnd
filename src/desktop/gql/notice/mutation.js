import gql from 'graphql-tag';

export const CREATE_ADMIN_NOTICE = gql`
    mutation createAdminNotice($noticeType: NoticeTypes!, $notice: String!, $content: String!) {
        createAdminNotice(noticeType: $noticeType, notice: $notice, content: $content) {
            success
            message
        }
    }
`;
