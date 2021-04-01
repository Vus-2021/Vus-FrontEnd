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
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USERS } from '../gql/route/query';
import { SINGLE_UPLOAD } from '../gql/route/mutation';

const CreateRoute = () => {
    const classes = RouteStyle();
    const { control, handleSubmit, errors, reset, watch, setValue } = useForm();
    const [drivers, setDrivers] = useState([]);
    const [openSnackbar, setSnackbar] = useState(false);
    const [imageName, setImageName] = useState('노선 이미지 업로드');

    const { data } = useQuery(GET_USERS, { variables: { type: 'DRIVER' } });
    const [singleUpload, { data: imageData }] = useMutation(SINGLE_UPLOAD);

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
        singleUpload({ variables: { file: data.image } });

        reset();
        setValue('image', null);
        setImageName('노선 이미지 업로드');
        setSnackbar(true);
    };

    const LimitCountHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '수용 인원을 입력해주세요.';
        if (type === 'isNumber') return '숫자만 입력해주세요.';
    };

    const testImage = () => {
        singleUpload({ variables: { file: watch('image') } });
    };

    useEffect(() => {
        if (imageData) {
            const { filename, mimetype, encoding, url } = imageData.singleUpload;
            console.log({
                filename: filename,
                mimetype: mimetype,
                encoding: encoding,
                url: url,
            });
        }
    }, [imageData]);

    return (
        <Box display="flex" justifyContent="center" py={5} minHeight="600px">
            <Paper elevation={10} className={classes.registerPaper}>
                <Box width="380px">
                    <MiniHeader headerText="노선 등록" />
                    <Box px={4} pt={6} pb={4}>
                        <form onSubmit={handleSubmit(registerRoute)} encType="multipart/form-data">
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
                            <Box height="80px">
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
                                                accept="image/*"
                                                id="contained-button-file"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={e => {
                                                    props.onChange(e.target.files[0]);
                                                    console.log(e.target.files[0]);
                                                    setImageName(e.target.files[0].name);
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
                                                    <Typography className={classes.imageText}>
                                                        {errors.image
                                                            ? '이미지를 업로드해주세요'
                                                            : imageName}
                                                    </Typography>
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
                                >
                                    노선 등록하기
                                </Button>
                            </Box>
                        </form>
                        <Box mt={1} display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={testImage}>
                                이미지 테스트
                            </Button>
                        </Box>
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
