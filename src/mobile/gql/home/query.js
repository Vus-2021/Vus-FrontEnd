import gql from 'graphql-tag';

export const GET_MY_INFO = gql`
    query {
        getMyInformation {
            success
            message
            data {
                name
                userId
                type
            }
        }
    }
`;

export const GET_ROUTE_INFO = gql`
    query getRoutesInfo($month: String) {
        getRoutesInfo(month: $month) {
            success
            message
            data {
                route
                busNumber
                limitCount
                registerCount
                driver {
                    name
                }
            }
        }
    }
`;
