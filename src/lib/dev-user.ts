/**
 * 开发环境辅助函数
 * 用于在没有认证的情况下提供测试用户ID
 */

import { db } from "@/server/db";

let devUserId: string | null = null;

/**
 * 获取或创建开发测试用户
 */
export async function getDevUser(): Promise<{ id: string; email: string | null }> {
  // 如果已经缓存了用户ID,直接返回
  if (devUserId) {
    return { id: devUserId, email: "dev@test.com" };
  }

  try {
    // 尝试查找测试用户
    let user = await db.user.findUnique({
      where: { email: "dev@test.com" },
      select: { id: true, email: true },
    });

    // 如果不存在,创建测试用户
    if (!user) {
      user = await db.user.create({
        data: {
          email: "dev@test.com",
          name: "开发测试用户",
          hasAccess: true,
          role: "ADMIN",
        },
        select: { id: true, email: true },
      });
      console.log("✅ 已创建开发测试用户:", user.email);
    }

    devUserId = user.id;
    return user;
  } catch (error) {
    console.error("获取开发用户失败:", error);
    throw new Error("无法获取开发用户");
  }
}

/**
 * 获取用户ID (优先使用session,否则使用dev用户)
 */
export async function getUserIdOrDev(session: { user?: { id: string } } | null): Promise<string> {
  if (session?.user?.id) {
    return session.user.id;
  }
  
  const devUser = await getDevUser();
  return devUser.id;
}
