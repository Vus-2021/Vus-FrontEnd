import React, { useState, useEffect } from 'react';
import SignUpStyle from '../styles/SignUpStyle';
import {
    Dialog,
    Slide,
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Snackbar,
    MenuItem,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { CHECK_USERID } from '../gql/signup/query';
import { SIGNUP_USER } from '../gql/signup/mutation';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import * as dayjs from 'dayjs';
import Header2 from '../layout/Header2';

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

const SignUp = props => {
    const { open, onClose } = props;
    const classes = SignUpStyle();
    const [exist, setExist] = useState(false); // 아이디 중복 여부
    const [showPwd, setShowPwd] = useState(false); //비밀번호 입력 가시화
    const [openSnackbar, setSnackbar] = useState(false); //등록완료 후 사용자에게 alert
    const [typeSelect, setTypeSelect] = useState('VT');

    const [tmpUserId, setTmpUserId] = useState('');

    const { errors, handleSubmit, control, getValues, watch, setError, clearErrors } = useForm();

    const [checkUser, { data }] = useLazyQuery(CHECK_USERID, { fetchPolicy: 'no-cache' });
    const [signupUser] = useMutation(SIGNUP_USER);

    //Dialog창 닫기
    const handleClose = () => {
        onClose(false);
        setExist(false);
        setSnackbar(false);
    };

    //비밀번호 가시화
    const handleClickShowPassword = () => {
        setShowPwd(!showPwd);
    };

    //중복확인 여부 검사
    const existAlready = value => {
        if (value === '') {
            setError('userId', {
                type: 'required',
            });
        } else {
            checkUser({ variables: { userId: value } });
            // updateQuery({ variables: { userId: value } });
            setTmpUserId(value);
        }
    };

    useEffect(() => {
        if (data && open) {
            const { success } = data.checkUserId;
            if (success) {
                clearErrors('userId');
            } else {
                setError('userId', {
                    type: 'exist',
                });
            }
            setExist(!success);
            console.log(success);
        }

        return () => setExist(false);
    }, [data, open, clearErrors, setError]);

    //회원가입 완료하여 유저 등록
    const registerUser = data => {
        signupUser({
            variables: {
                input: {
                    userId: data.userId,
                    password: data.password,
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                    type: data.type,
                    registerDate: data.registerDate,
                },
            },
        });
        setSnackbar(true);
    };

    //userId의 helpertext값 dynamic하게 변경
    const UserIdHelperText = props => {
        const { errors } = props;

        if (errors) {
            const { type } = errors;
            if (type === 'required') return '아이디를 입력해주세요.';
            if (type === 'exist') return '중복된 아이디입니다.';
            if (type === 'confirmId') return '중복확인을 먼저 눌러주세요.';
        }
        // if (exist) return '중복된 아이디입니다.';

        return '';
    };

    const PhoneNumberHelperText = props => {
        const { errors } = props;
        if (errors) {
            const { type } = errors;
            if (type === 'required') return '휴대폰 번호를 입력해주세요.';
            if (type === 'maxLength' || type === 'minLength') return '11자리를 입력해주세요.';
            if (type === 'isNumber') return '숫자만 입력해주세요.';
        }
        return '';
    };
    return (
        <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
            <Header2 handleClose={handleClose} headerText="회원가입" />
            <Box pl={3} pr={3} pt={2} height="94%">
                <form onSubmit={handleSubmit(registerUser)}>
                    <Box mt={3} mb={1} className="userId" style={{ display: 'flex' }}>
                        <Box height="100%" width="70%" mr={2}>
                            <Controller
                                as={TextField}
                                name="userId"
                                control={control}
                                defaultValue=""
                                label="아이디(사원번호)"
                                fullWidth
                                variant="outlined"
                                size="small"
                                rules={{
                                    required: '아이디를 입력해주세요.',
                                    validate: {
                                        exist: () => exist === false,
                                        confirmId: value => value === tmpUserId,
                                    },
                                }}
                                error={errors.userId ? true : false}
                                helperText={
                                    errors.userId ? (
                                        <UserIdHelperText errors={errors.userId} />
                                    ) : getValues('userId') == null ? (
                                        ' '
                                    ) : (
                                        '사용가능한 아이디입니다.'
                                    )
                                }
                            />
                        </Box>
                        <Box height="100%" width="25%">
                            <Button
                                className={classes.checkIdButton}
                                fullWidth
                                variant="outlined"
                                onClick={() => existAlready(getValues('userId'))}
                                color="secondary"
                            >
                                중복확인
                            </Button>
                        </Box>
                    </Box>
                    <Box mb={1} className="password">
                        <Controller
                            as={TextField}
                            name="password"
                            control={control}
                            defaultValue=""
                            label="비밀번호"
                            fullWidth
                            variant="outlined"
                            size="small"
                            type={showPwd ? 'text' : 'password'}
                            rules={{ required: true }}
                            error={errors.password ? true : false}
                            helperText={errors.password ? '비밀번호를 입력해주세요.' : ' '}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                        >
                                            {showPwd ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box mb={1} className="passwordConfirm">
                        <Controller
                            as={TextField}
                            name="confirmPassword"
                            control={control}
                            defaultValue=""
                            label="비밀번호 확인"
                            fullWidth
                            variant="outlined"
                            size="small"
                            type={showPwd ? 'text' : 'password'}
                            rules={{
                                required: true,
                                validate: value => value === watch('password'),
                            }}
                            error={errors.confirmPassword ? true : false}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                        >
                                            {showPwd ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={
                                errors.confirmPassword ? '비밀번호가 일치하지 않습니다.' : ' '
                            }
                        />
                    </Box>
                    <Box mb={1} className="name">
                        <Controller
                            as={TextField}
                            name="name"
                            control={control}
                            defaultValue=""
                            label="이름"
                            fullWidth
                            variant="outlined"
                            size="small"
                            rules={{ required: true }}
                            error={errors.name ? true : false}
                            helperText={errors.name ? '이름을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1} className="phoneNumber">
                        <Controller
                            as={TextField}
                            name="phoneNumber"
                            control={control}
                            defaultValue=""
                            label="휴대폰 번호"
                            fullWidth
                            variant="outlined"
                            size="small"
                            rules={{
                                required: true,
                                minLength: 11,
                                maxLength: 11,
                                validate: {
                                    isNumber: value => !isNaN(value),
                                },
                            }}
                            error={errors.phoneNumber ? true : false}
                            helperText={
                                errors.phoneNumber ? (
                                    <PhoneNumberHelperText errors={errors.phoneNumber} />
                                ) : (
                                    ' '
                                )
                            }
                        />
                    </Box>
                    <Box mb={1} className="type">
                        <Controller
                            as={
                                <TextField
                                    select
                                    value={typeSelect}
                                    onChange={e => setTypeSelect(e.target.value)}
                                    variant="outlined"
                                    label="소속"
                                    fullWidth
                                    size="small"
                                    helperText={errors.type ? '소속을 입력해주세요.' : ' '}
                                >
                                    {companyType.map(data => (
                                        <MenuItem key={data.name} value={data.initial}>
                                            {data.name}({data.initial})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }
                            name="type"
                            control={control}
                            defaultValue="VT"
                            rules={{ required: true }}
                            error={errors.type ? true : false}
                        />
                    </Box>
                    <Box mb={1} className="registerDate">
                        <Controller
                            name="registerDate"
                            control={control}
                            defaultValue={dayjs().format('YYYY-MM-DD')}
                            render={props => (
                                <DatePicker
                                    autoOk
                                    openTo="year"
                                    format="YYYY-MM-DD"
                                    value={watch('registerDate')}
                                    onChange={e => props.onChange(dayjs(e).format('YYYY-MM-DD'))}
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
                    <Box width="100%" className={classes.registerBox}>
                        <Button
                            type="submit"
                            className={classes.registerButton}
                            variant="contained"
                        >
                            Vatech Bus 등록하기
                        </Button>
                    </Box>
                </form>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleClose}>
                <Alert severity="success">회원가입 요청이 완료되었습니다.</Alert>
            </Snackbar>
        </Dialog>
    );
};

//Dialog창이 아래서 올라오게 함.
const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default SignUp;
