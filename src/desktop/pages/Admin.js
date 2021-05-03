import React, { useState, useEffect, useContext } from 'react';
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
import { DeviceMode } from '../../App';

const Admin = () => {
    const classes = AdminStyle();
    const device = useContext(DeviceMode);

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
                    padding="10px"
                >
                    <Box height="40px" ml={device ? '10px' : '30px'}>
                        <Typography className={classes.titleText}>{state.titleName}</Typography>
                    </Box>
                    <Box className={classes.viewBox} paddingLeft={device ? '10px' : '30px'}>
                        <SelectView
                            view={state.view}
                            boardMonth={state.month}
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
    const { view, boardMonth, routeItems, routeName, partitionKey, refetch } = props;

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
            return <Boarder routeItems={routeItems} month={boardMonth} />;
        default:
            return <div>default!</div>;
    }
};

export default Admin;
