/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Header2 from '../layout/Header2';
import { Box, Typography, Divider, Chip } from '@material-ui/core';
import MyInformationStyle from '../styles/MyInformationStyle';

const MyInformation = ({ history, location }) => {
    const classes = MyInformationStyle();
    const { userData, userBusData } = location.state;

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) history.push('/');
    }, [history]);

    return (
        <Box height="100%">
            <Header2 handleClose={() => history.push('/')} headerText="내 정보" />
            <Box overflow="auto" height={`calc(100% - 37px)`}>
                <Box height="3%" width="100%" pl={3} py={1} className={classes.accountText}>
                    계정 정보
                </Box>
                {}
                <Box
                    display="flex"
                    px={3}
                    py={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography className={classes.textTitle}>이름</Typography>
                    <Typography className={classes.textContent}>{userData.name}</Typography>
                </Box>
                <Divider />
                <Box
                    display="flex"
                    px={3}
                    py={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography className={classes.textTitle}>아이디</Typography>
                    <Typography className={classes.textContent}>{userData.userId}</Typography>
                </Box>
                <Divider />
                <Box
                    display="flex"
                    px={3}
                    py={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography className={classes.textTitle}>소속</Typography>
                    <Typography className={classes.textContent}>{userData.type}</Typography>
                </Box>
                <Box height="3%" width="100%" pl={3} py={1} className={classes.accountText}>
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
                                    px={3}
                                    py={1}
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Box display="flex" alignItems="center">
                                        <Typography className={classes.textTitle}>
                                            {data.route}노선
                                        </Typography>
                                        <Typography>{data.month}</Typography>
                                    </Box>
                                    <Box>
                                        <ChipStyle
                                            state={data.state}
                                            cancel={data.isCancellation}
                                        />
                                    </Box>
                                </Box>
                                <Divider />
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
        </Box>
    );
};

const ChipStyle = props => {
    const classes = MyInformationStyle();
    const { state, cancel } = props;
    let chipStyle, chipText;

    if (cancel === 'true') {
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
