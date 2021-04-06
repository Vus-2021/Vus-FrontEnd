import gql from 'graphql-tag';

export const GET_BUS_APPLICANT = gql`
    query getBusApplicant(
        $route: String
        $month: String
        $state: String
        $name: String
        $userId: String
        $type: UserType
        $isCancellation: Boolean
    ) {
        getBusApplicant(
            route: $route
            month: $month
            state: $state
            name: $name
            userId: $userId
            type: $type
            isCancellation: $isCancellation
        ) {
            success
            message
            code
            data {
                userId
                name
                type
                phoneNumber
                previousMonthState
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
            }
        }
    }
`;
