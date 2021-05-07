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
import { GET_ROUTE_BY_MONTH, GET_DETAIL_ROUTES } from '../gql/registerbus/query';
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
        //applyRoute에 mutation할 state
        routeName: routeInfo.length === 0 ? '' : routeInfo[0].route,
        partitionKey: routeInfo.length === 0 ? '' : routeInfo[0].partitionKey,
        detailPartitionKey: '',
    });
    const [month, setMonth] = useState('');
    const [routeMonth, setRouteMonth] = useState([]); // 노선별 신청 가능 월 list
    const [locationList, setLocationList] = useState([]); // 버스 정류장 list
    const [locationError, setLocationError] = useState(false); //버스 정류장 미선택시 에러

    const [getRouteByMonth, { data, refetch }] = useLazyQuery(GET_ROUTE_BY_MONTH);
    const [getDetailRoutes, { data: routeData, refetch: refetchRoute }] = useLazyQuery(
        GET_DETAIL_ROUTES,
    );
    const [applyRoute, { data: applyData }] = useMutation(APPLY_ROUTE, {
        onCompleted() {
            userRefetch();
            setRoute({
                routeName: routeInfo.length === 0 ? '' : routeInfo[0].route,
                partitionKey: routeInfo.length === 0 ? '' : routeInfo[0].partitionKey,
                detailPartitionKey: '',
            });
            refetchRoute({ route: routeInfo[0].route });
        },
    });

    const changeRoute = e => {
        const partitionKey = e.target.value.split('+')[0];
        const routeName = e.target.value.split('+')[1];
        setRoute({ partitionKey: partitionKey, routeName: routeName, detailPartitionKey: '' });
        refetch({ partitionKey: partitionKey });
        refetchRoute({ route: routeName });
    };

    const registerSubmit = () => {
        if (route.detailPartitionKey === '') {
            setLocationError(true);
        } else {
            applyRoute({
                variables: {
                    route: route.routeName,
                    partitionKey: route.partitionKey,
                    month: month,
                    detailPartitionKey: route.detailPartitionKey,
                },
            });
            setLocationError(false);
        }
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
            getDetailRoutes({
                variables: {
                    route: routeInfo[0].route,
                },
            });
        }
    }, [routeInfo, getRouteByMonth, getDetailRoutes]);

    useEffect(() => {
        if (data) {
            const { success, message, data: monthData } = data.getRouteByMonth;
            if (success) {
                setRouteMonth(monthData);
                setMonth(monthData[monthData.length - 1].month);
            } else console.log(message);
        }
    }, [data]);

    useEffect(() => {
        if (routeData) {
            const { success, message, data } = routeData.getDetailRoutes;
            if (success) {
                setLocationList(data);
            } else console.log(message);
        }
    }, [routeData]);

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
            <Box mb={2}>
                {locationList.length > 0 && (
                    <TextField
                        select
                        value={route.detailPartitionKey}
                        onChange={e => {
                            setRoute({ ...route, detailPartitionKey: e.target.value });
                            setLocationError(false);
                        }}
                        variant="outlined"
                        label="정류장 명"
                        fullWidth
                        size="small"
                        error={locationError}
                        helperText={locationError ? '정류장을 선택해주세요.' : ' '}
                    >
                        {locationList.map((data, index) => {
                            if (index !== locationList.length - 1)
                                return (
                                    <MenuItem key={data.partitionKey} value={data.partitionKey}>
                                        {data.location}
                                    </MenuItem>
                                );
                            else return '';
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
    const [routeIndex, setRouteIndex] = useState(0);
    const [month, setMonth] = useState(userBusData.length === 0 ? '' : userBusData[0].month);
    const [routeName, setRouteName] = useState(
        userBusData.length === 0 ? '' : userBusData[0].route,
    );
    const [confirmCancel, setConfirmCancel] = useState(false);

    const alreadyCancel =
        userBusData.length === 0
            ? false
            : userBusData[routeIndex].month === dayjs().format('YYYY-MM') &&
              userBusData[routeIndex].isCancellation;

    const [cancelRoute, { data }] = useMutation(CANCEL_ROUTE, {
        onCompleted() {
            userRefetch();
        },
    });

    const doCancel = () => {
        cancelRoute({ variables: { busId: userBusData[routeIndex].busId, month: month } });
        setMonth(userBusData.length === 0 ? '' : userBusData[0].month);
        setRouteIndex(0);
        setSnackbar(true);
    };

    const cancelButtonClick = () => {
        if (userBusData[routeIndex].month === dayjs().format('YYYY-MM')) {
            setConfirmCancel(true);
        } else doCancel();
    };

    const currMonthCancel = () => {
        setConfirmCancel(false);
        doCancel();
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.cancelRoute;
            if (success) {
                setRouteName(userBusData.length === 0 ? '' : userBusData[0].route);
            } else console.log(message);
        }
    }, [data, setSnackbar, userBusData]);

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
                            value={month + '+' + routeIndex}
                            onChange={e => {
                                const data = e.target.value.split('+');
                                setMonth(data[0]);
                                setRouteIndex(data[1]);
                                setRouteName(userBusData[data[1]].route);
                            }}
                        >
                            {userBusData.map((data, index) => (
                                <MenuItem key={data.month} value={data.month + '+' + index}>
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
                            disabled={alreadyCancel}
                        >
                            {alreadyCancel ? '이미 취소함' : '노선 취소하기'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
            <Dialog
                open={confirmCancel}
                onClose={() => setConfirmCancel(false)}
                fullWidth
                maxWidth="xs"
            >
                <Box px={3} py={2}>
                    <Box mb={2}>
                        <Typography className={classes.warningTitle}>현월 신청 취소</Typography>
                    </Box>
                    <Box mb={3}>
                        <Typography className={classes.warningText}>
                            <strong>현월({dayjs().format('YYYY-MM')})</strong> 신청을 취소하면 더
                            이상 현월 신청을 할 수 없습니다.
                            <br />
                            정말 취소하시겠습니까?
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Box mr={2} width="50%">
                            <Button
                                variant="contained"
                                onClick={currMonthCancel}
                                className={classes.resetButton}
                                fullWidth
                            >
                                현월 취소
                            </Button>
                        </Box>
                        <Box width="50%">
                            <Button
                                variant="contained"
                                onClick={() => setConfirmCancel(false)}
                                className={classes.decideButton}
                                fullWidth
                            >
                                닫기
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </React.Fragment>
    );
};

//Dialog창이 아래서 올라오게 함.
const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default RegisterBus;
