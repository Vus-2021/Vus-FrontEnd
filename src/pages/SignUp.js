import React, { useState } from 'react';
import SignUpStyle from '../styles/SignUpStyle';
import {
    Dialog,
    Slide,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { Backspace, Visibility, VisibilityOff } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';

const SignUp = props => {
    const { open, onClose } = props;
    const classes = SignUpStyle();
    const [isLogin] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [date, setDate] = useState(new Date());
    const [state, setState] = useState({
        userId: '',
        password: '',
        name: '',
        phoneNumber: '',
        type: '',
        registerDate: '',
    });
    const { errors, handleSubmit, control, getValues } = useForm();

    const handleClose = () => {
        onClose(isLogin);
    };

    const handleClickShowPassword = () => {
        setShowPwd(!showPwd);
    };

    const setIdentity = data => {
        console.log(data.phoneNumber);
        setState({
            ...state,
            userId: data.userId,
            password: data.password,
            name: data.name,
            phoneNumber: data.phoneNumber,
            type: data.type,
            registerDate: data.registerDate,
        });
    };
    console.log(state);
    return (
        <Dialog fullScreen onClose={handleClose} open={open} TransitionComponent={Transition}>
            <Box height="6%" className={classes.headerBox}>
                <Box width="33%">
                    &nbsp;&nbsp;
                    <Backspace onClick={handleClose} />
                </Box>
                <Box width="33%">
                    <Typography align="center" className={classes.headerTitle}>
                        회원가입
                    </Typography>
                </Box>
                <Box width="33%"></Box>
            </Box>
            <Box pl={3} pr={3} pt={2} height="94%">
                <form onSubmit={handleSubmit(data => setIdentity(data))}>
                    <Box mt={3} mb={1} style={{ display: 'flex' }}>
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
                                rules={{ required: true }}
                                error={errors.userId ? true : false}
                                helperText={errors.userId ? '아이디를 입력해주세요.' : ' '}
                            />
                        </Box>
                        <Box height="100%" width="25%">
                            <Button fullWidth variant="outlined" type="submit">
                                중복확인
                            </Button>
                        </Box>
                    </Box>
                    <Box mb={1}>
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
                            onChange={e => setState({ ...state, password: e.target.value })}
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
                    <Box mb={1}>
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
                                validate: value => value === getValues('password'),
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
                    <Box mb={1}>
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
                    <Box mb={1}>
                        <Controller
                            as={TextField}
                            name="phoneNumber"
                            control={control}
                            defaultValue=""
                            label="휴대폰 번호"
                            placeholder="숫자만 입력해주세요."
                            fullWidth
                            variant="outlined"
                            size="small"
                            rules={{ required: true }}
                            error={errors.phoneNumber ? true : false}
                            helperText={errors.phoneNumber ? '휴대폰 번호를 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1}>
                        <Controller
                            as={TextField}
                            name="type"
                            control={control}
                            defaultValue=""
                            label="소속"
                            fullWidth
                            variant="outlined"
                            size="small"
                            rules={{ required: true }}
                            error={errors.type ? true : false}
                            helperText={errors.type ? '소속을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1}>
                        <Controller
                            name="registerDate"
                            control={control}
                            defaultValue={new Date()}
                            render={() => (
                                <DatePicker
                                    autoOk
                                    openTo="year"
                                    format="YYYY-MM-DD"
                                    value={date}
                                    onChange={date => setDate(date)}
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
        </Dialog>
    );
};

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default SignUp;
