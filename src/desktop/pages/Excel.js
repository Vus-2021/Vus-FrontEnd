import React, { useState } from 'react';
import { Dialog, Button, Typography, Box } from '@material-ui/core';
import xlsx from 'xlsx';
import MiniHeader from '../layout/MiniHeader';
import ExcelStyle from '../styles/ExcelStyle';

const Excel = props => {
    const { open, onClose } = props;
    const classes = ExcelStyle();
    const [file, setFile] = useState(null);

    const handleClose = () => {
        setFile(null);
        onClose(false);
    };

    const excelToJSON = e => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = reader.result;
                const wb = xlsx.read(fileData, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = xlsx.utils.sheet_to_json(ws, { header: 1, raw: false });
                console.log(data[1]);
            };
            reader.readAsBinaryString(file);
        } else {
            alert('엑셀을 먼저 선택해주세요.');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader handleClose={handleClose} headerText="엑셀 업로드" />
            <Box p={4} display="flex" justifyContent="space-between">
                <Box width="80%" mr={2}>
                    <input
                        type="file"
                        accept="application/vnd.ms-excel, 
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        id="contained-button-file"
                        style={{ display: 'none' }}
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <label htmlFor="contained-button-file">
                        <Button
                            variant="outlined"
                            component="span"
                            className={classes.excelButton}
                            fullWidth
                        >
                            <Typography noWrap>{file ? file.name : '유저 엑셀 업로드'}</Typography>
                        </Button>
                    </label>
                </Box>
                <Box width="20%">
                    <Button onClick={excelToJSON} fullWidth className={classes.submitButton}>
                        확인
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default Excel;
