import gql from 'graphql-tag';

export const GET_ADMIN_NOTICE = gql`
    query getAdminNotice($notice: String, $name: String, $content: String) {
        getAdminNotice(notice: $notice, name: $name, content: $content) {
            success
            message
            data {
                partitionKey
                sortKey
                notice
                author
                userId
                createdAt
                updatedAt
            }
        }
    }
`;
