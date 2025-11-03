/** @type {import('tailwindcss').Config} */


module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
        // 确保所有状态颜色类名都被包含在构建中
        'bg-storing', 'bg-onsale', 'bg-waiting', 'bg-paid', 'bg-refunding', 'bg-insecrecy', 'bg-published',
        'bg-Storing', 'bg-OnSale', 'bg-Waiting', 'bg-Paid', 'bg-Refunding', 'bg-InSecrecy', 'bg-Published',
        'bg-status-storing', 'bg-status-onsale', 'bg-status-waiting', 'bg-status-delivered', 'bg-status-refunding', 
        'bg-status-completed', 'bg-status-published',
        
        // Paragraph 组件用到的类名
        'text-gray-1', 'text-gray-2', 'text-gray-3', 'text-gray-4', 'text-gray-5',
        'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
        'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
        'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
        'line-clamp-1', 'line-clamp-2', 'line-clamp-3', 'line-clamp-4', 'line-clamp-5', 'line-clamp-6',
        
        // CardProfile 组件状态颜色
        'bg-gray-500', 'text-white',
        
        // 响应式工具类
        'aspect-square', 'aspect-video', 'aspect-[3/4]',
        'w-40', 'w-44', 'w-48', 'sm:w-44', 'md:w-48',
        'lg:w-56', 'xl:w-64', 'lg:w-36', 'xl:w-40',
    ],
    theme: {
        extend: {
            screens: {
                'xl2': '900px', // 自定义断点：在 900px 时切换布局
            },
            fontFamily: {
                // blackops: ['', 'sans-serif'],
                hammersmith: ['Hammersmith One', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            colors: {
                // Shadcn/UI 系统颜色
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: 'var(--card)',
                'card-foreground': 'var(--card-foreground)',
                popover: 'var(--popover)',
                'popover-foreground': 'var(--popover-foreground)',
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                secondary: 'var(--secondary)',
                'secondary-foreground': 'var(--secondary-foreground)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
                accent: 'var(--accent)',
                'accent-foreground': 'var(--accent-foreground)',
                destructive: 'var(--destructive)',
                'destructive-foreground': 'var(--destructive-foreground)',
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                gradientBackground: 'var(--gradient-background)',

                // 业务状态颜色 - 来自 globals.css
                'status-storing': '#4db325',     // 存储中
                'status-onsale': '#b0b306',      // 销售中
                'status-waiting': '#e28b19',     // 等待中 
                'status-paid': '#c7480d',   // 已交付
                'status-refunding': '#bd0fb4',   // 退款中
                'status-insecrecy': '#5e0fdd',   // 已完成
                'status-published': '#3d63e0',   // 已发布
                
                // 功能性颜色
                success: '#52c41a',
                warning: '#faad14',
                error: '#ff4d4f',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                'xl': '1.25rem',
                '2xl': '2rem',
            },
            boxShadow: {
                'glow': '0 0 40px 0 rgba(0,255,128,0.2)',
            },
            backgroundImage: {
                // 来自 root.css 的渐变配置
                'gradient-border': 'linear-gradient(45deg, var(--color-active), var(--color-theme))',
                'gradient-button': 'linear-gradient(90deg, var(--color-active), var(--color-theme))',
                'gradient-bg': 'var(--gradient-background)',
            },
        },
    },
    darkMode: 'class',
    plugins: [],
}; 