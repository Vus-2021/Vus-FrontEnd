import gql from 'graphql-tag';

export const APPLY_ROUTE = gql`
    mutation applyRoute($route: RouteNames!, $month: String!) {
        applyRoute(route: $route, month: $month) {
            success
            message
        }
    }
`;
