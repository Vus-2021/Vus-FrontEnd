import React, { useEffect, useState } from 'react';
import Header2 from '../layout/Header2';
import {
    Box,
    Typography,
    Divider,
    Chip,
    IconButton,
    Collapse,
    Button,
    Dialog,
    TextField,
    InputAdornment,
    Snackbar,
} from '@material-ui/core';
import { ExpandMore, ExpandLess, Visibility, VisibilityOff } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import MyInformationStyle from '../styles/MyInformationStyle';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { INIT_PASSWORD } from '../gql/myinfo/mutation';

const MyInformation = ({ history, location }) => {
    const classes = MyInformationStyle();
    const { userData, userBusData } = location.state;
    const { handleSubmit, control, errors, watch } = useForm();

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setSnackbar] = useState(false);
    const [openIndex, setOpenIndex] = useState(-1);
    const [showPwd, setShowPwd] = useState(false); //비밀번호 입력 가시화

    const [initPassword, { data }] = useMutation(INIT_PASSWORD);

    const blank_pattern = /\s/gi;

    const changePassword = data => {
        initPassword({
            variables: {
                userId: userData.userId,
                password: data.password,
            },
        });
    };

    const logoutClick = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) history.push('/');
    }, [history]);

    useEffect(() => {
        if (data) {
            const { success, message } = data.initPassword;
            if (success) {
                setSnackbar(true);
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Box height="100%">
            <Header2 handleClose={() => history.goBack()} headerText="내 정보" logout={true} />
            <Box overflow="auto" height={`calc(100% - 37px)`}>
                <Box height="210px">
                    <Box height="5%" pl={3} py={1} className={classes.accountText}>
                        계정 정보
                    </Box>
                    <Box
                        display="flex"
                        px={3}
                        alignItems="center"
                        justifyContent="space-between"
                        height="20%"
                    >
                        <Typography className={classes.textTitle}>이름</Typography>
                        <Typography className={classes.textContent}>{userData.name}</Typography>
                    </Box>
                    <Divider />
                    <Box
                        display="flex"
                        px={3}
                        alignItems="center"
                        justifyContent="space-between"
                        height="20%"
                    >
                        <Typography className={classes.textTitle}>아이디</Typography>
                        <Typography className={classes.textContent}>{userData.userId}</Typography>
                    </Box>
                    <Divider />
                    <Box
                        display="flex"
                        px={3}
                        alignItems="center"
                        justifyContent="space-between"
                        height="20%"
                    >
                        <Typography className={classes.textTitle}>소속</Typography>
                        <Typography className={classes.textContent}>{userData.type}</Typography>
                    </Box>
                    <Divider />
                    <Box
                        display="flex"
                        px={3}
                        alignItems="center"
                        justifyContent="space-between"
                        height="20%"
                    >
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setOpenDialog(true)}
                            style={{ height: '90%' }}
                        >
                            <Typography color="error">비밀번호 변경하기</Typography>
                        </Button>
                    </Box>
                </Box>
                <Box height={'calc(100% - 255px)'} overflow="auto">
                    <Box height="3%" pl={3} py={1} className={classes.accountText}>
                        노선 이용 정보
                    </Box>
                    {userBusData.length > 0 ? (
                        userBusData
                            .slice(0)
                            .reverse()
                            .map((data, index) => (
                                <React.Fragment key={index}>
                                    <Box
                                        display="flex"
                                        pl={3}
                                        pr={1}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        height="50px"
                                        onClick={() => {
                                            if (index === openIndex) setOpenIndex(-1);
                                            else setOpenIndex(index);
                                        }}
                                    >
                                        <Box display="flex" alignItems="center">
                                            <Typography className={classes.textTitle}>
                                                {data.route}노선
                                            </Typography>
                                            <Typography>{data.month}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Box>
                                                <ChipStyle
                                                    state={data.state}
                                                    cancel={data.isCancellation}
                                                />
                                            </Box>
                                            <IconButton className={classes.iconButton}>
                                                {index === openIndex ? (
                                                    <ExpandLess fontSize="inherit" />
                                                ) : (
                                                    <ExpandMore fontSize="inherit" />
                                                )}
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Collapse in={index === openIndex} timeout="auto" unmountOnExit>
                                        <Box
                                            pl={4}
                                            pr={2}
                                            pb={1}
                                            display="flex"
                                            justifyContent="space-between"
                                        >
                                            <Box display="flex" alignItems="center" width="20%">
                                                <Typography className={classes.busStopTitle}>
                                                    정류장
                                                </Typography>
                                            </Box>

                                            <Box
                                                width="80%"
                                                display="flex"
                                                flexDirection="column"
                                                textAlign="right"
                                            >
                                                <Typography className={classes.busStopContent}>
                                                    {data.location}
                                                </Typography>
                                                <Typography className={classes.busStopContent}>
                                                    {data.boardingTime}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </React.Fragment>
                            ))
                    ) : (
                        <React.Fragment>
                            <Box
                                display="flex"
                                px={3}
                                py={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                신청 정보 없음
                            </Box>
                            <Divider />
                        </React.Fragment>
                    )}
                </Box>
                <Box height="35px" px={3}>
                    <Button
                        variant="contained"
                        fullWidth
                        style={{ height: '100%' }}
                        onClick={logoutClick}
                        className={classes.logoutButton}
                    >
                        로그아웃
                    </Button>
                </Box>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <Header2
                    handleClose={() => setOpenDialog(false)}
                    headerText="비밀번호 변경"
                    height="30px"
                />
                <Box px={3} pt={3}>
                    <form onSubmit={handleSubmit(changePassword)}>
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
                                rules={{
                                    required: '비밀번호를 입력해주세요.',
                                    validate: {
                                        invalidForm: value => {
                                            if (blank_pattern.test(value))
                                                return '공백은 입력할 수 없습니다.';
                                        },
                                    },
                                }}
                                error={errors.password ? true : false}
                                helperText={errors.password ? errors.password.message : ' '}
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
                                                onClick={() => setShowPwd(!showPwd)}
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
                        <Box width="100%" className={classes.registerBox} mb={2}>
                            <Button type="submit" variant="contained" fullWidth>
                                비밀번호 변경
                            </Button>
                        </Box>
                    </form>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={1500}
                    style={{ height: '60%' }}
                    onClose={() => {
                        setSnackbar(false);
                        setOpenDialog(false);
                    }}
                    onClick={() => {
                        setSnackbar(false);
                        setOpenDialog(false);
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success">비밀번호 변경이 완료되었습니다.</Alert>
                </Snackbar>
            </Dialog>
        </Box>
    );
};

const ChipStyle = props => {
    const classes = MyInformationStyle();
    const { state, cancel } = props;
    let chipStyle, chipText;

    if (cancel) {
        chipStyle = classes.chipCancel;
        chipText = '취소';
    } else {
        switch (state) {
            case 'fulfilled':
                chipStyle = classes.chipYes;
                chipText = '당첨';
                break;
            case 'reject':
                chipStyle = classes.chipNo;
                chipText = '미당첨';
                break;
            case 'pending':
                chipStyle = classes.chipWait;
                chipText = '대기';
                break;
            default:
                chipStyle = classes.chipEmpty;
                chipText = '미신청';
        }
    }

    return (
        <Chip
            className={chipStyle}
            size="small"
            label={
                <Typography
                    className={
                        state === 'pending' || state === 'cancelled'
                            ? classes.darkChipText
                            : classes.chipText
                    }
                >
                    {chipText}
                </Typography>
            }
        />
    );
};

export default MyInformation;
