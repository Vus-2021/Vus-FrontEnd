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
