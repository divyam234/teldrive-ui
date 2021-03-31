import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import '../styles/global.css'
import createEmotionCache from '@/utils/createEmotionCache'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";
import { ThemeSchemeProvider, ThemeModeProvider } from "@bhunter179/react-material-you-theme";
import DriveThemeProvider from "@/components/DriveThemeProvider";

const ChonkywithStore = dynamic(() => import("@bhunter179/chonky")
    .then((mod) => mod.ChonkywithStore), {
    ssr: false,
    loading: () => <Loader />
});


const Auth = dynamic(() => import("@/components/Auth"), {
    ssr: false,
});


const RootLayout = dynamic(() => import("@/Layouts/RootLayout"), {
    ssr: false,
});

const clientSideEmotionCache = createEmotionCache()

function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}


const MyApp = (props) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
    const [queryClient] = React.useState(() => new QueryClient({
        defaultOptions: {
            suspense: true,
            queries: {
                cacheTime: 5 * 60 * 1000,
            },
        },
    }))


    const isMounted = useMounted();

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            {isMounted && (
                <QueryClientProvider client={queryClient}>
                    <ThemeModeProvider>
                        <ThemeSchemeProvider>
                            <DriveThemeProvider emotionCache={emotionCache}>
                                <ChonkywithStore>
                                        <RootLayout>
                                            {Component.auth ? (
                                                <Auth>
                                                    <Component {...pageProps} />
                                                </Auth>
                                            ) : (
                                                <Component {...pageProps} />
                                            )}
                                        </RootLayout>
                                </ChonkywithStore>
                            </DriveThemeProvider>
                        </ThemeSchemeProvider>
                    </ThemeModeProvider>
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </QueryClientProvider>

            )
            }
        </>
    )
}

export default MyApp