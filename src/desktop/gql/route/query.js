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

export const GET_DETAIL_ROUTES = gql`
    query getDetailRoutes($route: String!) {
        getDetailRoutes(route: $route) {
            success
            message
            data {
                partitionKey
                boardingTime
                location
                lat
                long
                imageUrl
                route
            }
        }
    }
`;

export const GET_ROUTES_INFO = gql`
    query getRoutesInfo($route: String) {
        getRoutesInfo(route: $route) {
            success
            message
            data {
                partitionKey
                busNumber
                limitCount
                route
                driver {
                    phone
                    name
                    userId
                }
                imageUrl
            }
        }
    }
`;

export const CHECK_USERID = gql`
    query($userId: String, $sortKey: String) {
        checkUserId(userId: $userId, sortKey: $sortKey) {
            success
        }
    }
`;
