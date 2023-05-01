import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import '../styles/global.css'
import createEmotionCache from '@/utils/createEmotionCache'
import { ThemeSchemeProvider, ThemeModeProvider } from "@bhunter179/react-material-you-theme";
import DriveThemeProvider from "@/components/DriveThemeProvider";
import RootLayout from "@/Layouts/RootLayout";

const clientSideEmotionCache = createEmotionCache()


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

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <ThemeModeProvider>
                    <ThemeSchemeProvider>
                        <DriveThemeProvider emotionCache={emotionCache}>
                            <RootLayout>
                                <Component {...pageProps} />
                            </RootLayout>
                        </DriveThemeProvider>
                    </ThemeSchemeProvider>
                </ThemeModeProvider>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </>
    )
}

export default MyApp