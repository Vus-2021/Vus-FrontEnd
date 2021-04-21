import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    FormHelperText,
    Select,
    Typography,
} from '@material-ui/core';
import { GET_USERS, GET_ROUTES_INFO } from '../gql/route/query';
import {
    UPDATE_ROUTE,
    DELETE_ROUTE,
    UPDATE_DETAIL_ROUTE,
    CREATE_ROUTE_DETAIL,
    DELETE_DETAIL_ROUTE,
} from '../gql/route/mutation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useForm, Controller } from 'react-hook-form';
import MiniHeader from '../layout/MiniHeader';
import RouteStyle from '../styles/RouteStyle';
import fileUpload from '../components/FileUpload';

const UpdateRouteDialog = props => {
    const { open, onClose, routeName } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors, setError } = useForm();
    const [drivers, setDrivers] = useState([]);
    const [routeInfo, setRouteInfo] = useState({});
    const [imageName, setImageName] = useState('노선 이미지 업로드');
    const [changedImage, setChangedImage] = useState('');

    const { data } = useQuery(GET_USERS, {
        variables: { type: 'DRIVER' },
        fetchPolicy: 'no-cache',
    });
    const { data: routeData } = useQuery(GET_ROUTES_INFO, {
        variables: { route: routeName },
        fetchPolicy: 'no-cache',
    });
    const [updateRoute, { data: updateData }] = useMutation(UPDATE_ROUTE);

    const handleClose = () => {
        onClose(false);

        setChangedImage('');
        setImageName('노선 이미지 업로드');
    };

    const LimitCountHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '수용 인원을 입력해주세요.';
        if (type === 'isNumber') return '숫자만 입력해주세요.';
    };

    const updateClick = async data => {
        const driverData = data.driver.split('+');
        const fileLocation = changedImage !== '' ? await fileUpload(data.image) : null;
        updateRoute({
            variables: {
                partitionKey: routeInfo.partitionKey,
                route: data.route,
                busNumber: data.busNumber,
                limitCount: parseInt(data.limitCount),
                driver: { name: driverData[0], phone: driverData[1], userId: driverData[2] },
                imageUrl: fileLocation,
            },
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message, data: driverData } = data.getUsers;
            if (success) {
                setDrivers(driverData);
            } else {
                console.log(message);
            }
        }
    }, [data]);

    useEffect(() => {
        if (routeData) {
            const { success, message, data } = routeData.getRoutesInfo;
            if (success) {
                setRouteInfo(data[0]);
            } else console.log(message);
        }
    }, [routeData]);

    useEffect(() => {
        if (updateData) {
            const { success, message } = updateData.updateRoute;
            if (success) {
                onClose(false);
                window.location.href = '/admin';
            } else {
                setError('driver', { type: 'alreadyExist', message: message });
            }
        }
    }, [updateData, onClose, setError]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <MiniHeader handleClose={handleClose} headerText="노선 수정" />
            <Box p={4}>
                {routeInfo.driver && (
                    <form
                        onSubmit={handleSubmit(data => updateClick(data))}
                        encType="multipart/form-data"
                    >
                        <Box mb={2}>
                            <Controller
                                control={control}
                                as={TextField}
                                defaultValue={routeInfo.route}
                                name="route"
                                label="노선 이름"
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={errors.route ? true : false}
                                rules={{ required: true }}
                                helperText={errors.route ? '노선 이름을 입력해주세요.' : ' '}
                            />
                        </Box>
                        <Box mb={2}>
                            <Controller
                                control={control}
                                name="driver"
                                defaultValue={`${routeInfo.driver.name}+${routeInfo.driver.phone}+${routeInfo.driver.userId}`}
                                rules={{
                                    validate: {
                                        required: value => value !== '',
                                    },
                                }}
                                error={errors.driver ? true : false}
                                render={props => (
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        error={errors.driver ? true : false}
                                    >
                                        <InputLabel id="bus-driver-select">
                                            버스기사 배정
                                        </InputLabel>
                                        <Select
                                            labelId="bus-driver-select"
                                            label="버스기사 배정"
                                            defaultValue={`${routeInfo.driver.name}+${routeInfo.driver.phone}+${routeInfo.driver.userId}`}
                                            onChange={e => props.onChange(e.target.value)}
                                        >
                                            {drivers.map(driver => (
                                                <MenuItem
                                                    key={driver.userId}
                                                    value={`${driver.name}+${driver.phoneNumber}+${driver.userId}`}
                                                >
                                                    {driver.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.driver
                                                ? errors.driver.type === 'required'
                                                    ? '버스 기사를 선택해주세요.'
                                                    : errors.driver.message
                                                : ' '}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Box>
                        <Box mb={2}>
                            <Controller
                                control={control}
                                as={TextField}
                                defaultValue={routeInfo.busNumber}
                                name="busNumber"
                                label="차량번호"
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={errors.busNumber ? true : false}
                                rules={{ required: true }}
                                helperText={errors.busNumber ? '차량번호를 입력해주세요.' : ' '}
                            />
                        </Box>
                        <Box mb={2}>
                            <Controller
                                control={control}
                                as={TextField}
                                defaultValue={routeInfo.limitCount}
                                name="limitCount"
                                label="최대 수용인원"
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={errors.limitCount ? true : false}
                                rules={{
                                    required: true,
                                    validate: { isNumber: value => !isNaN(value) },
                                }}
                                helperText={
                                    errors.limitCount ? (
                                        <LimitCountHelperText errors={errors.limitCount} />
                                    ) : (
                                        ' '
                                    )
                                }
                            />
                        </Box>
                        <Box mb={2}>
                            <Controller
                                control={control}
                                defaultValue=""
                                name="image"
                                render={props => (
                                    <Box>
                                        <input
                                            accept="image/png, image/gif, image/jpeg"
                                            id="contained-button-file"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={e => {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                props.onChange(file);
                                                setImageName(file.name);
                                                reader.onloadend = () =>
                                                    setChangedImage(reader.result);
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                fullWidth
                                                className={classes.imageButton}
                                            >
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    alignItems="center"
                                                >
                                                    <Typography className={classes.imageText}>
                                                        {imageName}
                                                    </Typography>
                                                    <img
                                                        src={
                                                            changedImage === ''
                                                                ? routeInfo.imageUrl
                                                                : changedImage
                                                        }
                                                        width="140px"
                                                        alt="nothing"
                                                    />
                                                </Box>
                                            </Button>
                                        </label>
                                    </Box>
                                )}
                            />
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                type="submit"
                                className={classes.searchButton}
                                variant="contained"
                            >
                                노선 등록하기
                            </Button>
                        </Box>
                    </form>
                )}
            </Box>
        </Dialog>
    );
};

const DeleteRouteDialog = props => {
    const { open, onClose, partitionKey, routeName } = props;
    const classes = RouteStyle();

    const [deleteRoute, { data: deleteData }] = useMutation(DELETE_ROUTE);

    const deleteRouteClick = () => {
        deleteRoute({
            variables: {
                partitionKey: partitionKey,
            },
        });
    };

    useEffect(() => {
        if (deleteData) {
            const { success, message } = deleteData.deleteRoute;
            if (success) {
                window.location.href = '/admin';
            } else console.log(message);
        }
    }, [deleteData]);

    return (
        <Dialog open={open} onClose={() => onClose(false)} style={{ zIndex: 6000 }}>
            <Box px={3} py={2}>
                <Box mb={2}>
                    <Typography className={classes.deleteRouteTitle}>노선 삭제</Typography>
                </Box>
                <Box mb={3}>
                    <Typography>
                        정말로 <strong>{routeName}노선</strong>을 삭제하시겠습니까?
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Box mr={2} width="50%">
                        <Button
                            variant="contained"
                            onClick={deleteRouteClick}
                            fullWidth
                            className={classes.deleteButton}
                        >
                            삭제
                        </Button>
                    </Box>
                    <Box width="50%">
                        <Button
                            variant="contained"
                            onClick={() => onClose(false)}
                            fullWidth
                            className={classes.reviseButton}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

const CreateDialog = props => {
    const { open, onClose, routeName, latlng, refetch } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors } = useForm();

    const [imageName, setImageName] = useState('노선 이미지 업로드');
    const [imgPreview, setImgPreview] = useState('');

    const [createRouteDetail, { data }] = useMutation(CREATE_ROUTE_DETAIL, {
        onCompleted() {
            refetch();
        },
    });

    const handleClose = () => {
        onClose(false);
        setImgPreview('');
        setImageName('노선 이미지 업로드');
    };

    const BoardingTimeHelperText = props => {
        const { type } = props.errors;
        if (type === 'required') return '탑승시간을 입력해주세요.';
        if (type === 'isForm') return '형식에 맞게 입력해주세요.[예) 09:45]';
    };

    const createRoute = async data => {
        const fileLocation = imgPreview !== '' ? await fileUpload(data.image) : null;
        createRouteDetail({
            variables: {
                route: routeName,
                location: data.location,
                lat: latlng.lat,
                long: latlng.lng,
                boardingTime: data.boardingTime,
                imageUrl: fileLocation,
            },
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.createRouteDetail;
            if (success) {
                onClose(false);
                setImgPreview('');
                setImageName('노선 이미지 업로드');
            } else console.log(message);
        }
    }, [data, onClose]);

    return (
        <Dialog open={open} onClose={handleClose} style={{ zIndex: 6000 }}>
            <MiniHeader handleClose={handleClose} headerText="정류장 생성" />
            <Box p={4}>
                <form
                    onSubmit={handleSubmit(data => createRoute(data))}
                    encType="multipart/form-data"
                >
                    <Box mb={1}>
                        <Controller
                            control={control}
                            name="location"
                            defaultValue=""
                            as={TextField}
                            size="small"
                            fullWidth
                            rules={{
                                required: true,
                            }}
                            error={errors.location ? true : false}
                            label="정류장 이름"
                            variant="outlined"
                            helperText={errors.location ? '정류장 이름을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1}>
                        <Controller
                            control={control}
                            name="boardingTime"
                            defaultValue=""
                            as={TextField}
                            size="small"
                            rules={{
                                required: true,
                                validate: {
                                    isForm: value =>
                                        value.indexOf(':') !== -1 && value.length === 5,
                                },
                            }}
                            fullWidth
                            error={errors.boardingTime ? true : false}
                            label="탑승시간"
                            variant="outlined"
                            placeholder="HH:mm 형식으로 입력 [예) 09:45]"
                            helperText={
                                errors.boardingTime ? (
                                    <BoardingTimeHelperText errors={errors.boardingTime} />
                                ) : (
                                    ' '
                                )
                            }
                        />
                    </Box>
                    <Box mb={1}>
                        <Controller
                            control={control}
                            defaultValue=""
                            name="image"
                            rules={{
                                required: true,
                            }}
                            render={props => (
                                <Box>
                                    <input
                                        accept="image/png, image/gif, image/jpeg"
                                        id="contained-button-file"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            props.onChange(file);
                                            setImageName(file.name);
                                            reader.onloadend = () => setImgPreview(reader.result);
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            fullWidth
                                            className={
                                                errors.image
                                                    ? classes.errorButton
                                                    : classes.imageButton
                                            }
                                        >
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                            >
                                                <Typography className={classes.imageText}>
                                                    {errors.image
                                                        ? '이미지를 업로드해주세요'
                                                        : imageName}
                                                </Typography>
                                                {imgPreview !== '' && (
                                                    <img
                                                        src={imgPreview}
                                                        width="280px"
                                                        alt="nothing"
                                                    />
                                                )}
                                            </Box>
                                        </Button>
                                    </label>
                                </Box>
                            )}
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" className={classes.searchButton}>
                            정류장 등록
                        </Button>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

const UpdateDialog = props => {
    const { open, onClose, marker, route, refetch } = props;
    const classes = RouteStyle();
    const { control, handleSubmit, errors } = useForm();

    const [imageName, setImageName] = useState('노선 이미지 업로드');
    const [changedImage, setChangedImage] = useState('');

    const [updateDetailRoute, { data }] = useMutation(UPDATE_DETAIL_ROUTE, {
        onCompleted() {
            refetch();
        },
    });

    const [deleteDetailRoute, { data: deleteData }] = useMutation(DELETE_DETAIL_ROUTE, {
        onCompleted() {
            refetch();
        },
    });

    const handleClose = () => {
        onClose(false);
        setChangedImage('');
        setImageName('노선 이미지 업로드');
    };

    const deleteRouteClick = () => {
        deleteDetailRoute({
            variables: {
                partitionKey: route.partitionKey,
            },
        });
        marker.setMap(null);
    };

    const reviseRouteClick = async data => {
        const fileLocation = changedImage !== '' ? await fileUpload(data.image) : null;
        updateDetailRoute({
            variables: {
                partitionKey: route.partitionKey,
                lat: route.lat,
                long: route.long,
                route: route.route,
                boardingTime: data.boardingTime,
                location: data.location,
                imageUrl: fileLocation,
            },
        });
    };

    useEffect(() => {
        if (data) {
            const { success, message } = data.updateDetailRoute;
            if (success) {
                onClose(false);
            } else console.log(message);
        }
    }, [data, onClose]);

    useEffect(() => {
        if (deleteData) {
            const { success, message } = deleteData.deleteDetailRoute;
            if (success) {
                onClose(false);
            } else console.log(message);
        }
    }, [deleteData, onClose]);

    return (
        <Dialog open={open} onClose={handleClose} style={{ zIndex: 6000 }}>
            <MiniHeader handleClose={handleClose} headerText="정류장 수정/삭제" />
            <Box p={4}>
                <form onSubmit={handleSubmit(data => reviseRouteClick(data))}>
                    <Box mb={1} width="100%">
                        <Controller
                            name="location"
                            control={control}
                            defaultValue={route.location}
                            as={TextField}
                            size="small"
                            fullWidth
                            label="정류장 이름"
                            variant="outlined"
                            rules={{ required: true }}
                            error={errors.location ? true : false}
                            helperText={errors.location ? '정류장 이름을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1} width="100%">
                        <Controller
                            name="boardingTime"
                            control={control}
                            defaultValue={route.boardingTime}
                            as={TextField}
                            size="small"
                            fullWidth
                            label="탑승시간"
                            variant="outlined"
                            rules={{ required: true }}
                            error={errors.boardingTime ? true : false}
                            helperText={errors.boardingTime ? '시간을 입력해주세요.' : ' '}
                        />
                    </Box>
                    <Box mb={1} width="100%">
                        <Controller
                            control={control}
                            defaultValue=""
                            name="image"
                            render={props => (
                                <Box>
                                    <input
                                        accept="image/png, image/gif, image/jpeg"
                                        id="contained-button-file"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            const reader = new FileReader();
                                            props.onChange(file);
                                            setImageName(file.name);
                                            reader.onloadend = () => setChangedImage(reader.result);
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            fullWidth
                                            className={classes.imageButton}
                                        >
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                            >
                                                <Typography className={classes.imageText}>
                                                    {imageName}
                                                </Typography>
                                                <img
                                                    src={
                                                        changedImage === ''
                                                            ? route.imageUrl
                                                            : changedImage
                                                    }
                                                    width="280px"
                                                    alt="nothing"
                                                />
                                            </Box>
                                        </Button>
                                    </label>
                                </Box>
                            )}
                        />
                    </Box>
                    <Box display="flex" justifyContent="flex-end">
                        <Box mr={1}>
                            <Button
                                type="submit"
                                variant="contained"
                                className={classes.reviseButton}
                            >
                                정류장 수정
                            </Button>
                        </Box>
                        <Box>
                            <Button
                                type="button"
                                variant="contained"
                                className={classes.deleteButton}
                                onClick={deleteRouteClick}
                            >
                                정류장 삭제
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

export { UpdateDialog, CreateDialog, UpdateRouteDialog, DeleteRouteDialog };
