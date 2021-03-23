import gql from 'graphql-tag';

export const GET_DETAIL_ROUTES = gql`
    query getDetailRoutes($route: RouteNames) {
        getDetailRoutes(route: $route) {
            data {
                boardingTime
                location
                lat
                long
            }
        }
    }
`;
