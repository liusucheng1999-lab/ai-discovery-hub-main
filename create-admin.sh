#!/bin/bash

echo "=== AI创客 - 创建管理员账号 ==="
echo ""

# 检查是否已存在管理员账号
echo "🔍 检查现有管理员账号..."

# 使用 Supabase CLI 检查（如果没有安装 CLI，则提示手动操作）
if command -v supabase &> /dev/null; then
    echo "✅ 找到 Supabase CLI"
    
    # 检查现有管理员
    ADMIN_COUNT=$(supabase db execute --sql "SELECT COUNT(*) as count FROM admin_roles WHERE is_admin = true;" 2>/dev/null | grep -o '[0-9]\+' | head -1)
    
    if [ "$ADMIN_COUNT" -gt 0 ]; then
        echo "⚠️  已存在 $ADMIN_COUNT 个管理员账号"
        echo "📋 现有管理员列表："
        supabase db execute --sql "SELECT u.email, r.created_at FROM auth.users u JOIN admin_roles r ON u.id = r.user_id WHERE r.is_admin = true;" 2>/dev/null
        echo ""
        echo "✅ 如需创建新管理员，请访问："
        echo "🔗 http://localhost:5173/setup-admin"
    else
        echo "❌ 未找到管理员账号"
        echo ""
        echo "🚀 正在创建默认管理员账号..."
        echo "📧 邮箱: admin@aimaker.com"
        echo "🔑 密码: admin123"
        echo ""
        echo "⚠️  请访问以下链接完成创建："
        echo "🔗 http://localhost:5173/setup-admin"
        echo ""
        echo "💡 或者在 Supabase 控制台手动创建："
        echo "1. 访问 https://supabase.com/dashboard"
        echo "2. 进入项目 → Authentication → Users"
        echo "3. 点击 'Add user' 创建账号"
        echo "4. 在 SQL Editor 中执行：INSERT INTO admin_roles (user_id, is_admin) VALUES ('用户ID', true);"
    fi
else
    echo "❌ 未找到 Supabase CLI"
    echo ""
    echo "🔧 手动创建管理员账号方法："
    echo ""
    echo "方法1：使用网页界面（推荐）"
    echo "🔗 访问: http://localhost:5173/setup-admin"
    echo "📧 输入邮箱和密码创建账号"
    echo "✉️  检查邮箱确认注册"
    echo ""
    echo "方法2：使用 Supabase 控制台"
    echo "1. 访问: https://supabase.com/dashboard"
    echo "2. 进入项目 → Authentication → Users"
    echo "3. 点击 'Add user' 创建账号"
    echo "4. 在 SQL Editor 中执行权限设置"
    echo ""
    echo "方法3：使用 SQL（需要先创建用户）"
    echo "INSERT INTO admin_roles (user_id, is_admin) VALUES ('用户ID', true);"
fi

echo ""
echo "🎯 创建完成后，使用以下地址登录："
echo "🔗 登录页面: http://localhost:5173/login"
echo "🛠️  管理后台: http://localhost:5173/admin"
echo "🔧 工具管理: http://localhost:5173/manage"
