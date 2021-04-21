import gql from 'graphql-tag';

export const CHECK_USERID = gql`
    query($userId: String, $sortKey: String) {
        checkUserId(userId: $userId, sortKey: $sortKey) {
            success
        }
    }
`;
