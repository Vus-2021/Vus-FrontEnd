import gql from 'graphql-tag';

export const GET_ROUTE_NAME = gql`
    query {
        getRoutesInfo {
            success
            data {
                partitionKey
                route
            }
        }
    }
`;

export const GET_ROUTE_BY_MONTH = gql`
    query getRouteByMonth($partitionKey: String!) {
        getRouteByMonth(partitionKey: $partitionKey) {
            success
            message
            data {
                month
                partitionKey
            }
        }
    }
`;
