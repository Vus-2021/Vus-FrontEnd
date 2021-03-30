import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import AdminStyle from '../styles/AdminStyle';
import { Box, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useQuery } from '@apollo/react-hooks';
import { GET_ROUTE_NAME } from '../gql/header/query';

import User from './User';
import Route from './Route';
import Notice from './Notice';
import CreateRoute from './CreateRoute';
import Boarder from './Boarder';

const Admin = () => {
    const classes = AdminStyle();
    const [adminName] = useState('김바텍');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [state, setState] = useState({
        titleName: '사용자 관리',
        view: 'userDefault',
    });

    const [routeItems, setRouteItems] = useState([]);

    const { loading, data } = useQuery(GET_ROUTE_NAME);

    useEffect(() => {
        if (data) {
            const { success, data: routeName } = data.getRoutesInfo;
            if (success) {
                console.log('routeName fetched');
                setRouteItems(routeName);
            } else console.log('failure');
        }
    }, [data]);

    return (
        <React.Fragment>
            <div className={classes.rootBox}>
                <Header
                    adminName={adminName}
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    setState={setState}
                    routeItems={routeItems}
                    loading={loading}
                />

                <Box className={clsx(classes.mainBox, { [classes.mainBoxShift]: openDrawer })}>
                    <Box height="40px" ml={5}>
                        <Typography className={classes.titleText}>{state.titleName}</Typography>
                    </Box>
                    <Box className={classes.viewBox}>
                        <SelectView view={state.view} setState={setState} routeItems={routeItems} />
                    </Box>
                </Box>
            </div>
        </React.Fragment>
    );
};

const SelectView = props => {
    const { view, routeItems } = props;

    switch (view) {
        case 'userDefault':
            return <User />;
        case 'routeDefault':
            return <Route />;
        case 'routeCreate':
            return <CreateRoute />;
        case 'noticeDefault':
            return <Notice />;
        case 'boarderDefault':
            return <Boarder routeItems={routeItems} />;
        default:
            return <div>default!</div>;
    }
};

export default Admin;
