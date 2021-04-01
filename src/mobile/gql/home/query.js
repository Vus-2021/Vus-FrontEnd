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

export const GET_ADMIN_NOTICE = gql`
    query getAdminNotice($notice: String, $name: String, $content: String) {
        getAdminNotice(notice: $notice, name: $name, content: $content) {
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
