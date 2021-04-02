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
