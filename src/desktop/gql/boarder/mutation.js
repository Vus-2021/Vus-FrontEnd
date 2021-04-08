import gql from 'graphql-tag';

export const ADD_MONTHLY_ROUTE = gql`
    mutation addMonthlyRoute($partitionKey: String!, $month: String!, $route: String!) {
        addMonthlyRoute(partitionKey: $partitionKey, month: $month, route: $route) {
            success
            message
        }
    }
`;

export const RESET_MONTH_ROUTE = gql`
    mutation resetMonthRoute($month: String!, $route: String!, $busId: String!) {
        resetMonthRoute(month: $month, route: $route, busId: $busId) {
            success
            message
        }
    }
`;
