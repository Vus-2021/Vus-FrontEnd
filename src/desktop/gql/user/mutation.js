import gql from 'graphql-tag';

export const DELETE_USER = gql`
    mutation deleteUser($userId: [String]) {
        deleteUser(userId: $userId) {
            success
            message
        }
    }
`;
