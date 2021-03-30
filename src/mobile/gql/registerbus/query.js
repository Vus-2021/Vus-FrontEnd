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
