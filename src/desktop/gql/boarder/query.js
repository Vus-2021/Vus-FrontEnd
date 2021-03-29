import gql from 'graphql-tag';

export const GET_BUS_APPLICANT = gql`
    query getBusApplicant($route: String, $month: String, $state: String) {
        getBusApplicant(route: $route, month: $month, state: $state) {
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
