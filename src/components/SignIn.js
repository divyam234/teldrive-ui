import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useState, useEffect, useRef } from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, Checkbox, Box, TextField } from '@mui/material'
import http from "@/utils/http";
import { useSession } from "@/hooks/useAuth";
import { TelegramClient, Api, Logger } from "telegram";
import { StringSession } from "telegram/sessions";
import base64url from 'base64url'
import { LogLevel } from 'telegram/extensions/Logger'
import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import { getServerAddress } from "@/utils/common";
import { useRouter } from "next/router";
import TelegramIcon from "./TelegramIcon";
import QrCode from "./QRCode";

const apiCredentials = {
    apiId: Number(process.env.NEXT_PUBLIC_API_ID),
    apiHash: process.env.NEXT_PUBLIC_API_HASH
}

function getSession(session, user) {
    const dc_id = session.dcId;
    const auth_key = session.getAuthKey()?.getKey()?.toString('hex');

    return {
        dc_id, auth_key, tg_id: Number(user.id), bot: user.bot,
        username: user.username, name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        is_premium: user.premium
    }

}

async function postLogin(session, user, refetch, router) {
    let payload = getSession(session, user)
    let res = (await http.post('/api/auth/login', payload)).data
    await refetch()
    router.replace("/my-drive")
}

export default function SignIn() {

    const [isLoading, setLoading] = useState(false);

    const [formState, setFormState] = useState({
        phoneCodeHash: '',
        phoneCode: '',
        phoneNumber: '',
        remember: true
    })

    const { control, handleSubmit } = useForm({
        defaultValues: formState
    });

    const [step, setStep] = useState(0)

    const [loginType, setLoginType] = useState('qr')

    const [isConnected, setIsConnected] = useState(false)

    const [qrCode, setqrCode] = useState('')

    const { refetch } = useSession()

    const clientRef = useRef(null)

    const router = useRouter()

    async function onSubmit({ phoneNumber, remember, phoneCode }) {

        const client = clientRef.current

        if (step === 0) {
            setLoading(true);
            try {
                const { phoneCodeHash } = await client.sendCode(apiCredentials, phoneNumber);
                setFormState(prev => ({
                    ...prev, phoneCodeHash, phoneNumber, remember
                }))
                setStep(1)
            }
            catch (error) {
                //createToast(error.message, "error")
            }
            finally {
                setLoading(false)
            }
        }

        if (step === 1) {
            setLoading(true);
            try {
                let user = await client.invoke(
                    new Api.auth.SignIn({
                        phoneNumber: formState.phoneNumber,
                        phoneCodeHash: formState.phoneCodeHash,
                        phoneCode
                    })
                );
                await postLogin(client.session, user.user, refetch, router)
            }
            catch (error) {
            }
            finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (!clientRef.current) {
            const session = new StringSession('')
            const { id, ipAddress, port } = getServerAddress(5)
            session.setDC(id, ipAddress, port)
            clientRef.current = new TelegramClient(session,
                apiCredentials.apiId, apiCredentials.apiHash,
                {
                    baseLogger: new Logger(LogLevel.NONE),
                    deviceModel: 'Desktop',
                    systemVersion: 'Windows 10',
                    appVersion: '4.8.1 x64',
                    langCode: 'en-US',
                })
            clientRef.current.connect().then(() => setIsConnected(true))
        }
        return () => {
            clientRef.current?.destroy()
        }
    }, [])

    useEffect(() => {
        const client = clientRef.current
        async function loginWithQr() {
            const user = await client.signInUserWithQrCode(apiCredentials,
                {
                    onError: async function (p1) {
                        console.log("error", p1);
                        return true;
                    },
                    qrCode: async (code) => {
                        let qr = `tg://login?token=${base64url(code.token)}`
                        setqrCode(qr)
                    },
                    password: async (hint) => {
                        return "1111";
                    }
                }
            );
            await postLogin(client.session, user, refetch, router)
        }
        if (loginType === 'qr' && isConnected)
            loginWithQr()
    }, [loginType, refetch, router, isConnected])

    return (
        <Container component="main" maxWidth="sm">
            <Paper
                sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 6,
                    marginTop: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: '2rem'
                }}
            >
                <Typography component="h1" variant="h5">
                    {loginType == 'qr' ? 'Login By QR code' : 'Login By Phone Number '}
                </Typography>
                {loginType == 'phone' &&
                    <Box component="form" noValidate autoComplete="off"
                        onSubmit={!isLoading ? handleSubmit(onSubmit) : null}
                        sx={{ width: '90%', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                        <Grow in={true}>
                            <Box sx={{ width: 150, height: 150, position: 'relative', margin: 'auto' }}>
                                <TelegramIcon>
                                </TelegramIcon>
                            </Box>
                        </Grow>
                        {step === 0 &&
                            <>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    rules={{ validate: matchIsValidTel }}
                                    render={({ field, fieldState }) => (
                                        <MuiTelInput
                                            {...field}
                                            defaultCountry="IN"
                                            fullWidth
                                            required
                                            label="PhoneNo"
                                            helperText={fieldState.invalid ? "Tel is invalid" : ""}
                                            error={fieldState.invalid}
                                        />
                                    )}
                                />
                                <Controller
                                    name="remember"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={!!field.value}
                                            />}
                                            label="Keep me signed in"
                                        />
                                    )}
                                />
                            </>
                        }
                        {step === 1 &&
                            <>
                                <Controller
                                    name="phoneCode"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            error={!!error}
                                            type="text"
                                            label="PhoneCode"
                                            helperText={error ? error.message : ""}
                                        />
                                    )}
                                />
                            </>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="tonal"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading ? "Please Wait…" : step === 0 ? "Next" : "Login"}
                        </Button>

                        <Button
                            onClick={() => setLoginType('qr')}
                            fullWidth
                            variant="tonal"
                            sx={{ mb: 2 }}
                        >
                            Login By QR Code
                        </Button>
                    </Box>
                }

                {loginType == 'qr' &&
                    <Box sx={{ width: '90%', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                            height: 280, width: 280, margin: "0 auto",
                            maxWidth: 280, position: 'relative'
                        }}>
                            {qrCode ?
                                <QrCode qrCode={qrCode} />
                                :
                                <Box sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginRight: "-50%",
                                    transform: "translate(-50%,-50%)"
                                }}>
                                    <CircularProgress />
                                </Box>
                            }
                        </Box>

                        <Button
                            onClick={() => setLoginType('phone')}
                            fullWidth
                            variant="tonal"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login By Phone Number
                        </Button>
                    </Box>
                }

            </Paper>
        </Container>
    );
}