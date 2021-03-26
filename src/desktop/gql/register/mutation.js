import gql from 'graphql-tag';

export const SIGNUP_USER = gql`
    mutation signupUser($input: UserInput) {
        signupUser(input: $input) {
            success
            message
        }
    }
`;
