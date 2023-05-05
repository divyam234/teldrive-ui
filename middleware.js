import { NextResponse } from 'next/server';

export const middleware = (req) => {

    const { nextUrl } = req;

    const pathname = nextUrl.pathname;

    if (pathname == '/') {
        return NextResponse.redirect('/my-drive');
    } else {
        return NextResponse.next();
    }

}
