import React, { useEffect, useState, useContext } from 'react';
import {
    Dialog,
    Box,
    Button,
    TextField,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
    Typography,
    Snackbar,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { Alert } from '@material-ui/lab';
import { useForm, Controller } from 'react-hook-form';
import MiniHeader from '../layout/MiniHeader';
import RegisterStyle from '../styles/RegisterStyle';
import * as dayjs from 'dayjs';
import { useMutation } from '@apollo/react-hooks';
import { INIT_PASSWORD, UPDATE_USER } from '../gql/user/mutation';
import { DeviceMode } from '../../App';

const companyType = [
    {
        name: '바텍',
        initial: 'VT',
    },
    {
        name: '바텍이우홀딩스',
        initial: 'VH',
    },
    {
        name: '이우소프트',
        initial: 'ES',
    },
    {
        name: '레이언스',
        initial: 'RY',
    },
    {
        name: '우리엔',
        initial: 'WR',
    },
    {
        name: '바텍엠시스',
        initial: 'VM',
    },
    {
        name: '바텍이엔지',
        initial: 'VE',
    },
    {
        name: '바텍에스앤씨',
        initial: 'VS',
    },
];

const DetailUser = props => {
    const { open, onClose, userData, refetch } = props;
    const deviceMode = useContext(DeviceMode);
    const classes = RegisterStyle();
    const { name, type, userId, phoneNumber, registerDate } = userData;

    const { handleSubmit, control, errors, watch } = useForm();
    const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
    const [openSnackbar, setSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const [initPassword, { data }] = useMutation(INIT_PASSWORD);
    const [updateUser, { data: updateData }] = useMutation(UPDATE_USER, {
        onCompleted() {
            refetch();
        },
    });

    const blank_pattern = /\s/gi;
    const special_pattern = /[`~!@#$%^&*|'";:/={}?<>,.-]/gi;

    const PhoneNumberHelperText = props => {
        const { errors } = props;
        if (errors) {
            const { type } = errors;
            if (type === 'required') return '휴대폰 번호를 입력해주세요.';
            if (type === 'maxLength' || type === 'minLength') return '11자리를 입력해주세요.';
            if (type === 'isNumber' || type === 'invalidForm') return '숫자만 입력해주세요.';
        }
        return '';
    };

    const resetPassword = () => {
        setSnackbarText('비밀번호 변경이 완료되었습니다.');
        setSnackbar(true);
        initPassword({
            variables: {
                userId: userId,
                password: '1234',
            },
        });
    };

    const updateUserClick = data => {
        updateUser({
            variables: {
                userId: data.userId,
                name: data.name,
                phoneNumber: data.phoneNumber,
                type: type === 'ADMIN' || type === 'DRIVER' ? type : data.type,
                registerDate:
                    type === 'ADMIN' || type === 'DRIVER' ? registerDate : data.registerDate,
            },
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.initPassword;
            if (success) {
                setSnackbar(true);
            } else console.log(message);
        }
    }, [data]);

    useEffect(() => {
        if (updateData) {
            const { success, message } = updateData.updateUser;
            if (success) {
                onClose(false);
            } else console.log(message);
        }
    }, [updateData, onClose]);

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            fullWidth={deviceMode}
            maxWidth={deviceMode ? 'xs' : null}
        >
            <MiniHeader handleClose={() => onClose(false)} headerText="사용자 수정" />
            <Box p={4}>
                <form onSubmit={handleSubmit(updateUserClick)}>
                    <Box height="70px" style={{ display: 'flex' }}>
                        <Controller
                            as={TextField}
                            name="userId"
                            control={control}
                            defaultValue={userId}
                            label="아이디"
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled
                        />
                    </Box>
                    <Box height="70px" width="100%">
                        <Controller
                            as={TextField}
                            defaultValue={name}
                            name="name"
                            type="text"
                            control={control}
                            variant="outlined"
                            size="small"
                            error={errors.name ? true : false}
                            helperText={errors.name ? errors.name.message : ' '}
                            rules={{
                                required: '이름을 입력해주세요.',
                                validate: {
                                    invalidForm: value => {
                                        if (
                                            blank_pattern.test(value) ||
                                            special_pattern.test(value)
                                        ) {
                                            return '특수문자나 공백은 입력할 수 없습니다.';
                                        }
                                    },
                                },
                            }}
                            fullWidth
                            label={type === 'ADMIN' ? '이름(소속)' : '이름'}
                        />
                    </Box>
                    <Box height="70px" width="100%">
                        <Controller
                            as={TextField}
                            defaultValue={phoneNumber}
                            name="phoneNumber"
                            type="text"
                            control={control}
                            variant="outlined"
                            size="small"
                            error={errors.phoneNumber ? true : false}
                            helperText={
                                errors.phoneNumber ? (
                                    <PhoneNumberHelperText errors={errors.phoneNumber} />
                                ) : (
                                    ' '
                                )
                            }
                            rules={{
                                required: true,
                                minLength: 11,
                                maxLength: 11,
                                validate: {
                                    isNumber: value => !isNaN(value),
                                    invalidForm: value => !blank_pattern.test(value),
                                },
                            }}
                            fullWidth
                            label="휴대폰 번호"
                        />
                    </Box>
                    {type !== 'ADMIN' && type !== 'DRIVER' && (
                        <React.Fragment>
                            <Box height="70px" width="100%">
                                <Controller
                                    control={control}
                                    name="type"
                                    defaultValue={type}
                                    rules={{
                                        validate: {
                                            required: value => value !== '',
                                        },
                                    }}
                                    error={errors.type ? true : false}
                                    render={props => (
                                        <FormControl
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            error={errors.type ? true : false}
                                        >
                                            <InputLabel id="company-type-select">소속</InputLabel>
                                            <Select
                                                labelId="company-type-select"
                                                label="소속"
                                                defaultValue={type}
                                                onChange={e => props.onChange(e.target.value)}
                                            >
                                                {companyType.map(type => (
                                                    <MenuItem
                                                        key={type.initial}
                                                        value={type.initial}
                                                    >
                                                        {type.name}({type.initial})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {errors.type ? '소속을 선택해주세요.' : ' '}
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box height="70px" width="100%">
                                <Controller
                                    name="registerDate"
                                    control={control}
                                    defaultValue={registerDate}
                                    render={props => (
                                        <DatePicker
                                            autoOk
                                            openTo="year"
                                            format="YYYY-MM-DD"
                                            value={
                                                watch('registerDate')
                                                    ? watch('registerDate')
                                                    : registerDate
                                            }
                                            onChange={e =>
                                                props.onChange(dayjs(e).format('YYYY-MM-DD'))
                                            }
                                            label="입사일"
                                            inputVariant="outlined"
                                            size="small"
                                            fullWidth
                                            maxDate={new Date()}
                                            views={['year', 'month', 'date']}
                                            helperText={' '}
                                        />
                                    )}
                                />
                            </Box>
                        </React.Fragment>
                    )}
                    <Box height="50px" width="100%" display="flex" justifyContent="space-between">
                        <Box>
                            <Button
                                variant="contained"
                                size="medium"
                                className={classes.passwordButton}
                                onClick={() => setResetPasswordDialog(true)}
                                style={{ fontSize: deviceMode ? '12px' : null }}
                            >
                                비밀번호 초기화
                            </Button>
                        </Box>
                        <Box width="40%">
                            <Button
                                variant="contained"
                                type="submit"
                                size="medium"
                                style={{ fontSize: deviceMode ? '12px' : null }}
                                className={classes.registerButton}
                            >
                                수정하기
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
            <Dialog
                open={resetPasswordDialog}
                onClose={() => setResetPasswordDialog(false)}
                fullWidth={deviceMode}
                maxWidth={deviceMode ? 'xs' : null}
            >
                <Box px={3} py={2} width={deviceMode ? null : '380px'}>
                    <Box mb={2}>
                        <Typography className={classes.warningTitle}>비밀번호 초기화</Typography>
                    </Box>
                    <Box mb={3}>
                        <Typography className={classes.warningText}>
                            비밀번호가 <strong>1234</strong>로 초기화됩니다.
                            <br />
                            정말 초기화 하시겠습니까?
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Box mr={2} width="50%">
                            <Button
                                variant="contained"
                                onClick={resetPassword}
                                className={classes.resetButton}
                                fullWidth
                            >
                                초기화
                            </Button>
                        </Box>
                        <Box width="50%">
                            <Button
                                variant="contained"
                                onClick={() => setResetPasswordDialog(false)}
                                className={classes.decideButton}
                                fullWidth
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={1500}
                    style={{ height: '60%' }}
                    onClose={() => {
                        setSnackbar(false);
                        setResetPasswordDialog(false);
                    }}
                    onClick={() => {
                        setSnackbar(false);
                        setResetPasswordDialog(false);
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success">{snackbarText}</Alert>
                </Snackbar>
            </Dialog>
        </Dialog>
    );
};

export default DetailUser;
