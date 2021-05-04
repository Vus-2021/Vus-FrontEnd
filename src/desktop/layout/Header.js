import React, { useState, useContext, useEffect } from 'react';
import HeaderStyle from '../styles/HeaderStyle';
import logo from '../images/Vatech_logo.png';
import {
    Box,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
    Button,
    ButtonBase,
    Dialog,
} from '@material-ui/core';
import {
    Menu,
    Clear,
    AssignmentInd,
    DirectionsBus,
    NotificationsActive,
    AirlineSeatReclineExtra,
    ExpandLess,
    ExpandMore,
    PlaylistAdd,
} from '@material-ui/icons';
import AddCalendar from '../components/AddCalendar';
import { DeviceMode } from '../../App';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ROUTE_BY_MONTH } from '../gql/header/query';
import { ADD_ALL_MONTHLY_ROUTE } from '../gql/header/mutation';

import * as dayjs from 'dayjs';

const Header = props => {
    const {
        openDrawer,
        setOpenDrawer,
        setState,
        routeItems,
        setRouteName,
        setPartitionKey,
        loading,
    } = props;
    const classes = HeaderStyle();
    const history = useHistory();

    const deviceMode = useContext(DeviceMode);

    const menuClick = () => {
        setOpenDrawer(!openDrawer);
    };

    const logoutClick = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <React.Fragment>
            <AppBar position="fixed" className={classes.headerBar}>
                <Toolbar>
                    <IconButton edge="start" onClick={menuClick} style={{ padding: 5 }}>
                        {openDrawer ? (
                            <Clear
                                className={deviceMode ? classes.menuIconSmall : classes.menuIcon}
                            />
                        ) : (
                            <Menu
                                className={deviceMode ? classes.menuIconSmall : classes.menuIcon}
                            />
                        )}
                    </IconButton>

                    <Box className={classes.logoBox}>
                        <Button
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            {deviceMode ? (
                                <img src={logo} width="96px" height="25px" alt="nothing" />
                            ) : (
                                <img src={logo} width="115px" height="30px" alt="nothing" />
                            )}
                        </Button>
                    </Box>

                    <React.Fragment>
                        <Box display="flex" alignItems="center">
                            <Typography
                                component={ButtonBase}
                                onClick={() => history.goBack()}
                                className={deviceMode ? classes.adminIdSmall : classes.adminId}
                            >
                                사용자용 열기
                            </Typography>

                            {!deviceMode && (
                                <Box ml={2}>
                                    <Box component={ButtonBase} onClick={logoutClick}>
                                        <Typography className={classes.adminId}>
                                            로그아웃
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </React.Fragment>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                variant={deviceMode ? 'temporary' : 'persistent'}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                ModalProps={{ keepMounted: true }}
                className={classes.menuDrawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Box mb={1} className={classes.toolbar} display="flex" alignItems="center">
                    <Box width="50%">
                        <IconButton onClick={() => setOpenDrawer(false)}>
                            <Clear style={{ fontSize: '30px' }} />
                        </IconButton>
                    </Box>
                    <Box width="50%" mr={2}>
                        <Button
                            variant="contained"
                            onClick={logoutClick}
                            className={classes.logoutButton}
                            fullWidth
                        >
                            로그아웃
                        </Button>
                    </Box>
                </Box>
                {routeItems.length > 0 && (
                    <MenuItems
                        classes={classes}
                        routeItems={routeItems}
                        setState={setState}
                        setRouteName={setRouteName}
                        setPartitionKey={setPartitionKey}
                        loading={loading}
                        setOpenDrawer={setOpenDrawer}
                    />
                )}
            </Drawer>

            <Box height="64px"></Box>
        </React.Fragment>
    );
};

const MenuItems = props => {
    const {
        classes,
        routeItems,
        setState,
        setRouteName,
        setPartitionKey,
        loading,
        setOpenDrawer,
    } = props;
    const [date, setDate] = useState({}); //년도별로 월을 담고 있는 json data
    const [lastMonth, setLastMonth] = useState(''); //생성된 마지막 년,월
    const [select, setSelect] = useState('사용자 관리');
    const [openRoute, setOpenRoute] = useState(false); //노선 관리 세부 list open 여부
    const [openBoarder, setOpenBoarder] = useState(false); //탑승객 관리 세부 list open 여부
    const [yearIndex, setYearIndex] = useState(-1);
    const deviceMode = useContext(DeviceMode);
    const [openMonthDialog, setOpenMonthDialog] = useState(false);

    const { data, refetch } = useQuery(GET_ROUTE_BY_MONTH, {
        variables: { partitionKey: routeItems[0].partitionKey },
    });

    const menuItems = [
        {
            text: '사용자 관리',
            icon: <AssignmentInd className={classes.listIcon} />,
        },
        {
            text: '노선 관리',
            icon: <DirectionsBus className={classes.listIcon} />,
        },
        {
            text: '공지 관리',
            icon: <NotificationsActive className={classes.listIcon} />,
        },
        {
            text: '탑승객 관리',
            icon: <AirlineSeatReclineExtra className={classes.listIcon} />,
        },
    ];

    const managementClick = index => {
        switch (index) {
            case 0: //사용자 관리
                setState({ titleName: '사용자 관리', view: 'userDefault' });
                setSelect('사용자 관리');
                setOpenDrawer(!deviceMode || false);
                break;
            case 1: //노선 관리
                setOpenRoute(!openRoute);
                break;
            case 2: //공지 관리
                setState({ titleName: '공지 관리', view: 'noticeDefault' });
                setSelect('공지 관리');
                setOpenDrawer(!deviceMode || false);
                break;
            case 3: //신청자 관리/선별
                setOpenBoarder(!openBoarder);
                break;
            default:
                break;
        }
    };

    const routeClick = (routeName, partitionKey) => {
        setState({ titleName: `${routeName}노선`, view: 'routeDefault' });
        setRouteName(routeName);
        setPartitionKey(partitionKey);
        setOpenDrawer(!deviceMode || false);
    };

    const monthSelectClick = (year, month) => {
        setState({
            titleName: `탑승객 관리 (${year}-${month})`,
            view: 'boarderDefault',
            month: year + '-' + month,
        });
        setOpenDrawer(!deviceMode || false);
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: monthData } = data.getRouteByMonth;
            if (success) {
                const obj = {};
                monthData.forEach(monthList => {
                    const date = monthList.month.split('-');
                    if (!(date[0] in obj)) obj[date[0]] = [];
                    obj[date[0]].push(date[1]);
                });
                setDate(obj);
                setLastMonth(monthData[monthData.length - 1].month);
            } else console.log(message);
        }
    }, [data]);

    return menuItems.map((data, index) => (
        <React.Fragment key={index}>
            {index === 3 && (
                <React.Fragment>
                    <Box mb={1} className={classes.toolbar} />
                    <Divider />
                </React.Fragment>
            )}
            <List disablePadding>
                <ListItem
                    button
                    onClick={() => {
                        managementClick(index);
                    }}
                    disabled={loading}
                    style={{
                        backgroundColor: select === data.text ? 'rgba(255,0,0,0.2)' : null,
                    }}
                >
                    <ListItemIcon>{data.icon}</ListItemIcon>
                    <ListItemText>
                        <Typography className={classes.listText}>{data.text}</Typography>
                    </ListItemText>
                    {index === 1 && (openRoute ? <ExpandLess /> : <ExpandMore />)}
                    {index === 3 && (openBoarder ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {index === 1 && (
                    <Collapse in={openRoute} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            <ListItem
                                button
                                onClick={() => {
                                    setState({ titleName: '노선 생성', view: 'routeCreate' });
                                    setSelect('노선 생성');
                                }}
                                className={classes.nested}
                                style={{
                                    backgroundColor:
                                        select === '노선 생성' ? 'rgba(255,0,0,0.2)' : null,
                                }}
                            >
                                <ListItemIcon>
                                    <PlaylistAdd className={classes.nestedIcon} />
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography className={classes.nestedText}>
                                        노선 생성
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                        </List>
                        {routeItems.map((routeData, routeIndex) => (
                            <List key={routeIndex} disablePadding>
                                <ListItem
                                    button
                                    onClick={() => {
                                        routeClick(routeData.route, routeData.partitionKey);
                                        setSelect(routeData.route);
                                    }}
                                    className={classes.nested}
                                    style={{
                                        backgroundColor:
                                            select === routeData.route ? 'rgba(255,0,0,0.2)' : null,
                                    }}
                                >
                                    <ListItemIcon>{routeIndex + 1}.</ListItemIcon>
                                    <ListItemText>
                                        <Typography className={classes.nestedText}>
                                            {routeData.route}노선
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        ))}
                    </Collapse>
                )}
                {index === 3 && (
                    <Collapse in={openBoarder} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            <ListItem
                                button
                                className={classes.nested}
                                onClick={() => setOpenMonthDialog(true)}
                            >
                                <ListItemIcon>
                                    <AddCalendar className={classes.monthNestedIcon} />
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography className={classes.nestedText}>
                                        신청월 추가
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                            <AddMonthDialog
                                open={openMonthDialog}
                                onClose={setOpenMonthDialog}
                                lastMonth={lastMonth}
                                refetch={refetch}
                                setYearIndex={setYearIndex}
                                setSelect={setSelect}
                            />
                            {Object.keys(date).map(year => (
                                <List key={year} disablePadding>
                                    <ListItem
                                        button
                                        onClick={() =>
                                            year === yearIndex
                                                ? setYearIndex(-1)
                                                : setYearIndex(year)
                                        }
                                        className={classes.nested}
                                    >
                                        <ListItemIcon>○</ListItemIcon>
                                        <ListItemText>{year}년</ListItemText>
                                        {year === yearIndex ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={year === yearIndex}>
                                        {date[year].map(month => (
                                            <List disablePadding key={year + month}>
                                                <ListItem
                                                    button
                                                    className={classes.doubleNested}
                                                    onClick={() => {
                                                        monthSelectClick(year, month);
                                                        setSelect(year + '-' + month);
                                                    }}
                                                    style={{
                                                        backgroundColor:
                                                            year + '-' + month === select
                                                                ? 'rgba(255,0,0,0.2)'
                                                                : null,
                                                    }}
                                                >
                                                    <ListItemIcon>-</ListItemIcon>
                                                    <ListItemText>{month}월</ListItemText>
                                                </ListItem>
                                            </List>
                                        ))}
                                    </Collapse>
                                </List>
                            ))}
                        </List>
                    </Collapse>
                )}
            </List>
        </React.Fragment>
    ));
};

const AddMonthDialog = props => {
    const { open, onClose, lastMonth, refetch, setYearIndex, setSelect } = props;
    const classes = HeaderStyle();

    const newMonth = lastMonth
        ? dayjs(lastMonth).add(1, 'month').format('YYYY-MM')
        : dayjs().format('YYYY-MM');

    const [addAllMonthlyRoute, { data }] = useMutation(ADD_ALL_MONTHLY_ROUTE, {
        onCompleted() {
            refetch();
        },
    });

    const createClick = () => {
        addAllMonthlyRoute({ variables: { month: newMonth } });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.addAllMonthlyRoute;
            if (success) {
                onClose(false);
                setYearIndex(newMonth.split('-')[0]);
                setSelect(newMonth);
            } else console.log(message);
        }
    }, [data, onClose, newMonth, setSelect, setYearIndex]);

    return (
        <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.warningTitle}>신청월 추가</Typography>
                </Box>
                <Box mb={3}>
                    <Typography className={classes.warningText}>
                        모든 노선에 <strong>{newMonth}</strong>월 신청을 생성합니다.
                        <br />
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Box mr={2} width="50%">
                        <Button
                            variant="contained"
                            onClick={createClick}
                            className={classes.createButton}
                            fullWidth
                        >
                            생성
                        </Button>
                    </Box>
                    <Box width="50%">
                        <Button
                            variant="contained"
                            onClick={() => onClose(false)}
                            className={classes.cancelButton}
                            fullWidth
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Header;
