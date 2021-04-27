import gql from 'graphql-tag';

export const INIT_PASSWORD = gql`
    mutation initPassword($userId: String, $password: String) {
        initPassword(userId: $userId, password: $password) {
            success
            message
            code
        }
    }
`;
