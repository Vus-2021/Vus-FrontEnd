import gql from 'graphql-tag';

export const ADD_ALL_MONTHLY_ROUTE = gql`
    mutation addAllMonthlyRoute($month: String!) {
        addAllMonthlyRoute(month: $month) {
            success
            message
        }
    }
`;
