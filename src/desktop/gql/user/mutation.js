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

export const UPDATE_USER = gql`
    mutation updateUser(
        $userId: ID!
        $name: String!
        $phoneNumber: String!
        $type: UserType!
        $registerDate: Date!
    ) {
        updateUser(
            userId: $userId
            name: $name
            phoneNumber: $phoneNumber
            type: $type
            registerDate: $registerDate
        ) {
            success
            message
            code
        }
    }
`;
