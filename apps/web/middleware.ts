import { NextResponse , NextRequest } from "next/server";

export default function middleware(request : NextRequest){

const token = request.cookies.get("user_token")?.value ;

const {pathname} = request.nextUrl ; 

if(!token && pathname.startsWith("/dashboard")){

    return NextResponse.redirect(new URL("/signin" , request.url));
};

if(!token && pathname.startsWith("/room")){
    
    return NextResponse.redirect(new URL("/signin" , request.url));

};

if(token && (pathname.startsWith("/signin") || pathname.startsWith("/signup"))){

return NextResponse.redirect(new URL("/dashboard" , request.url)) ;

};

return NextResponse.next() ;

}

export const config = {

     matcher: ["/dashboard/:path*", "/signin", "/signup" ,"/room/:path*"]

}