import gql from 'graphql-tag';

export const SINGLE_UPLOAD = gql`
    mutation singleUpload($file: Upload!) {
        singleUpload(file: $file) {
            filename
            mimetype
            encoding
            url
        }
    }
`;

export const CREATE_ROUTE = gql`
    mutation createRoute(
        $route: String!
        $busNumber: String!
        $limitCount: Int!
        $driver: driver!
    ) {
        createRoute(
            route: $route
            busNumber: $busNumber
            limitCount: $limitCount
            driver: $driver
        ) {
            success
            message
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
    ) {
        updateDetailRoute(
            partitionKey: $partitionKey
            boardingTime: $boardingTime
            lat: $lat
            long: $long
            location: $location
            route: $route
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
        $file: Upload
        $lat: Float!
        $long: Float!
        $boardingTime: String!
    ) {
        createRouteDetail(
            route: $route
            location: $location
            file: $file
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
