import React, { useState, useEffect } from 'react';
import {
    Dialog,
    Box,
    TextField,
    Button,
    IconButton,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import NoticeStyle from '../styles/NoticeStyle';
import * as dayjs from 'dayjs';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_ADMIN_NOTICE, DELETE_NOTICE } from '../gql/notice/mutation';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import editorConfiguration from './customTextEditor';

const DetailNotice = props => {
    const { open, onClose, noticeData, partitionKey, refetch } = props;
    const classes = NoticeStyle();
    const { handleSubmit, control, errors, setValue } = useForm();
    const [notice, setNotice] = useState({
        notice: '',
        createdAt: '',
        content: '',
    });

    const [updateAdminNotice] = useMutation(UPDATE_ADMIN_NOTICE, {
        onCompleted() {
            refetch();
        },
    });

    const [deleteNotice] = useMutation(DELETE_NOTICE, {
        onCompleted() {
            refetch();
        },
    });

    const handleClose = () => {
        onClose(false);
    };

    const reviseNoticeClick = data => {
        updateAdminNotice({
            variables: {
                partitionKey: partitionKey,
                notice: data.notice,
                content: data.content,
            },
        });
        handleClose();
    };

    const deleteNoticeClick = () => {
        deleteNotice({
            variables: {
                partitionKey: [partitionKey],
            },
        });
        handleClose();
    };

    useEffect(() => {
        if (noticeData) {
            const { success, message, data } = noticeData.getOneAdminNotice;
            if (success) {
                setNotice(data);
            } else console.log(message);
        }
    }, [noticeData]);

    if (!noticeData) return <React.Fragment></React.Fragment>;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton onClick={() => onClose(false)}>
                    <Cancel className={classes.iconStyle} />
                </IconButton>
            </Box>
            <Box px={6} pt={2} pb={4} overflow="auto">
                <form onSubmit={handleSubmit(reviseNoticeClick)}>
                    <Box height="80px" width="100%">
                        <Controller
                            as={TextField}
                            name="notice"
                            control={control}
                            defaultValue={notice.notice}
                            label="제목"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            rules={{ required: true }}
                            error={errors.notice ? true : false}
                            helperText={errors.notice ? '제목을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box height="80px" width="100%">
                        <Controller
                            as={TextField}
                            name="createdAt"
                            control={control}
                            defaultValue={dayjs(notice.createdAt).format('YYYY-MM-DD HH:mm')}
                            label="생성날짜"
                            fullWidth
                            variant="outlined"
                            size="medium"
                            disabled
                        />
                    </Box>

                    <Box width="100%" mb={3}>
                        <Controller
                            name="content"
                            defaultValue=""
                            control={control}
                            rules={{ required: true }}
                            render={() => (
                                <FormControl error={errors.content ? true : false}>
                                    <FormLabel>내용</FormLabel>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={notice.content}
                                        config={editorConfiguration}
                                        onReady={editor => {
                                            if (editor) {
                                                editor.ui.view.element.style.width = '504px';
                                                editor.editing.view.change(writer => {
                                                    writer.setStyle(
                                                        'height',
                                                        '350px',
                                                        editor.editing.view.document.getRoot(),
                                                    );
                                                    writer.setStyle(
                                                        'overflow',
                                                        'auto',
                                                        editor.editing.view.document.getRoot(),
                                                    );
                                                });
                                            }
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setValue('content', data);
                                        }}
                                    />
                                    <FormHelperText>
                                        {errors.content ? '내용을 입력해주세요.' : ' '}
                                    </FormHelperText>
                                </FormControl>
                            )}
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
                                onClick={deleteNoticeClick}
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
