import gql from 'graphql-tag';

export const APPLY_ROUTE = gql`
    mutation applyRoute(
        $route: String!
        $partitionKey: String!
        $month: String!
        $detailPartitionKey: String!
    ) {
        applyRoute(
            route: $route
            partitionKey: $partitionKey
            month: $month
            detailPartitionKey: $detailPartitionKey
        ) {
            success
            message
        }
    }
`;

export const CANCEL_ROUTE = gql`
    mutation cancelRoute($busId: String!, $month: String!) {
        cancelRoute(busId: $busId, month: $month) {
            success
            message
        }
    }
`;
