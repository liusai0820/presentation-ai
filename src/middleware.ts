import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 开发模式：跳过所有认证检查
  
  // 从根路径重定向到 /presentation
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/presentation", request.url));
  }

  return NextResponse.next();
}

// 只拦截根路径进行重定向
export const config = {
  matcher: ["/"],
};
