import gql from 'graphql-tag';

export const CREATE_DRIVER_LOCATION = gql`
    mutation createDriverLocation($input: DriverController) {
        createDriverLocation(input: $input) {
            success
            message
        }
    }
`;
