import gql from 'graphql-tag';

export const CHECK_USERID = gql`
    query($userId: String) {
        checkUserId(userId: $userId) {
            success
        }
    }
`;
