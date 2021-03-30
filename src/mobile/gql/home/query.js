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
                routeInfo {
                    routes
                    month
                    busId
                }
            }
        }
    }
`;

export const GET_ROUTES_INFO = gql`
    query getRoutesInfo($month: String, $route: String) {
        getRoutesInfo(month: $month, route: $route) {
            success
            message
            data {
                partitionKey
                route
                busNumber
                limitCount
                driver {
                    name
                }
                month {
                    registerCount
                    month
                }
            }
        }
    }
`;
