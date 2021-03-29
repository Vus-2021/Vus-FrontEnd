import React, { useEffect, useState } from 'react';
import Header2 from '../layout/Header2';
import { Dialog, Box, TextField, MenuItem, Button, Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useForm, Controller } from 'react-hook-form';
import * as dayjs from 'dayjs';
import LogInStyle from '../styles/LogInStyle';
import { useMutation } from '@apollo/react-hooks';
import { APPLY_ROUTE } from '../gql/registerbus/mutation';

const RegisterBus = props => {
    const { open, onClose, routeInfo } = props;
    const classes = LogInStyle();
    const [valMonth, setValMonth] = useState(dayjs(new Date()).format('YYYY-MM'));
    const [routeName, setRouteName] = useState('강남');
    const [openSnackbar, setSnackbar] = useState(false);
    const { handleSubmit, control } = useForm();

    const [applyRoute, { data }] = useMutation(APPLY_ROUTE);

    const handleClose = () => {
        onClose();
        setSnackbar(false);
    };

    const registerSubmit = data => {
        applyRoute({
            variables: {
                route: data.routeName,
                month: data.registerMonth,
            },
        });
    };

    useEffect(() => {
        if (data && open) {
            const { success, message } = data.applyRoute;
            if (success) {
                setSnackbar(true);
            } else console.log(message);
        }
    }, [data, open, onClose]);

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
                <form onSubmit={handleSubmit(registerSubmit)}>
                    <Box mb={4}>
                        <Controller
                            as={
                                <TextField
                                    select
                                    value={valMonth}
                                    onChange={e => setValMonth(e.target.value)}
                                    variant="outlined"
                                    label="신청 월"
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value={dayjs(new Date()).format('YYYY-MM')}>
                                        {dayjs(new Date()).format('YYYY년 MM월')}
                                    </MenuItem>

                                    <MenuItem
                                        value={dayjs(new Date()).add(1, 'month').format('YYYY-MM')}
                                    >
                                        {dayjs(new Date()).add(1, 'month').format('YYYY년 MM월')}
                                    </MenuItem>
                                </TextField>
                            }
                            name="registerMonth"
                            control={control}
                            defaultValue={dayjs(new Date()).format('YYYY-MM')}
                        />
                    </Box>

                    <Box mb={4}>
                        <Controller
                            as={
                                <TextField
                                    select
                                    value={routeName}
                                    onChange={e => setRouteName(e.target.value)}
                                    variant="outlined"
                                    label="노선 명"
                                    fullWidth
                                    size="small"
                                >
                                    {routeInfo.map(data => (
                                        <MenuItem key={data.route} value={data.route}>
                                            {data.route}노선
                                        </MenuItem>
                                    ))}
                                </TextField>
                            }
                            name="routeName"
                            control={control}
                            defaultValue={routeName}
                        />
                    </Box>
                    <Box width="100%">
                        <Button type="submit" className={classes.registerButton}>
                            노선 신청하기
                        </Button>
                    </Box>
                </form>
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
