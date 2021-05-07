import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    InputAdornment,
    FormControl,
    MenuItem,
    Select,
    Paper,
    Dialog,
} from '@material-ui/core';
import { DataGrid, GridToolbarContainer } from '@material-ui/data-grid';
import { DeleteForever, Search } from '@material-ui/icons';
import NoticeStyle from '../styles/NoticeStyle';
import { useForm, Controller } from 'react-hook-form';
import CreateNoticeDialog from './CreateNotice';
import DetailNoticeDialog from './DetailNotice';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_ADMIN_NOTICE, GET_ONE_ADMIN_NOTICE } from '../gql/notice/query';
import { DELETE_NOTICE } from '../gql/notice/mutation';
import * as dayjs from 'dayjs';
import { DeviceMode } from '../../App';

const Notice = () => {
    const classes = NoticeStyle();
    const deviceMode = useContext(DeviceMode);

    const columns = [
        { field: 'notice', headerName: '제목', width: deviceMode ? 180 : 250 },
        { field: 'author', headerName: '작성자', width: 100 },
        { field: 'userId', headerName: '아이디', width: 130 },
        { field: 'createdAt', headerName: '생성날짜', width: 120 },
        { field: 'updatedAt', headerName: '수정날짜', width: 120 },
    ];

    const [selection, setSelection] = useState([]); //선택한 공지글들의 partitionKey를 담음.
    const [noticeDialog, setNoticeDialog] = useState(false); //noticeDialog의 open 여부
    const [detailDialog, setDetailDialog] = useState(false); //detailDialog의 open 여부
    const [deleteDialog, setDeleteDialog] = useState(false); //deleteDialog의 open 여부
    const [noticeRows, setNoticeRows] = useState([]); //공지글 항목
    const [partitionKey, setPartitionKey] = useState(''); //공지글 partitionKey
    const [search, setSearch] = useState({
        notice: null,
        author: null,
        content: null,
    });
    const [page, setPage] = useState(0);

    const { handleSubmit, control } = useForm();

    const { data, loading, refetch } = useQuery(GET_ADMIN_NOTICE);

    const [getOneAdminNotice, { data: oneNoticeData }] = useLazyQuery(GET_ONE_ADMIN_NOTICE, {
        fetchPolicy: 'no-cache',
    });

    const searchClick = data => {
        setPage(0);
        setSearch({
            [data.select]: data.search,
        });
    };

    const handleCellClick = pk => {
        getOneAdminNotice({ variables: { partitionKey: pk } });
        setDetailDialog(true);
        setPartitionKey(pk);
    };

    useEffect(() => {
        refetch({
            notice: search.notice,
            author: search.author,
            content: search.content,
        });
    }, [search, refetch]);

    useEffect(() => {
        if (data) {
            const { success, message, data: noticeData } = data.getAdminNotice;
            if (success) {
                let noticeDataChange = noticeData;
                noticeDataChange.forEach(notice => {
                    notice.id = notice.partitionKey;
                    notice.createdAt = dayjs(notice.createdAt).format('YYYY-MM-DD');
                    notice.updatedAt = dayjs(notice.updatedAt).format('YYYY-MM-DD');
                });
                setNoticeRows(noticeDataChange);
            } else {
                console.log(message);
            }
        }
    }, [data]);

    return (
        <Box px={deviceMode ? 0 : 15} pt={2} minWidth={deviceMode ? null : '600px'}>
            <Box mb={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
                <Box maxWidth={deviceMode ? '270px' : null}>
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
                                                    defaultValue="notice"
                                                    render={props => (
                                                        <FormControl variant="standard">
                                                            <Select
                                                                defaultValue="notice"
                                                                onChange={e =>
                                                                    props.onChange(e.target.value)
                                                                }
                                                                disableUnderline
                                                            >
                                                                <MenuItem value="notice">
                                                                    제목
                                                                </MenuItem>
                                                                <MenuItem value="author">
                                                                    작성자
                                                                </MenuItem>
                                                                <MenuItem value="content">
                                                                    내용
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
                            rows={noticeRows}
                            checkboxSelection
                            hideFooterSelectedRowCount
                            autoPageSize
                            onSelectionModelChange={newSelection => {
                                setSelection(newSelection.selectionModel);
                            }}
                            onCellClick={cellClick => {
                                const { field, id } = cellClick;
                                if (field !== '__check__') handleCellClick(id);
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
                                    deleteNoticeClick: () => setDeleteDialog(true),
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
                    onClick={() => setNoticeDialog(true)}
                >
                    <Typography>공지 생성</Typography>
                </Button>
            </Box>
            <CreateNoticeDialog open={noticeDialog} onClose={setNoticeDialog} refetch={refetch} />
            <DetailNoticeDialog
                open={detailDialog}
                onClose={setDetailDialog}
                noticeData={oneNoticeData}
                partitionKey={partitionKey}
                refetch={refetch}
            />
            <DeleteNoticeDialog
                open={deleteDialog}
                onClose={setDeleteDialog}
                selection={selection}
                setSelection={setSelection}
                setPage={setPage}
                refetch={refetch}
            />
        </Box>
    );
};

const CustomToolbar = props => {
    const { selection, deleteNoticeClick } = props;
    const classes = NoticeStyle();
    const deviceMode = useContext(DeviceMode);

    return (
        <GridToolbarContainer className={classes.customToolBar}>
            <Box display="flex" flexDirection="row" alignItems="center">
                <Box mr={deviceMode ? 0.5 : 2}>
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        className={classes.buttonDelete}
                        onClick={deleteNoticeClick}
                        disabled={selection.length === 0}
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
        </GridToolbarContainer>
    );
};

const DeleteNoticeDialog = props => {
    const { open, onClose, selection, setSelection, setPage, refetch } = props;
    const classes = NoticeStyle();

    const [deleteNotice, { data }] = useMutation(DELETE_NOTICE, {
        onCompleted() {
            setSelection([]);
            setPage(0);
            refetch();
            onClose(false);
        },
    });

    const handleClose = () => {
        onClose(false);
    };

    const deleteClick = () => {
        deleteNotice({ variables: { partitionKey: selection } });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.deleteNotice;
            console.log(success);
            console.log(message);
        }
    }, [data]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.warningTitle}>공지 삭제</Typography>
                </Box>
                <Box mb={3}>
                    <Typography className={classes.warningText}>
                        선택한 <strong>{selection.length}개</strong>의 공지가 사라집니다.
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

export default Notice;
