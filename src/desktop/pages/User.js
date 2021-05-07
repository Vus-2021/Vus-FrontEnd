import React, { useState, useEffect, useContext } from 'react';
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
    Dialog,
} from '@material-ui/core';
import { DataGrid, GridToolbarContainer } from '@material-ui/data-grid';
import { DeleteForever, Search } from '@material-ui/icons';
import { ExcelUpload, ExcelDownload } from '../components';
import UserStyle from '../styles/UserStyle';
import { useForm, Controller } from 'react-hook-form';
import RegisterDialog from './Register';
import DetailUserDialog from './DetailUser';
import ExcelDialog from './Excel';
import { GET_USERS } from '../gql/user/query';
import { DELETE_USER } from '../gql/user/mutation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DeviceMode } from '../../App';

const columns = [
    { field: 'name', headerName: '이름', width: 130 },
    { field: 'type', headerName: '소속', width: 160 },
    { field: 'userId', headerName: '아이디(사원번호)', width: 150 },
    { field: 'phoneNumber', headerName: '휴대폰번호', width: 160 },
    { field: 'registerDate', headerName: '입사일', width: 200 },
];

const User = () => {
    // eslint-disable-next-line no-unused-vars
    const deviceMode = useContext(DeviceMode);

    const classes = UserStyle();
    const history = useHistory();
    const [selection, setSelection] = useState([]);
    const [registerDialog, setRegisterDialog] = useState(false); //등록 Dialog open 여부
    const [detailUserDialog, setDetailUserDialog] = useState(false); //유저 상세정보 Dialog open 여부
    const [userRow, setUserRow] = useState([]);
    const [search, setSearch] = useState({
        name: null,
        type: null,
        userId: null,
    });
    const [excelName, setExcelName] = useState('바텍 통근버스_사용자 정보');
    const [page, setPage] = useState(0);
    const [userData, setUserData] = useState({}); //유저 한명의 정보
    const [deleteDialog, setDeleteDialog] = useState(false); //유저 삭제 확인 Dialog open 여부

    const { handleSubmit, control } = useForm();

    const { loading, data, refetch } = useQuery(GET_USERS, {
        fetchPolicy: 'no-cache',
    });

    const searchClick = data => {
        setSearch({
            [data.select]: data.search,
        });
        setExcelName(`바텍 통근버스_사용자 정보_[${data.select}-${data.search}]`);
        setPage(0);
    };

    const handleCellClick = row => {
        setUserData(row);
        setDetailUserDialog(true);
    };

    useEffect(() => {
        refetch({
            name: search.name,
            type: search.type,
            userId: search.userId,
        });
    }, [search, refetch]);

    useEffect(() => {
        if (data) {
            const { data: userData, success, message } = data.getUsers;
            if (success) {
                let userDataChange = userData;
                userDataChange.forEach(user => {
                    user.id = user.userId;
                });
                setUserRow(userDataChange);
            } else {
                localStorage.clear();
                sessionStorage.clear();
                console.log(message);
                window.location.href = '/';
            }
        }
    }, [data, history]);

    return (
        <Box px={deviceMode ? 0 : 15} pt={2} minWidth={deviceMode ? null : '600px'}>
            <Box className={classes.mainBox} mb={1}>
                <Box maxWidth={deviceMode ? '270px' : null}>
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
                            <Box display="flex" alignItems="center">
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
                    <Box width="100%" minHeight={deviceMode ? null : '540px'} height="65vh">
                        <DataGrid
                            columns={columns.map(column => ({
                                ...column,
                                disableClickEventBubbling: true,
                            }))}
                            rows={userRow}
                            checkboxSelection
                            hideFooterSelectedRowCount
                            autoPageSize
                            onSelectionModelChange={newSelection => {
                                setSelection(newSelection.selectionModel);
                            }}
                            onCellClick={cellClick => {
                                const { field, row } = cellClick;
                                if (field !== '__check__') handleCellClick(row);
                            }}
                            onPageChange={params => setPage(params.page)}
                            page={page}
                            loading={loading}
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                            componentsProps={{
                                toolbar: {
                                    selection: selection,
                                    deleteUserClick: () => setDeleteDialog(true),
                                    userRow: userRow,
                                    excelName: excelName,
                                    refetch: refetch,
                                },
                            }}
                        />
                    </Box>
                </Paper>
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    className={classes.registerButton}
                    color="primary"
                    onClick={() => setRegisterDialog(true)}
                >
                    <Typography>사용자 등록</Typography>
                </Button>
            </Box>
            <RegisterDialog open={registerDialog} onClose={setRegisterDialog} refetch={refetch} />
            <DetailUserDialog
                open={detailUserDialog}
                onClose={setDetailUserDialog}
                userData={userData}
                refetch={refetch}
            />
            <DeleteUsersDialog
                open={deleteDialog}
                onClose={setDeleteDialog}
                setPage={setPage}
                setSelection={setSelection}
                refetch={refetch}
                selection={selection}
            />
        </Box>
    );
};

const CustomToolbar = props => {
    const { selection, deleteUserClick, userRow, excelName, refetch } = props;
    const classes = UserStyle();
    const [excelDialog, setExcelDialog] = useState(false); //엑셀 Dialog open 여부
    const deviceMode = useContext(DeviceMode);

    const s2ab = s => {
        const buf = new ArrayBuffer(s.length);
        const views = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            views[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
    };

    const downloadClick = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [['이름', '소속', '아이디(사원번호)', '휴대폰번호', '입사일']];
        userRow.forEach(row => {
            const content = [row.name, row.type, row.userId, row.phoneNumber, row.registerDate];
            wsData.push(content);
        });
        wb.Props = {
            Title: 'Vatech-Bus',
            Subject: 'Commuter bus',
            Author: 'Minsik Um',
            Manager: 'Manager',
            Company: 'Vatech',
            Keywords: 'Vatech',
            CreatedDate: new Date(),
        };

        wb.SheetNames.push('sheet 1');
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        wb.Sheets['sheet 1'] = ws;
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), excelName + '.xlsx');
    };

    return (
        <GridToolbarContainer className={classes.customToolBar}>
            <Box className={classes.searchBox}>
                <Box mr={deviceMode ? 0.5 : 2} display="flex" alignItems="center">
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        className={classes.buttonDelete}
                        disabled={selection.length === 0}
                        onClick={deleteUserClick}
                    >
                        <DeleteForever className={deviceMode ? classes.deleteIcon : null} />{' '}
                        <Typography className={deviceMode ? classes.deleteText : null}>
                            &nbsp;삭제
                        </Typography>
                    </Button>
                </Box>
                <Box>
                    <Typography className={deviceMode ? classes.deleteText : null}>
                        {selection.length}개 선택됨
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" alignItems="center">
                <Box mr={1}>
                    <Button
                        variant="outlined"
                        onClick={() => setExcelDialog(true)}
                        className={classes.excelButton}
                        size="small"
                    >
                        <ExcelUpload fontSize="small" />
                        <Typography className={deviceMode ? classes.deleteText : null}>
                            업로드
                        </Typography>
                    </Button>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        onClick={downloadClick}
                        className={classes.excelButton}
                        size="small"
                    >
                        <ExcelDownload fontSize="small" />
                        <Typography className={deviceMode ? classes.deleteText : null}>
                            다운로드
                        </Typography>
                    </Button>
                </Box>
            </Box>
            <ExcelDialog open={excelDialog} onClose={setExcelDialog} refetch={refetch} />
        </GridToolbarContainer>
    );
};

const DeleteUsersDialog = props => {
    const { open, onClose, selection, refetch, setSelection, setPage } = props;
    const classes = UserStyle();

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted() {
            refetch();
            handleClose();
        },
    });

    const handleClose = () => {
        onClose(false);
    };

    const deleteClick = () => {
        deleteUser({ variables: { userId: selection } });
        setSelection([]);
        setPage(0);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.warningTitle}>사용자 삭제</Typography>
                </Box>
                <Box mb={3}>
                    <Typography className={classes.warningText}>
                        선택한 <strong>{selection.length}명</strong>의 데이터가 사라집니다.
                        <br />
                        정말 삭제 하시겠습니까?
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Box mr={2} width="50%">
                        <Button
                            variant="contained"
                            onClick={deleteClick}
                            className={classes.resetButton}
                            fullWidth
                        >
                            삭제
                        </Button>
                    </Box>
                    <Box width="50%">
                        <Button
                            variant="contained"
                            onClick={() => onClose(false)}
                            className={classes.decideButton}
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

export default User;
