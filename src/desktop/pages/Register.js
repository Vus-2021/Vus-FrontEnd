import React, { useState } from 'react';
import {
    Dialog,
    Slide,
    Box,
    Tabs,
    Tab,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import MiniHeader from '../layout/MiniHeader';
import RegisterStyle from '../styles/RegisterStyle';
import { useForm, Controller } from 'react-hook-form';

const Register = props => {
    const classes = RegisterStyle();
    const { open, onClose } = props;
    const { handleSubmit, control } = useForm();

    const [boardNum, setNumber] = useState(0);
    const [showPwd, setShowPwd] = useState(false); //비밀번호 입력 가시화

    const registerUser = data => {
        console.log(data);
    };

    const handleClose = () => {
        onClose(false);
    };

    console.log(boardNum);
    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
            <MiniHeader handleClose={handleClose} headerText="사용자 등록" />
            <Box height="500px" p={4}>
                <Box mb={5}>
                    <Tabs
                        value={boardNum}
                        onChange={(e, newValue) => setNumber(newValue)}
                        aria-label="register tabs"
                        textColor="inherit"
                        centered
                    >
                        <Tab label={<Typography className={classes.tabText}>관리자</Typography>} />
                        <Tab
                            label={<Typography className={classes.tabText}>버스기사</Typography>}
                        />
                    </Tabs>
                </Box>

                <Box mb={2}>
                    <form onSubmit={handleSubmit(registerUser)}>
                        <Box height="80px" style={{ display: 'flex' }}>
                            <Box height="100%" width="70%" mr={1}>
                                <Controller
                                    as={TextField}
                                    name="userId"
                                    control={control}
                                    defaultValue=""
                                    label="아이디"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    helperText={' '}
                                />
                            </Box>
                            <Box height="100%" width="30%">
                                <Button
                                    className={classes.checkIdButton}
                                    fullWidth
                                    variant="outlined"
                                >
                                    중복확인
                                </Button>
                            </Box>
                        </Box>
                        <Box height="80px" width="100%">
                            <Controller
                                as={TextField}
                                name="password"
                                type={showPwd ? 'text' : 'password'}
                                control={control}
                                variant="outlined"
                                size="small"
                                helperText={' '}
                                fullWidth
                                label="비밀번호"
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
                    </form>
                </Box>
            </Box>
        </Dialog>
    );
};

//Dialog창이 아래서 올라오게 함.
const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default Register;
