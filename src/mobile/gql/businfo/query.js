import gql from 'graphql-tag';

export const GET_DETAIL_ROUTES = gql`
    query getDetailRoutes($route: String!) {
        getDetailRoutes(route: $route) {
            success
            message
            data {
                boardingTime
                location
                lat
                long
                imageUrl
            }
        }
    }
`;

export const GET_DRIVER_NOTICE = gql`
    query getDriverNotice($route: String) {
        getDriverNotice(route: $route) {
            success
            message
            data {
                updatedAt
                route
                location
            }
        }
    }
`;
