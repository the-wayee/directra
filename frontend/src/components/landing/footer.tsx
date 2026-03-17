import Link from "next/link"

const footerLinks = {
  product: [
    { label: "功能", href: "#features" },
    { label: "定价", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "更新日志", href: "#" },
  ],
  resources: [
    { label: "使用指南", href: "#" },
    { label: "API 文档", href: "#" },
    { label: "视频教程", href: "#" },
    { label: "社区", href: "#" },
  ],
  company: [
    { label: "关于我们", href: "#" },
    { label: "博客", href: "#" },
    { label: "联系", href: "#" },
    { label: "加入团队", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 5-10 5V3z" fill="white" />
                </svg>
              </div>
              <span className="text-base font-semibold text-slate-900">Directra</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Agent Video Clip — 为视频创作者打造的 AI 创作与剪辑平台。
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-slate-900 mb-3 capitalize">
                {title === "product" ? "产品" : title === "resources" ? "资源" : "公司"}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Directra. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">隐私政策</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
