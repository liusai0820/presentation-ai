import { redirect } from "next/navigation";

export default function Home() {
  // 直接重定向到演示文稿页面
  redirect("/presentation");
}
