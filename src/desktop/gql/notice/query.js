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

export const GET_ONE_ADMIN_NOTICE = gql`
    query getOneAdminNotice($partitionKey: String) {
        getOneAdminNotice(partitionKey: $partitionKey) {
            success
            message
            code
            data {
                notice
                content
                createdAt
            }
        }
    }
`;
