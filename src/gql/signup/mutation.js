import gql from 'graphql-tag';

export const SIGNUP_USER = gql`
    mutation signupUser($input: User) {
        signupUser(input: $input) {
            success
        }
    }
`;
