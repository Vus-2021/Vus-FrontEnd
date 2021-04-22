import React from 'react';
import { Dialog, Box, Typography, Divider, List, ListItem, ListItemText } from '@material-ui/core';
import Header2 from '../layout/Header2';
import PassengersStyle from '../styles/PassengersStyle';

const Passengers = props => {
    const classes = PassengersStyle();
    const { open, onClose, location, passengers } = props;
    return (
        <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
            <Header2 handleClose={() => onClose(false)} headerText="탑승객 정보" />
            <Box px={3} py={2}>
                <Typography className={classes.mainTitle}>{location}</Typography>
                <Divider style={{ height: '2px', backgroundColor: 'black' }} />
                <List>
                    {passengers.map(passenger => (
                        <React.Fragment key={passenger.phoneNumber}>
                            <ListItem alignItems="center" className={classes.listItem}>
                                <ListItemText>{passenger.name}</ListItemText>
                                <ListItemText className={classes.phoneNumberList}>
                                    {passenger.phoneNumber}
                                </ListItemText>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Dialog>
    );
};

export default Passengers;
