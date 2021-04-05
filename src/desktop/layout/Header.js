import React, { useState } from 'react';
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
} from '@material-ui/core';
import {
    Menu,
    Clear,
    AccountCircle,
    AssignmentInd,
    DirectionsBus,
    NotificationsActive,
    AirlineSeatReclineExtra,
    ExpandLess,
    ExpandMore,
    PlaylistAdd,
} from '@material-ui/icons';

const Header = props => {
    const {
        adminName,
        openDrawer,
        setOpenDrawer,
        setState,
        routeItems,
        setRouteName,
        setPartitionKey,
        loading,
    } = props;
    const classes = HeaderStyle();

    const menuClick = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <React.Fragment>
            <AppBar position="fixed" className={classes.headerBar}>
                <Toolbar>
                    {adminName && (
                        <IconButton edge="start" onClick={menuClick}>
                            {openDrawer ? (
                                <Clear style={{ color: 'white' }} fontSize="large" />
                            ) : (
                                <Menu style={{ color: 'white' }} fontSize="large" />
                            )}
                        </IconButton>
                    )}

                    <Box className={classes.logoBox}>
                        <img src={logo} width="115px" height="30px" alt="nothing" />
                    </Box>

                    {adminName && (
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography className={classes.adminId}>
                                {adminName} 관리자님 &nbsp;
                            </Typography>
                            <AccountCircle fontSize="large" />
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {adminName && (
                <Drawer
                    anchor="left"
                    variant="persistent"
                    open={openDrawer}
                    ModalProps={{ keepMounted: true }}
                    className={classes.menuDrawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Box mb={1} className={classes.toolbar} />
                    <MenuItems
                        classes={classes}
                        routeItems={routeItems}
                        setState={setState}
                        setRouteName={setRouteName}
                        setPartitionKey={setPartitionKey}
                        loading={loading}
                    />
                </Drawer>
            )}
            <Box height="64px"></Box>
        </React.Fragment>
    );
};

const MenuItems = props => {
    const { classes, routeItems, setState, setRouteName, setPartitionKey, loading } = props;
    const [open, setOpen] = useState(false);

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
                break;
            case 1: //노선 관리
                setOpen(!open);
                break;
            case 2: //공지 관리
                setState({ titleName: '공지 관리', view: 'noticeDefault' });
                break;
            case 3: //신청자 관리/선별
                setState({ titleName: '탑승객 관리', view: 'boarderDefault' });
                break;
            default:
                break;
        }
    };

    const routeClick = (routeName, partitionKey) => {
        setState({ titleName: `${routeName}노선`, view: 'routeDefault' });
        setRouteName(routeName);
        setPartitionKey(partitionKey);
    };

    return menuItems.map((data, index) => (
        <React.Fragment key={index}>
            {index === 3 && (
                <React.Fragment>
                    <Box mb={1} className={classes.toolbar} />
                    <Divider />
                </React.Fragment>
            )}
            <List disablePadding>
                <ListItem button onClick={() => managementClick(index)} disabled={loading}>
                    <ListItemIcon>{data.icon}</ListItemIcon>
                    <ListItemText>
                        <Typography className={classes.listText}>{data.text}</Typography>
                    </ListItemText>
                    {index === 1 && (open ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {index === 1 && (
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            <ListItem
                                button
                                onClick={() => {
                                    setState({ titleName: '노선 생성', view: 'routeCreate' });
                                }}
                                className={classes.nested}
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
                                    onClick={() =>
                                        routeClick(routeData.route, routeData.partitionKey)
                                    }
                                    className={classes.nested}
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
            </List>
        </React.Fragment>
    ));
};

export default Header;
