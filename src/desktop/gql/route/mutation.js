import gql from 'graphql-tag';

export const CREATE_ROUTE = gql`
    mutation createRoute(
        $route: String!
        $busNumber: String!
        $limitCount: Int!
        $driver: driver!
        $imageUrl: String
    ) {
        createRoute(
            route: $route
            busNumber: $busNumber
            limitCount: $limitCount
            driver: $driver
            imageUrl: $imageUrl
        ) {
            success
            message
            data {
                partitionKey
            }
        }
    }
`;

export const ADD_MONTHLY_ROUTE = gql`
    mutation addMonthlyRoute($partitionKey: String!, $month: String!, $route: String!) {
        addMonthlyRoute(partitionKey: $partitionKey, month: $month, route: $route) {
            success
            message
        }
    }
`;

export const UPDATE_ROUTE = gql`
    mutation updateRoute(
        $partitionKey: String!
        $route: String
        $busNumber: String
        $limitCount: Int
        $driver: driver
        $imageUrl: String
    ) {
        updateRoute(
            partitionKey: $partitionKey
            route: $route
            busNumber: $busNumber
            limitCount: $limitCount
            driver: $driver
            imageUrl: $imageUrl
        ) {
            success
            message
            code
        }
    }
`;

export const DELETE_ROUTE = gql`
    mutation deleteRoute($partitionKey: String) {
        deleteRoute(partitionKey: $partitionKey) {
            success
            message
        }
    }
`;

export const UPDATE_DETAIL_ROUTE = gql`
    mutation updateDetailRoute(
        $partitionKey: String!
        $boardingTime: String!
        $lat: Float!
        $long: Float!
        $location: String!
        $route: String!
        $imageUrl: String
    ) {
        updateDetailRoute(
            partitionKey: $partitionKey
            boardingTime: $boardingTime
            lat: $lat
            long: $long
            location: $location
            route: $route
            imageUrl: $imageUrl
        ) {
            success
            message
        }
    }
`;

export const CREATE_ROUTE_DETAIL = gql`
    mutation createRouteDetail(
        $route: String!
        $location: String!
        $imageUrl: String!
        $lat: Float!
        $long: Float!
        $boardingTime: String!
    ) {
        createRouteDetail(
            route: $route
            location: $location
            imageUrl: $imageUrl
            lat: $lat
            long: $long
            boardingTime: $boardingTime
        ) {
            success
            message
        }
    }
`;

export const DELETE_DETAIL_ROUTE = gql`
    mutation deleteDetailRoute($partitionKey: String!) {
        deleteDetailRoute(partitionKey: $partitionKey) {
            success
            message
        }
    }
`;
