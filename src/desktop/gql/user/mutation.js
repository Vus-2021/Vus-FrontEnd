import gql from 'graphql-tag';

export const DELETE_USER = gql`
    mutation deleteUser($userId: [String]) {
        deleteUser(userId: $userId) {
            success
            message
        }
    }
`;

export const INIT_PASSWORD = gql`
    mutation initPassword($userId: String, $password: String) {
        initPassword(userId: $userId, password: $password) {
            success
            message
            code
        }
    }
`;
