import gql from 'graphql-tag';

export const GET_USERS = gql`
    query getUsers($userId: String, $name: String, $type: String, $isMatched: Boolean) {
        getUsers(userId: $userId, name: $name, type: $type, isMatched: $isMatched) {
            success
            message
            data {
                userId
                name
                type
                registerDate
                phoneNumber
            }
        }
    }
`;
