import gql from 'graphql-tag';

export const CREATE_ADMIN_NOTICE = gql`
    mutation createAdminNotice($noticeType: NoticeTypes!, $notice: String!, $content: String!) {
        createAdminNotice(noticeType: $noticeType, notice: $notice, content: $content) {
            success
            message
        }
    }
`;

export const UPDATE_ADMIN_NOTICE = gql`
    mutation updateAdminNotice($partitionKey: String!, $notice: String!, $content: String!) {
        updateAdminNotice(partitionKey: $partitionKey, notice: $notice, content: $content) {
            success
            message
            code
        }
    }
`;

export const DELETE_NOTICE = gql`
    mutation deleteNotice($partitionKey: [String]!) {
        deleteNotice(partitionKey: $partitionKey) {
            success
            message
            code
        }
    }
`;
