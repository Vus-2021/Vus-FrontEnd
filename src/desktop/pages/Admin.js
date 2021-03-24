import React, { useState } from 'react';
import Header from '../layout/Header';
import AdminStyle from '../styles/AdminStyle';
import { Box, Drawer } from '@material-ui/core';

const Admin = () => {
    const classes = AdminStyle();
    const [adminName] = useState('김바텍');

    const [openDrawer, setOpenDrawer] = useState(false);

    console.log(openDrawer);

    return (
        <React.Fragment>
            <div className={classes.rootBox}>
                <Header
                    adminName={adminName}
                    setOpenDrawer={setOpenDrawer}
                    openDrawer={openDrawer}
                />
                <Box>
                    <Drawer
                        anchor="left"
                        variant="persistent"
                        open
                        ModalProps={{ keepMounted: true }}
                    ></Drawer>
                </Box>
            </div>
        </React.Fragment>
    );
};

export default Admin;
