import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, useForm } from "react-hook-form";
import { FormControlLabel, Checkbox, Box, TextField } from '@mui/material'
import http from "@/utils/http";
import { useSession } from "@/hooks/useAuth";

export default function SignIn() {

    const [isLoading, setLoading] = useState(false);

    const router = useRouter();

    const [formState, setFormState] = useState({
        phone_code_hash: '',
        phone_code: '',
        phone_number: '',
        remember: false
    })

    const { control, handleSubmit } = useForm({
        defaultValues: formState
    });

    const [step, setStep] = useState(0)

    const { refetch } = useSession()

    async function onSubmit(data) {
        if (step === 0) {
            setLoading(true);
            try {
                let res = (await http.post('/api/auth/send_code', { "phone_number": data.phone_no })).data
                setFormState(prev => ({
                    ...prev, phone_code_hash: res.phone_code_hash,
                    phone_number: data.phone_number, remember: data.remember
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
                let res = (await http.post('/api/auth/login',
                    {
                        "phone_number": data.phone_no, "phone_code_hash":
                            formState.phone_code_hash, "phone_code": data.phone_code
                    })).data

                await refetch()
                router.replace("/my-drive")
            }
            catch (error) {
                //createToast(error.message, "error")
            }
            finally {
                setLoading(false)
            }
        }
    }

    //const isUser = !!session?.username;

    // useEffect(() => {
    //     if (loading) return;
    //     if (isUser) router.replace("/my-drive");
    // }, [isUser, router, loading]);


    // if (isUser || loading) return null

    return (
        <Container component="main" maxWidth="sm">
            <Paper
                sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 6,
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: '2rem'
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate autoComplete="off"
                    onSubmit={!isLoading ? handleSubmit(onSubmit) : null}
                    sx={{ width: '90%', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
                    {step === 0 &&
                        <>
                            <Controller
                                name="phone_no"
                                control={control}
                                rules={{ validate: matchIsValidTel }}
                                render={({ field, fieldState }) => (
                                    <MuiTelInput
                                        {...field}
                                        defaultCountry="IN"
                                        fullWidth
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
                                name="phone_code"
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
                </Box>
            </Paper>
        </Container>
    );
}