// 已弃用：使用 /api/document/analyze-with-ai 代替
// 该路由已被AI驱动的分析端点替代

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "此端点已弃用，请使用 /api/document/analyze-with-ai",
    },
    { status: 410 }
  );
}
