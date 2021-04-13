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

export const TRIGGER_PASSENGERS = gql`
    mutation triggerPassengers($month: String!, $route: String!, $busId: String!) {
        triggerPassengers(month: $month, route: $route, busId: $busId) {
            success
            message
        }
    }
`;

export const INIT_PASSENGERS = gql`
    mutation initPassengers($month: String!, $route: String!, $busId: String!) {
        initPassengers(month: $month, route: $route, busId: $busId) {
            success
            message
        }
    }
`;
