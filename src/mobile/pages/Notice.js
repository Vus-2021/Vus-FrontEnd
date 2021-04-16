import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    Typography,
    Divider,
    CircularProgress,
} from '@material-ui/core';
import { Accordion, AccordionSummary, AccordionDetails } from '../components';
import { Search, ExpandMore } from '@material-ui/icons';
import Header2 from '../layout/Header2';
import NoticeStyle from '../styles/NoticeStyle';
import { Controller, useForm } from 'react-hook-form';
import { GET_ADMIN_NOTICE } from '../gql/notice/query';
import { useQuery } from '@apollo/react-hooks';
import { useHistory, useLocation } from 'react-router-dom';
import * as dayjs from 'dayjs';

const Notice = props => {
    const history = useHistory();
    const location = useLocation();
    const partitionKey = location.state ? location.state.partitionKey : '';

    const [notice, setNotice] = useState([]);
    const [search, setSearch] = useState({
        notice: '',
        author: '',
        content: '',
    });
    const [expanded, setExpanded] = useState(partitionKey);
    const classes = NoticeStyle();
    const { control, handleSubmit } = useForm();

    const { loading, data, refetch } = useQuery(GET_ADMIN_NOTICE, { fetchPolicy: 'no-cache' });

    const handleClose = () => {
        history.push('/');
    };

    const accordionChange = panel => (e, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const searchClick = data => {
        setSearch({
            [data.select]: data.search,
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: noticeData } = data.getAdminNotice;
            if (success) {
                setNotice(noticeData);
            } else console.log(message);
        }
    }, [data]);

    useEffect(() => {
        refetch({
            notice: search.notice,
            name: search.author,
            content: search.content,
        });
    }, [search, refetch]);

    return (
        <Box height="100%">
            <Header2 handleClose={handleClose} headerText="공지사항" />
            <Box px={3} py={2} height="90%">
                <Box mb={1} height="7%" minHeight="40px">
                    <form onSubmit={handleSubmit(data => searchClick(data))}>
                        <Box display="flex" flexDirection="row" justifyContent="center">
                            <Box width="85%" mr={1}>
                                <Controller
                                    name="search"
                                    control={control}
                                    as={TextField}
                                    placeholder="공지글 검색"
                                    defaultValue=""
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    color="secondary"
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
                                                                <MenuItem
                                                                    value="notice"
                                                                    classes={{
                                                                        root: classes.menuItem,
                                                                    }}
                                                                >
                                                                    제목
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="author"
                                                                    classes={{
                                                                        root: classes.menuItem,
                                                                    }}
                                                                >
                                                                    작성자
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="content"
                                                                    classes={{
                                                                        root: classes.menuItem,
                                                                    }}
                                                                >
                                                                    내용
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box width="15">
                                <Button
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
                <Box height="92%" overflow="auto" className={classes.noticeField}>
                    {loading ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="80%"
                        >
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : notice.length === 0 ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            검색 결과가 없습니다.
                        </Box>
                    ) : (
                        notice.map((data, index) => (
                            <Accordion
                                key={data.partitionKey}
                                square
                                expanded={expanded === data.partitionKey}
                                onChange={accordionChange(data.partitionKey)}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    style={{ backgroundColor: index % 2 === 1 && '#F0F0F0' }}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="flex-start"
                                        width="100%"
                                    >
                                        <Typography
                                            className={classes.noticeTitle}
                                            style={{
                                                fontWeight:
                                                    expanded === data.partitionKey ? 700 : 400,
                                            }}
                                        >
                                            {data.notice}
                                        </Typography>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="flex-end"
                                            width="100%"
                                        >
                                            <Typography className={classes.noticeCreatedAt}>
                                                작성일: {dayjs(data.createdAt).format('YYYY-MM-DD')}
                                            </Typography>
                                            <Typography className={classes.noticeAuthor}>
                                                작성자: {data.author}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="flex-start"
                                        width="100%"
                                    >
                                        <Box mb={2}>
                                            <Typography className={classes.noticeUpdatedAt}>
                                                수정일: {dayjs(data.updatedAt).format('YYYY-MM-DD')}
                                            </Typography>
                                            <Divider />
                                        </Box>
                                        <Box
                                            className="ck-content"
                                            dangerouslySetInnerHTML={{ __html: data.content }}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Notice;
