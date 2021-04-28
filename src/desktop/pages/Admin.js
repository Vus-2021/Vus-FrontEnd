import React, { useState, useEffect, createContext } from 'react';
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
import { useMediaQuery } from '@material-ui/core';

export const DeviceMode = createContext(null);

const Admin = () => {
    const classes = AdminStyle();
    const device = useMediaQuery('(max-width: 540px)');

    const [openDrawer, setOpenDrawer] = useState(false);
    const [state, setState] = useState({
        titleName: '사용자 관리',
        view: 'userDefault',
    });
    const [routeName, setRouteName] = useState('');
    const [partitionKey, setPartitionKey] = useState('');

    const [routeItems, setRouteItems] = useState([]);

    const { loading, data, refetch } = useQuery(GET_ROUTE_NAME);

    useEffect(() => {
        if (data) {
            const { success, data: routeName } = data.getRoutesInfo;
            if (success) {
                setRouteItems(routeName);
            } else console.log('failure');
        }
    }, [data]);

    return (
        <DeviceMode.Provider value={device}>
            <div className={classes.rootBox}>
                <Header
                    openDrawer={openDrawer}
                    setOpenDrawer={setOpenDrawer}
                    setState={setState}
                    setRouteName={setRouteName}
                    setPartitionKey={setPartitionKey}
                    routeItems={routeItems}
                    loading={loading}
                />

                <Box
                    className={clsx(
                        classes.mainBox,
                        !device && { [classes.mainBoxShift]: openDrawer },
                    )}
                >
                    <Box height="40px" ml={5}>
                        <Typography className={classes.titleText}>{state.titleName}</Typography>
                    </Box>
                    <Box className={classes.viewBox}>
                        <SelectView
                            view={state.view}
                            routeItems={routeItems}
                            routeName={routeName}
                            partitionKey={partitionKey}
                            refetch={refetch}
                        />
                    </Box>
                </Box>
            </div>
        </DeviceMode.Provider>
    );
};

const SelectView = props => {
    const { view, routeItems, routeName, partitionKey, refetch } = props;

    switch (view) {
        case 'userDefault':
            return <User />;
        case 'routeDefault':
            return <Route routeName={routeName} partitionKey={partitionKey} />;
        case 'routeCreate':
            return <CreateRoute refetch={refetch} />;
        case 'noticeDefault':
            return <Notice />;
        case 'boarderDefault':
            return <Boarder routeItems={routeItems} />;
        default:
            return <div>default!</div>;
    }
};

export default Admin;
