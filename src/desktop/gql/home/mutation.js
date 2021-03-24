import gql from 'graphql-tag';

export const SIGNIN = gql`
    mutation signin($userId: ID!, $password: String) {
        signin(userId: $userId, password: $password) {
            success
            message
            data {
                accessToken
                refreshToken
            }
        }
    }
`;
