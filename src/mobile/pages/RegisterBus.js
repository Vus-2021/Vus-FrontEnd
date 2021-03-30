import React, { useEffect, useState } from 'react';
import Header2 from '../layout/Header2';
import { Dialog, Box, TextField, MenuItem, Button, Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import * as dayjs from 'dayjs';
import LogInStyle from '../styles/LogInStyle';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_ROUTE_BY_MONTH } from '../gql/registerbus/query';
import { APPLY_ROUTE } from '../gql/registerbus/mutation';

const RegisterBus = props => {
    const { open, onClose, routeInfo } = props;
    const classes = LogInStyle();
    const [openSnackbar, setSnackbar] = useState(false);
    const [route, setRoute] = useState({
        routeName: '',
        partitionKey: '',
    });
    const [month, setMonth] = useState('');
    const [routeMonth, setRouteMonth] = useState([]);

    const [getRouteByMonth, { data, refetch }] = useLazyQuery(GET_ROUTE_BY_MONTH);
    const [applyRoute, { data: applyData }] = useMutation(APPLY_ROUTE);

    const handleClose = () => {
        onClose();
        setSnackbar(false);
    };

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
        if (applyData && open) {
            const { success, message } = applyData.applyRoute;
            if (success) {
                setSnackbar(true);
            } else console.log(message);
        }
    }, [applyData, open, onClose]);

    useEffect(() => {
        if (routeInfo.length > 0) {
            setRoute({
                routeName: routeInfo[0].route,
                partitionKey: routeInfo[0].partitionKey,
            });
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
                setMonth(monthData[0].month);
            } else console.log(message);
        }
    }, [data]);

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <Header2 handleClose={handleClose} headerText="노선신청" height="40px" />
            <Box pl={3} pr={3} pt={5} pb={5}>
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
                    <TextField
                        select
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        variant="outlined"
                        label="신청 월"
                        fullWidth
                        size="small"
                    >
                        {routeMonth.map(data => (
                            <MenuItem key={data.month} value={dayjs(data.month).format('YYYY-MM')}>
                                {dayjs(data.month).format('YYYY년 MM월')}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box width="100%">
                    <Button onClick={registerSubmit} className={classes.registerButton}>
                        노선 신청하기
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={1300}
                style={{ height: '60%' }}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success">노선 신청이 완료되었습니다.</Alert>
            </Snackbar>
        </Dialog>
    );
};

//Dialog창이 아래서 올라오게 함.
const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} timeout={600} />;
});

export default RegisterBus;
