import gql from 'graphql-tag';

export const SIGNUP_USER = gql`
    mutation signupUser($input: UserInput) {
        signupUser(input: $input) {
            success
            message
        }
    }
`;

export const SIGNUP_FOR_EXCEL = gql`
    mutation signupForExcel($input: [UserInput]) {
        signupForExcel(input: $input) {
            success
            message
            data {
                userId
            }
        }
    }
`;
