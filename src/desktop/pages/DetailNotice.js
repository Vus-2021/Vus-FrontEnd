import React from 'react';
import { Dialog, Box, TextField, Button, IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import NoticeStyle from '../styles/NoticeStyle';

const DetailNotice = props => {
    const { open, onClose, userId } = props;
    const classes = NoticeStyle();
    const { handleSubmit, control, errors } = useForm();

    const handleClose = () => {
        onClose(false);
    };

    const createNoticeClick = data => {
        console.log(data);
    };

    const deleteNotice = () => {
        console.log(userId);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton onClick={() => onClose(false)}>
                    <Cancel className={classes.iconStyle} />
                </IconButton>
            </Box>
            <Box px={6} pt={2} pb={4}>
                <form onSubmit={handleSubmit(createNoticeClick)}>
                    <Box height="100px" width="100%">
                        <Controller
                            as={TextField}
                            name="notice"
                            control={control}
                            defaultValue=""
                            label="제목"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            rules={{ required: true }}
                            error={errors.notice ? true : false}
                            helperText={errors.notice ? '제목을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box width="100%" mb={3}>
                        <Controller
                            as={TextField}
                            name="content"
                            control={control}
                            defaultValue=""
                            label="내용"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            rows={18}
                            multiline
                            rules={{ required: true }}
                            error={errors.content ? true : false}
                            helperText={errors.content ? '내용을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box height="40px" mb={2} display="flex" justifyContent="flex-end">
                        <Box mr={1}>
                            <Button
                                variant="contained"
                                type="submit"
                                size="medium"
                                className={classes.reviseButton}
                            >
                                수정
                            </Button>
                        </Box>
                        <Box mr={1}>
                            <Button
                                variant="contained"
                                type="button"
                                size="medium"
                                className={classes.deleteButton}
                                onClick={deleteNotice}
                            >
                                삭제
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

export default DetailNotice;
