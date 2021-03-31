import createEmotionServer from '@emotion/server/create-instance'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { Children } from 'react';
import createEmotionCache from '@/utils/createEmotionCache'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="//telegram.org/img/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/img/icons/icon32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/img/icons/icon16.png" />
                    <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="manifest" href="/manifest.json" />
                    <meta name="description" content="Tel Drive" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    /* eslint-disable */
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) =>
                <App emotionCache={cache} {...props} />,
        })
    /* eslint-enable */

    const initialProps = await Document.getInitialProps(ctx)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            // eslint-disable-next-line react/no-unknown-property
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ))

    return {
        ...initialProps,
        styles: [
            ...Children.toArray(initialProps.styles),
            ...emotionStyleTags,
        ],
    }
}