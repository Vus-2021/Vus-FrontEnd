import React, { useEffect, useState } from 'react';
import { Box, Paper } from '@material-ui/core';
import MiniHeader from '../layout/MiniHeader';
import RouteStyle from '../styles/RouteStyle';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Button,
    FormHelperText,
    Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useQuery } from '@apollo/react-hooks';
import { GET_USERS } from '../gql/route/query';

const CreateRoute = () => {
    const classes = RouteStyle();
    const { control, handleSubmit, errors, reset } = useForm();
    const [drivers, setDrivers] = useState([]);
    const [openSnackbar, setSnackbar] = useState(false);

    const { data } = useQuery(GET_USERS, { variables: { type: 'DRIVER' } });

    useEffect(() => {
        if (data) {
            const { success, message, data: driverData } = data.getUsers;
            if (success) {
                setDrivers(driverData);
            } else {
                console.log(message);
            }
        }
        return () => setDrivers([]);
    }, [data]);

    const registerRoute = data => {
        console.log(data);
        reset();
        setSnackbar(true);
    };

    const LimitCountHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '수용 인원을 입력해주세요.';
        if (type === 'isNumber') return '숫자만 입력해주세요.';
    };

    return (
        <Box display="flex" justifyContent="center" py={5}>
            <Paper elevation={10} className={classes.registerPaper}>
                <Box height="500px" width="380px">
                    <MiniHeader headerText="노선 등록" />
                    <Box px={4} pt={6} pb={4}>
                        <form onSubmit={handleSubmit(registerRoute)}>
                            <Box height="80px">
                                <Controller
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    name="routeName"
                                    label="노선 이름"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    error={errors.routeName ? true : false}
                                    rules={{ required: true }}
                                    helperText={
                                        errors.routeName ? '노선 이름을 입력해주세요.' : ' '
                                    }
                                />
                            </Box>
                            <Box height="80px">
                                <Controller
                                    control={control}
                                    name="busDriver"
                                    defaultValue=""
                                    rules={{
                                        validate: {
                                            required: value => value !== '',
                                        },
                                    }}
                                    error={errors.busDriver ? true : false}
                                    render={props => (
                                        <FormControl
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            error={errors.busDriver ? true : false}
                                        >
                                            <InputLabel id="bus-driver-select">
                                                버스기사 배정
                                            </InputLabel>
                                            <Select
                                                labelId="bus-driver-select"
                                                label="버스기사 배정"
                                                defaultValue=""
                                                onChange={e => props.onChange(e.target.value)}
                                            >
                                                {drivers.map(driver => (
                                                    <MenuItem
                                                        key={driver.userId}
                                                        value={driver.userId}
                                                    >
                                                        {driver.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {errors.busDriver
                                                    ? '버스 기사를 선택해주세요.'
                                                    : ' '}
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box height="80px">
                                <Controller
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    name="carNumber"
                                    label="차량번호"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    error={errors.carNumber ? true : false}
                                    rules={{ required: true }}
                                    helperText={errors.carNumber ? '차량번호를 입력해주세요.' : ' '}
                                />
                            </Box>
                            <Box height="80px">
                                <Controller
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    name="limitCount"
                                    label="최대 수용인원"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    error={errors.limitCount ? true : false}
                                    rules={{
                                        required: true,
                                        validate: { isNumber: value => !isNaN(value) },
                                    }}
                                    helperText={
                                        errors.limitCount ? (
                                            <LimitCountHelperText errors={errors.limitCount} />
                                        ) : (
                                            ' '
                                        )
                                    }
                                />
                            </Box>
                            <Box width="100%">
                                <Button
                                    type="submit"
                                    className={classes.registerButton}
                                    variant="contained"
                                    fullWidth
                                >
                                    노선 등록하기
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Paper>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setSnackbar(false)}
                onClick={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success">노선 등록이 완료되었습니다.</Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateRoute;
