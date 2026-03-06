import { useInvoiceStore } from '../../store/useInvoiceStore'
import logo from '../../assets/logo.svg'
import iconSun from '../../assets/icon-sun.svg'
import iconMoon from '../../assets/icon-moon.svg'
import avatar from '../../assets/image-avatar.jpg'

export default function Sidebar() {
  const { theme, toggleTheme } = useInvoiceStore()

  return (
    <aside className="
      fixed z-50 flex flex-col justify-between
      top-0 left-0 right-0 h-[72px]
      lg:top-0 lg:left-0 lg:bottom-0 lg:right-auto lg:w-[103px] lg:h-screen lg:rounded-r-[20px]
      bg-[#373b53] dark:bg-[#1e2139]
      overflow-hidden
    ">
      {/* Logo */}
      <div className="
        relative flex items-center justify-center
        w-[72px] h-[72px] lg:w-[103px] lg:h-[103px]
        bg-purple rounded-r-[20px] overflow-hidden shrink-0
      ">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-purple-light rounded-tl-[20px]" />
        <img src={logo} alt="logo" className="relative z-10 w-8 h-8 lg:w-10 lg:h-10" />
      </div>

      {/* Bottom controls */}
      <div className="flex flex-row lg:flex-col items-center gap-6 p-6 lg:p-0 lg:pb-6">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 hover:opacity-80 transition-opacity"
        >
          <img
            src={theme === 'dark' ? iconSun : iconMoon}
            alt={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-5 h-5"
          />
        </button>

        <div className="w-px h-full lg:w-full lg:h-px bg-[#494e6e]" />

        <button className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple transition-all">
          <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
        </button>
      </div>
    </aside>
  )
}
