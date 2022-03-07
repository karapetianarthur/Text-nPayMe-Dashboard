import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import FormHelperText from '@mui/material/FormHelperText';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useForm, Controller } from 'react-hook-form';
import axios from "axios";

import { auth } from '../firebase';

import './signup.scss';
import CountDown from "./Countdown";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = ({ handleClose }) => {
    const { handleSubmit, control, setValue } = useForm();
    const [notif, setNotif] = useState({
        open: false,
        message: null,
        type: 'success'
    });

    const [otp, setOtp] = useState(null);

    const [mainState, setMainState] = useState({
        showPassword: false,
        showConfirmPassword: false,
        shouldConfirmNumber: false,
        shouldConfirmCode: false,
        phoneNumber: null,
        phoneNumberDisabled: false,
        uid: null
    })

    const { showPassword, showConfirmPassword, shouldConfirmNumber, shouldConfirmCode, phoneNumber, phoneNumberDisabled, uid } = mainState;

    const onSubmit = data => {
        console.log(data, 'data');

        // createUserWithEmailAndPassword(auth, data.email, data.password)
        //     .then((result) => {
        //         console.log(result)
        //     }).catch((err) => {
        //         console.log(err, 'err')
        //     })

        const bodyData = new FormData();

        bodyData.append("password", data.password);
        bodyData.append("phone", `${data.phoneNumber.includes('+') ? data.phoneNumber : `+${data.phoneNumber}`}`);
        bodyData.append("email", data.email);
        bodyData.append("name", `${data.firstName} ${data.lastName}`);
        bodyData.append("firebase_id", uid);

        const config = {
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}users`,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data : bodyData
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setNotif({
                    open: true,
                    message: 'User created',
                    type: 'success'
                });
            })
            .catch(function (error) {
                console.log(error, 'error');
                setNotif({
                    open: true,
                    message: 'Something went wrong',
                    type: 'error'
                });
            });
    };

    const handleGenerateReCAPTCHA = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        }, auth);
    }

    const handleSendConfirmCode = (event) => {
        event.preventDefault();
        handleGenerateReCAPTCHA();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, `+${phoneNumber}`, appVerifier)
            .then(result => {
                // console.log('reslut', result)
                window.confirmationResult = result
                setMainState({
                    ...mainState,
                    shouldConfirmCode: true,
                    shouldConfirmNumber: false,
                    phoneNumberDisabled: true,
                    uid: result.uid
                })
            }).catch(err => {
            console.log(err, 'err')
        })
    };

    const handleOtpVerify = () => {
        if (otp && otp.length === 6) {
            console.log(otp)
            // verify OTP
            let confirmationResult = window.confirmationResult
            confirmationResult.confirm(otp).then((result) => {
                const user = result.user;
                console.log(user, 'user')
                setMainState({
                    ...mainState,
                    shouldConfirmCode: false,
                    shouldConfirmNumber: false,
                    phoneNumberDisabled: true,
                })

                setNotif({
                    type: 'success',
                    message: 'Phone number verified!',
                    open: true
                })


            }).catch((error) => {
                // console.log(error, 'error')
                setNotif({
                    type: 'error',
                    message: 'Code dose not match!',
                    open: true
                })
            })
        }
    }

    return (
        <>
            <Snackbar open={notif.open} autoHideDuration={6000} onClose={() => setNotif({
                ...notif,
                open: false
            })}>
                <Alert onClose={() => setNotif({
                    ...notif,
                    open: false
                })} severity={notif.type} sx={{ width: '100%' }}>
                    {notif.message}
                </Alert>
            </Snackbar>
            <form className={"Signup-form-container"} onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                        label="First Name"
                        variant="standard"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                )}
                rules={{ required: 'First name required' }}
            />
            <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                        label="Last Name"
                        variant="standard"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                )}
                rules={{ required: 'Last name required' }}
            />
            <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                        label="Email"
                        variant="standard"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        type="email"
                    />
                )}
                rules={{ required: 'Email required' }}
            />
            <Controller
                name="birthDate"
                control={control}
                defaultValue="2017-05-24"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                        label="Birth date"
                        variant="standard"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}
                rules={{ required: 'Birth date required' }}
            />

            <Controller
                name="gender"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={value}
                            onChange={onChange}
                            label="Age"
                            name="gender"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'male'}>Male</MenuItem>
                            <MenuItem value={'female'}>Female</MenuItem>
                            <MenuItem value={'other'}>Other</MenuItem>
                        </Select>
                    </FormControl>
                )}
            />

            <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input
                        label="Password"
                        variant="standard"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        setMainState({
                                            ...mainState,
                                            showPassword: !showPassword
                                        })
                                    }}
                                    // onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )}
                rules={{ required: 'Password required' }}
            />
            <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input
                        name="confirmPassword"
                        label="Confirm password"
                        variant="standard"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        setMainState({
                                            ...mainState,
                                            showConfirmPassword: !showConfirmPassword
                                        })
                                    }}
                                    // onMouseDown={handleMouseDownPassword}
                                >
                                    {showConfirmPassword? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )}
                rules={{ required: 'Confirm password required' }}
            />
            <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                        className={"mobile-phone-number"}
                        label="Mobile phone number"
                        variant="standard"
                        value={value}
                        disabled={phoneNumberDisabled}
                        onChange={(event) => {
                            console.log(event, 'event')
                            if (event.target.value.length > 8) {
                                setMainState({
                                    shouldConfirmNumber: true,
                                    phoneNumber: event.target.value
                                });
                            } else {
                                setMainState({
                                    shouldConfirmNumber: false,
                                    phoneNumber: event.target.value
                                })
                            }
                            onChange(event)
                        }}
                        error={!!error}
                        helperText={error ? error.message : null}
                        type="number"
                    />
                )}
                rules={{ required: 'Mobile phone number required' }}
            />
            {
                phoneNumberDisabled && (
                    <Button
                        fullWidth={true}
                        variant="text"
                        className={'change-phone-number-btn'}
                        onClick={() => {
                            setMainState({
                                ...mainState,
                                phoneNumberDisabled: !phoneNumberDisabled
                            });
                        }}
                    >
                        Change the phone number
                    </Button>
                )
            }

            {
                shouldConfirmNumber && (
                    <Button type="button" variant="contained" className="form-btn-confirm" onClick={handleSendConfirmCode}>
                        Confirm number
                    </Button>
                )
            }

            {
                shouldConfirmCode && (
                    <>
                        <p id="standard-head-helper-text">Sending verification code to your number.</p>
                        <FormControl variant="standard">
                            <FormHelperText id="standard-content-helper-text">Enter the code from the SMS</FormHelperText>
                            <Input
                                name={'otp'}
                                id="standard-adornment-weight"
                                value={otp}
                                onChange={(event) => {
                                    setOtp(event.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <CountDown />
                                    </InputAdornment>
                                }
                                aria-describedby="standard-weight-helper-text"
                                inputProps={{
                                    'aria-label': 'weight',
                                }}
                            />
                        </FormControl>
                    </>
                )
            }

            {
                shouldConfirmCode && (
                    <Button type="button" variant="contained" className="form-btn-confirm" onClick={handleOtpVerify}>
                        Confirm
                    </Button>
                )
            }
            <Button type="submit" variant="contained" className="form-btn" disabled={
                shouldConfirmNumber || (!shouldConfirmNumber && shouldConfirmCode)
            }>
                Signup
            </Button>
            <div id="recaptcha-container"></div>
        </form>
        </>
    );
};

export default Signup
