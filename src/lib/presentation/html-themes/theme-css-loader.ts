/**
 * 服务器端CSS主题加载器
 * 只能在服务器端（API路由）使用
 */

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 获取自定义主题CSS内容
 * 只能在服务器端调用
 */
export function getCustomThemeCSS(themeName: string): string {
    try {
        const cssPath = join(process.cwd(), 'src/lib/presentation/html-themes', `${themeName}.css`);
        console.log(`📂 尝试读取CSS文件: ${cssPath}`);
        const css = readFileSync(cssPath, 'utf-8');
        console.log(`✅ CSS文件读取成功: ${css.length} 字符`);
        return css;
    } catch (error) {
        console.error(`❌ 读取主题 ${themeName} 失败:`, error);
        console.error(`   路径: ${join(process.cwd(), 'src/lib/presentation/html-themes', `${themeName}.css`)}`);
        return '';
    }
}

/**
 * 检查是否是自定义主题
 */
export function isCustomTheme(themeName: string): boolean {
    return ['mckinsey', 'bcg', 'bain'].includes(themeName);
}
