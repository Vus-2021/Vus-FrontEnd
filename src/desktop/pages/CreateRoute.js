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
    Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { GET_USERS, CHECK_USERID } from '../gql/route/query';
import { CREATE_ROUTE } from '../gql/route/mutation';
import fileUpload from '../components/FileUpload';

const CreateRoute = props => {
    const { refetch } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors, reset, setValue, setError, clearErrors } = useForm();
    const [drivers, setDrivers] = useState([]);
    const [openSnackbar, setSnackbar] = useState(false);
    const [imageName, setImageName] = useState('노선 이미지 업로드');
    const [imgPreview, setImgPreview] = useState('');

    const blank_pattern = /\s/gi;
    const special_pattern = /[`~!@#$%^&*|'";:/={}?<>,.-]/gi;

    const { data } = useQuery(GET_USERS, {
        variables: { type: 'DRIVER' },
        fetchPolicy: 'no-cache',
    });
    const [createRoute, { data: createData }] = useMutation(CREATE_ROUTE, {
        fetchPolicy: 'no-cache',
        onCompleted() {
            refetch();
        },
    });
    const [checkUserId, { data: checkData }] = useLazyQuery(CHECK_USERID, {
        fetchPolicy: 'no-cache',
    });

    const registerRoute = async data => {
        const driverData = data.driver.split('+');
        const fileLocation = await fileUpload(data.image);
        createRoute({
            variables: {
                route: data.route,
                busNumber: data.busNumber,
                limitCount: parseInt(data.limitCount),
                driver: { name: driverData[0], phone: driverData[1], userId: driverData[2] },
                imageUrl: fileLocation,
            },
        });
    };
    const LimitCountHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '수용 인원을 입력해주세요.';
        if (type === 'isNumber') return '숫자만 입력해주세요.';
        if (type === 'invalidForm') return '특수문자나 공백은 입력할 수 없습니다.';
    };

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

    useEffect(() => {
        if (createData) {
            const { success, message } = createData.createRoute;
            if (success) {
                reset();
                setValue('image', null);
                setImageName('노선 이미지 업로드');
                setSnackbar(true);
            } else {
                console.log(message);
            }
        }
    }, [createData, reset, setValue, setError]);

    useEffect(() => {
        if (checkData) {
            const { success } = checkData.checkUserId;
            if (success) {
                clearErrors('driver');
            } else {
                setError('driver', {
                    type: 'alreadyExist',
                    message: '다른 노선에 등록된 기사님 입니다.',
                });
            }
        }
    }, [checkData, setError, clearErrors]);

    return (
        <Box display="flex" justifyContent="center" py={5} minHeight="530px">
            <Paper elevation={10} className={classes.registerPaper}>
                <Box width="380px">
                    <MiniHeader headerText="노선 등록" />
                    <Box px={4} pt={6} pb={4}>
                        <form onSubmit={handleSubmit(registerRoute)} encType="multipart/form-data">
                            <Box mb={1}>
                                <Controller
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    name="route"
                                    label="노선 이름"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    error={errors.route ? true : false}
                                    rules={{
                                        required: '노선 이름을 입력해주세요.',
                                        validate: {
                                            invalidForm: async value => {
                                                const blank = await blank_pattern.test(value);
                                                const special = await special_pattern.test(value);
                                                if (blank || special) {
                                                    return '특수문자나 공백은 입력할 수 없습니다.';
                                                }
                                            },
                                        },
                                    }}
                                    helperText={errors.route ? errors.route.message : ' '}
                                />
                            </Box>
                            <Box mb={1}>
                                <Controller
                                    control={control}
                                    name="driver"
                                    defaultValue=""
                                    rules={{
                                        validate: {
                                            required: value => value !== '',
                                        },
                                    }}
                                    error={errors.driver ? true : false}
                                    render={props => (
                                        <FormControl
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            error={errors.driver ? true : false}
                                        >
                                            <InputLabel id="bus-driver-select">
                                                버스기사 배정
                                            </InputLabel>
                                            <Select
                                                labelId="bus-driver-select"
                                                label="버스기사 배정"
                                                defaultValue=""
                                                onChange={e => {
                                                    const driverData = e.target.value.split('+');
                                                    checkUserId({
                                                        variables: {
                                                            userId: driverData[2],
                                                            sortKey: '#driver',
                                                        },
                                                    });
                                                    props.onChange(e.target.value);
                                                }}
                                            >
                                                {drivers.map(driver => (
                                                    <MenuItem
                                                        key={driver.userId}
                                                        value={`${driver.name}+${driver.phoneNumber}+${driver.userId}`}
                                                    >
                                                        {driver.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {errors.driver
                                                    ? errors.driver.type === 'required'
                                                        ? '버스 기사를 선택해주세요.'
                                                        : errors.driver.message
                                                    : ' '}
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box mb={1}>
                                <Controller
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    name="busNumber"
                                    label="차량번호"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    error={errors.busNumber ? true : false}
                                    rules={{
                                        required: '차량번호를 입력해주세요.',
                                        validate: {
                                            invalidForm: async value => {
                                                const special = await special_pattern.test(value);
                                                if (special)
                                                    return '특수문자는 입력할 수 없습니다.';
                                            },
                                        },
                                    }}
                                    helperText={errors.busNumber ? errors.busNumber.message : ' '}
                                />
                            </Box>
                            <Box mb={1}>
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
                                        validate: {
                                            isNumber: value => !isNaN(value),
                                            invalidForm: value => !blank_pattern.test(value),
                                        },
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
                            <Box mb={4}>
                                <Controller
                                    control={control}
                                    defaultValue=""
                                    name="image"
                                    rules={{
                                        required: true,
                                    }}
                                    render={props => (
                                        <Box>
                                            <input
                                                accept="image/png, image/gif, image/jpeg"
                                                id="contained-button-file"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={e => {
                                                    const file = e.target.files[0];
                                                    const reader = new FileReader();
                                                    props.onChange(file);
                                                    setImageName(file.name);
                                                    reader.onloadend = () =>
                                                        setImgPreview(reader.result);
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Button
                                                    variant="outlined"
                                                    component="span"
                                                    fullWidth
                                                    className={
                                                        errors.image
                                                            ? classes.errorButton
                                                            : classes.imageButton
                                                    }
                                                >
                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        alignItems="center"
                                                    >
                                                        <Typography className={classes.imageText}>
                                                            {errors.image
                                                                ? '이미지를 업로드해주세요'
                                                                : imageName}
                                                        </Typography>
                                                        {imgPreview !== '' && (
                                                            <img
                                                                src={imgPreview}
                                                                width="140px"
                                                                alt="nothing"
                                                            />
                                                        )}
                                                    </Box>
                                                </Button>
                                            </label>
                                        </Box>
                                    )}
                                />
                            </Box>
                            <Box width="100%">
                                <Button
                                    type="submit"
                                    className={classes.registerButton}
                                    variant="contained"
                                    fullWidth
                                    disabled={errors.driver ? true : false}
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
