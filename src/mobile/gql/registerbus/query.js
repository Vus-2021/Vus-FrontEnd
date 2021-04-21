import gql from 'graphql-tag';

export const GET_ROUTE_BY_MONTH = gql`
    query getRouteByMonth($partitionKey: String!) {
        getRouteByMonth(partitionKey: $partitionKey) {
            success
            message
            data {
                month
            }
        }
    }
`;

export const GET_DETAIL_ROUTES = gql`
    query getDetailRoutes($route: String!, $currentLocation: Boolean) {
        getDetailRoutes(route: $route, currentLocation: $currentLocation) {
            success
            message
            data {
                partitionKey
                location
                boardingTime
            }
        }
    }
`;
