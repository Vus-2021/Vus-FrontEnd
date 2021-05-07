import React, { useEffect, useState } from 'react';
import {
    Dialog,
    Box,
    TextField,
    Button,
    Slide,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useForm, Controller } from 'react-hook-form';
import Header2 from '../layout/Header2';
import LogInStyle from '../styles/LogInStyle';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import { SIGNIN } from '../gql/login/mutation';
import { useMutation } from '@apollo/react-hooks';
import SignUpDialog from './SignUp';

const LogIn = props => {
    const classes = LogInStyle();
    const { open, onClose } = props;
    const [showPwd, setShowPwd] = useState(false);
    const [openSnackbar, setSnackbar] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const { errors, handleSubmit, control } = useForm();

    const [signin, { data }] = useMutation(SIGNIN);
    const [keep, setKeep] = useState(false);

    const handleClose = () => {
        onClose(false);
        setSnackbar(false);
    };

    const signInSubmit = data => {
        signin({
            variables: {
                userId: data.userId,
                password: data.password,
            },
        });
        setKeep(data.keepLogin);
    };

    useEffect(() => {
        if (data && open) {
            const { success, data: token } = data.signin;
            if (success) {
                if (keep) {
                    localStorage.setItem('accessToken', token.accessToken);
                    localStorage.setItem('refreshToken', token.refreshToken);
                } else {
                    sessionStorage.setItem('accessToken', token.accessToken);
                    sessionStorage.setItem('refreshToken', token.refreshToken);
                }
                onClose(true);
            } else {
                setSnackbar(true);
            }
        }
    }, [data, onClose, open, keep]);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <Header2 handleClose={handleClose} headerText="로그인" height="40px" />
            <Box pl={3} pr={3} pt={5} pb={5}>
                <form onSubmit={handleSubmit(signInSubmit)}>
                    <Box mb={1} className="userId">
                        <Controller
                            name="userId"
                            as={TextField}
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            error={errors.userId ? true : false}
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="아이디(사원번호)"
                            helperText={errors.userId ? '아이디를 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={errors.password ? 0 : 1} className="password">
                        <Controller
                            name="password"
                            as={TextField}
                            control={control}
                            defaultValue=""
                            type={showPwd ? 'text' : 'password'}
                            rules={{ required: true }}
                            error={errors.password ? true : false}
                            variant="outlined"
                            fullWidth
                            size="small"
                            label="비밀번호"
                            helperText={errors.password ? '비밀번호를 입력해주세요.' : ''}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPwd(!showPwd)}
                                        >
                                            {showPwd ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box width="100%" mb={1} className="keepLogin">
                        <Controller
                            name="keepLogin"
                            control={control}
                            defaultValue={false}
                            render={props => (
                                <FormControlLabel
                                    control={<Checkbox defaultChecked={false} />}
                                    label="로그인 상태 유지"
                                    onChange={e => props.onChange(e.target.checked)}
                                />
                            )}
                        />
                    </Box>
                    <Box width="100%" mb={1}>
                        <Button type="submit" className={classes.registerButton}>
                            로그인
                        </Button>
                    </Box>
                    <Box width="100%">
                        <Button
                            fullWidth
                            className={classes.signUpButton}
                            onClick={() => setOpenSignUp(true)}
                        >
                            회원가입
                        </Button>
                    </Box>
                </form>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={1300}
                style={{ height: '60%' }}
                onClose={() => setSnackbar(false)}
                onClick={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error">잘못된 아이디 혹은 비밀번호 입니다.</Alert>
            </Snackbar>
            <SignUpDialog open={openSignUp} onClose={setOpenSignUp} />
        </Dialog>
    );
};

//Dialog창이 아래서 올라오게 함.
const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default LogIn;
