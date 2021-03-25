import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    Paper,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteForever, Search } from '@material-ui/icons';
import UserStyle from '../styles/UserStyle';
import { useForm, Controller } from 'react-hook-form';
import RegisterDialog from './Register';

const columns = [
    { field: 'name', headerName: '이름', width: 90 },
    { field: 'type', headerName: '소속', width: 160 },
    { field: 'employeeNumber', headerName: '사원번호', width: 130 },
    { field: 'phoneNumber', headerName: '휴대폰번호', width: 160 },
    { field: 'registerDate', headerName: '입사일', width: 200 },
];

const rows = [
    {
        id: 1,
        name: '김바텍',
        type: 'test',
        employeeNumber: 'v13243',
        phoneNumber: '01088435154',
        registerDate: '2021-03-03',
    },
];

const User = props => {
    const classes = UserStyle();
    const [selection, setSelection] = useState([]);
    const [registerDialog, setRegisterDialog] = useState(false); //등록 Dialog open 여부

    const { handleSubmit, control } = useForm();

    const searchClick = data => {
        console.log(data);
    };

    console.log(selection);

    return (
        <Box px={15} pt={5}>
            <Box className={classes.mainBox} mb={1}>
                <Box className={classes.searchBox}>
                    <Box mr={2}>
                        <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            className={classes.buttonDelete}
                            disabled={selection.length === 0}
                        >
                            <DeleteForever /> <Typography>&nbsp;삭제</Typography>
                        </Button>
                    </Box>
                    <Box>
                        <Typography>{selection.length}개 선택됨</Typography>
                    </Box>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit(searchClick)}>
                        <Box className={classes.searchBox}>
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
                                                        <FormControl
                                                            size="small"
                                                            variant="standard"
                                                        >
                                                            <Select
                                                                defaultValue="name"
                                                                onChange={e =>
                                                                    props.onChange(e.target.value)
                                                                }
                                                            >
                                                                <MenuItem value="name">
                                                                    이름
                                                                </MenuItem>
                                                                <MenuItem value="type">
                                                                    소속
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
                            hideFooter
                            onSelectionModelChange={newSelection => {
                                setSelection(newSelection.selectionModel);
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
            <Box className={classes.registerBox}>
                <Button
                    variant="contained"
                    className={classes.registerButton}
                    color="primary"
                    onClick={() => setRegisterDialog(true)}
                >
                    <Typography>관리자/버스기사 등록</Typography>
                </Button>
            </Box>
            <RegisterDialog open={registerDialog} onClose={setRegisterDialog} />
        </Box>
    );
};

export default User;
