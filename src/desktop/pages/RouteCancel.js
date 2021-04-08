import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    InputAdornment,
    Select,
    FormControl,
    MenuItem,
    Paper,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Search, AssignmentTurnedIn, CancelPresentation } from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import RouteCancelStyle from '../styles/RouteCancelStyle';

const columns = [
    { field: 'name', headerName: '이름', width: 100 },
    { field: 'type', headerName: '소속', width: 130 },
    { field: 'userId', headerName: '아이디(사원번호)', width: 150 },
    { field: 'routeName', headerName: '노선 명', width: 100 },
];

const rows = [{ id: 1, name: '김바텍', type: 'VT', userId: 'v12345', routeName: '강남' }];

const RouteCancel = () => {
    const classes = RouteCancelStyle();
    const { control, handleSubmit } = useForm();

    const [selection, setSelection] = useState([]);

    const searchClick = data => {
        console.log(data);
    };

    const admitButtonClick = () => {
        console.log('admit');
        setSelection([]);
    };

    const rejectButtonClick = () => {
        console.log('reject');
        setSelection([]);
    };

    return (
        <Box px={15} pt={5} minWidth="600px">
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box mr={1}>
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            className={classes.buttonAdmit}
                            disabled={selection.length === 0}
                            onClick={admitButtonClick}
                        >
                            <AssignmentTurnedIn />
                            <Typography>&nbsp;승인</Typography>
                        </Button>
                    </Box>
                    <Box mr={2}>
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            className={classes.buttonReject}
                            disabled={selection.length === 0}
                            onClick={rejectButtonClick}
                        >
                            <CancelPresentation />
                            <Typography>&nbsp;거부</Typography>
                        </Button>
                    </Box>
                    <Box>
                        <Typography>{selection.length}개 선택됨</Typography>
                    </Box>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit(searchClick)}>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Box width="230px" mr={1}>
                                <Controller
                                    name="search"
                                    control={control}
                                    as={TextField}
                                    defaultValue=""
                                    size="small"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Controller
                                                    control={control}
                                                    name="select"
                                                    defaultValue="name"
                                                    render={props => (
                                                        <FormControl variant="standard">
                                                            <Select
                                                                defaultValue="name"
                                                                onChange={e =>
                                                                    props.onChange(e.target.value)
                                                                }
                                                                disableUnderline
                                                            >
                                                                <MenuItem value="name">
                                                                    이름
                                                                </MenuItem>
                                                                <MenuItem value="type">
                                                                    소속
                                                                </MenuItem>
                                                                <MenuItem value="routeName">
                                                                    노선 명
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="검색"
                                />
                            </Box>
                            <Box>
                                <Button
                                    size="large"
                                    type="submit"
                                    variant="outlined"
                                    className={classes.searchButton}
                                >
                                    검색
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Box>
            <Box mb={1}>
                <Paper>
                    <Box width="100%" height="500px">
                        <DataGrid
                            columns={columns}
                            rows={rows}
                            checkboxSelection
                            hideFooterSelectedRowCount
                            autoPageSize
                            onSelectionModelChange={newSelection => {
                                setSelection(newSelection.selectionModel);
                            }}
                            onPageChange={params => setPage(params.page)}
                            page={page}
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default RouteCancel;
