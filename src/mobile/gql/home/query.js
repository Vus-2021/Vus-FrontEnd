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
                    route
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
                imageUrl
            }
        }
    }
`;

export const GET_ADMIN_NOTICE = gql`
    query getAdminNotice($limit: Int) {
        getAdminNotice(limit: $limit) {
            success
            message
            data {
                createdAt
                notice
                partitionKey
            }
        }
    }
`;

export const GET_DETAIL_ROUTES = gql`
    query getDetailRoutes($route: String!) {
        getDetailRoutes(route: $route) {
            success
            message
            data {
                partitionKey
                boardingTime
                location
            }
        }
    }
`;

export const GET_BUS_LOCATION = gql`
    query getBusLocation($route: String!, $currentLocation: Boolean) {
        getDetailRoutes(route: $route, currentLocation: $currentLocation) {
            success
            message
            data {
                currentLocation
                locationIndex
            }
        }
    }
`;
