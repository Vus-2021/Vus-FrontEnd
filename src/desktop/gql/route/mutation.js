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
