import React, { useState, useEffect } from 'react';
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
import { GET_USERS } from '../gql/user/query';
import { DELETE_USER } from '../gql/user/mutation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

const columns = [
    { field: 'name', headerName: '이름', width: 90 },
    { field: 'type', headerName: '소속', width: 160 },
    { field: 'userId', headerName: '아이디(사원번호)', width: 150 },
    { field: 'phoneNumber', headerName: '휴대폰번호', width: 160 },
    { field: 'registerDate', headerName: '입사일', width: 200 },
];

const User = props => {
    const classes = UserStyle();
    const history = useHistory();
    const [selection, setSelection] = useState([]);
    const [registerDialog, setRegisterDialog] = useState(false); //등록 Dialog open 여부
    const [userRow, setUserRow] = useState([]);

    const { handleSubmit, control } = useForm();

    const { data, refetch } = useQuery(GET_USERS);
    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted() {
            refetch();
        },
    });

    const searchClick = data => {
        console.log(data);
        refetch({
            [data.select]: data.search,
        });
    };

    const deleteUserClick = () => {
        deleteUser({ variables: { userId: selection } });
    };

    useEffect(() => {
        refetch();
    }, [registerDialog, refetch]);

    useEffect(() => {
        if (data) {
            const { data: userData, success, message } = data.getUsers;
            if (success) {
                let userDataChange = userData;
                userDataChange.forEach(user => {
                    // let typeName;
                    // switch (user.type) {
                    //     case 'VT':
                    //         typeName = '바텍';
                    //         break;
                    //     case 'VH':
                    //         typeName = '바텍이우홀딩스';
                    //         break;
                    //     case 'ES':
                    //         typeName = '이우소프트';
                    //         break;
                    //     case 'RY':
                    //         typeName = '레이언스';
                    //         break;
                    //     case 'WR':
                    //         typeName = '우리엔';
                    //         break;
                    //     case 'VM':
                    //         typeName = '바텍엠시스';
                    //         break;
                    //     case 'VE':
                    //         typeName = '바텍이엔지';
                    //         break;
                    //     case 'VS':
                    //         typeName = '바텍에스앤씨';
                    //         break;
                    //     case 'ADMIN':
                    //         typeName = '관리자';
                    //         break;
                    //     case 'DRIVER':
                    //         typeName = '버스기사';
                    //         break;
                    //     default:
                    //         typeName = 'null';
                    //         break;
                    // }
                    // typeName += '(' + user.type + ')';
                    // user.type = typeName;
                    user.id = user.userId;
                });
                setUserRow(userDataChange);
            } else {
                history.push('/');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                console.log(message);
            }
        }
    }, [data, history]);

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
                            onClick={deleteUserClick}
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
                                                                <MenuItem value="userId">
                                                                    사원번호
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
                            rows={userRow}
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
