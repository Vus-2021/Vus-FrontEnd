import React, { useEffect, useState } from 'react';
import Header2 from '../layout/Header2';
import {
    Dialog,
    Box,
    TextField,
    MenuItem,
    Button,
    Slide,
    Snackbar,
    Tabs,
    Tab,
    Typography,
    Paper,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import RegisterStyle from '../styles/RegisterStyle';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_ROUTE_BY_MONTH } from '../gql/registerbus/query';
import { APPLY_ROUTE, CANCEL_ROUTE } from '../gql/registerbus/mutation';

const RegisterBus = props => {
    const { open, onClose, routeInfo, userBusData, userRefetch } = props;
    const classes = RegisterStyle();
    const [openSnackbar, setSnackbar] = useState(false);
    const [openErrorbar, setErrorbar] = useState(false);
    const [boardType, setBoardType] = useState('register');

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <Header2 handleClose={handleClose} headerText="노선 신청/취소" height="40px" />
            <Box pl={3} pr={3} pt={2} pb={5}>
                <Box display="flex" justifyContent="center">
                    <Box mb={4} width="100%">
                        <Paper elevation={3}>
                            <Tabs
                                value={boardType}
                                onChange={(e, newValue) => {
                                    setBoardType(newValue);
                                }}
                                aria-label="register tabs"
                                textColor="secondary"
                                indicatorColor="secondary"
                            >
                                <Tab
                                    classes={{ root: classes.tab }}
                                    value="register"
                                    label={<Typography>신청</Typography>}
                                />
                                <Tab
                                    classes={{ root: classes.tab }}
                                    value="cancel"
                                    label={<Typography>취소</Typography>}
                                />
                            </Tabs>
                        </Paper>
                    </Box>
                </Box>
                {boardType === 'register' ? (
                    <Register
                        setSnackbar={setSnackbar}
                        setErrorbar={setErrorbar}
                        routeInfo={routeInfo}
                        userRefetch={userRefetch}
                    />
                ) : (
                    <Cancel
                        userBusData={userBusData}
                        userRefetch={userRefetch}
                        setSnackbar={setSnackbar}
                    />
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={1300}
                style={{ height: '60%' }}
                onClose={() => setSnackbar(false)}
                onClick={() => setSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success">
                    {boardType === 'register' ? '노선 신청이' : '노선 취소가'} 완료되었습니다.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openErrorbar}
                autoHideDuration={1300}
                style={{ height: '60%' }}
                onClose={() => setErrorbar(false)}
                onClick={() => setErrorbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error">이미 등록되어 있습니다.</Alert>
            </Snackbar>
        </Dialog>
    );
};

const Register = props => {
    const { setSnackbar, setErrorbar, routeInfo, userRefetch } = props;
    const classes = RegisterStyle();

    const [route, setRoute] = useState({
        routeName: routeInfo.length === 0 ? '' : routeInfo[0].route,
        partitionKey: routeInfo.length === 0 ? '' : routeInfo[0].partitionKey,
    });
    const [month, setMonth] = useState('');
    const [routeMonth, setRouteMonth] = useState([]);

    const [getRouteByMonth, { data, refetch }] = useLazyQuery(GET_ROUTE_BY_MONTH);
    const [applyRoute, { data: applyData }] = useMutation(APPLY_ROUTE, {
        onCompleted() {
            userRefetch();
        },
    });

    const changeRoute = e => {
        const partitionKey = e.target.value.split('+')[0];
        const routeName = e.target.value.split('+')[1];
        setRoute({ partitionKey: partitionKey, routeName: routeName });
        refetch({ partitionKey: partitionKey });
    };

    const registerSubmit = () => {
        console.log(route.partitionKey);
        applyRoute({
            variables: {
                route: route.routeName,
                partitionKey: route.partitionKey,
                month: month,
            },
        });
    };

    useEffect(() => {
        if (applyData) {
            const { success, message } = applyData.applyRoute;
            if (success) {
                setSnackbar(true);
            } else {
                setErrorbar(true);
                console.log(message);
            }
        }
    }, [applyData, setSnackbar, setErrorbar]);

    useEffect(() => {
        if (routeInfo.length > 0) {
            getRouteByMonth({
                variables: {
                    partitionKey: routeInfo[0].partitionKey,
                },
            });
        }
    }, [routeInfo, getRouteByMonth]);

    useEffect(() => {
        if (data) {
            const { success, message, data: monthData } = data.getRouteByMonth;
            if (success) {
                setRouteMonth(monthData);
                setMonth(monthData[monthData.length - 1].month);
            } else console.log(message);
        }
    }, [data]);

    return (
        <React.Fragment>
            <Box mb={4}>
                <TextField
                    select
                    value={route.partitionKey + '+' + route.routeName}
                    onChange={changeRoute}
                    variant="outlined"
                    label="노선 명"
                    fullWidth
                    size="small"
                >
                    {routeInfo.map(data => (
                        <MenuItem key={data.route} value={data.partitionKey + '+' + data.route}>
                            {data.route}노선
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <Box mb={4}>
                {routeMonth.length > 0 && (
                    <TextField
                        select
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        variant="outlined"
                        label="신청 월"
                        fullWidth
                        size="small"
                    >
                        {routeMonth.map(data => {
                            dayjs.extend(isSameOrAfter);

                            if (dayjs(data.month).isSameOrAfter(dayjs().format('YYYY-MM'))) {
                                return (
                                    <MenuItem
                                        key={data.month}
                                        value={dayjs(data.month).format('YYYY-MM')}
                                    >
                                        {dayjs(data.month).format('YYYY년 MM월')}
                                    </MenuItem>
                                );
                            } else return null;
                        })}
                    </TextField>
                )}
            </Box>
            <Box width="100%">
                <Button onClick={registerSubmit} className={classes.registerButton}>
                    노선 신청하기
                </Button>
            </Box>
        </React.Fragment>
    );
};

const Cancel = props => {
    const { userBusData, userRefetch, setSnackbar } = props;
    const classes = RegisterStyle();
    const routeName = userBusData.length === 0 ? '' : userBusData[0].route;
    const [month, setMonth] = useState(userBusData.length === 0 ? '' : userBusData[0].month);

    const [cancelRoute, { data }] = useMutation(CANCEL_ROUTE, {
        onCompleted() {
            userRefetch();
        },
    });

    const cancelButtonClick = () => {
        cancelRoute({ variables: { busId: userBusData[0].busId, month: month } });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.cancelRoute;
            if (success) {
                setSnackbar(true);
            } else console.log(message);
        }
    }, [data, setSnackbar]);

    return (
        <React.Fragment>
            {userBusData.length === 0 ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    disabled
                    value="신청 내역이 없습니다."
                    inputProps={{ style: { textAlign: 'center' } }}
                />
            ) : (
                <React.Fragment>
                    <Box mb={4}>
                        <TextField
                            variant="outlined"
                            label="노선 명"
                            fullWidth
                            size="small"
                            disabled
                            value={`${routeName}노선`}
                        />
                    </Box>
                    <Box mb={4}>
                        <TextField
                            label="신청 월"
                            select
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                        >
                            {userBusData.map(data => (
                                <MenuItem key={data.month} value={data.month}>
                                    {dayjs(data.month).format('YYYY년 MM월')}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box width="100%">
                        <Button
                            variant="contained"
                            className={classes.cancelButton}
                            onClick={cancelButtonClick}
                        >
                            노선 취소하기
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

//Dialog창이 아래서 올라오게 함.
const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default RegisterBus;
