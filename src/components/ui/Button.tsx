import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary: 'bg-purple hover:bg-purple-light text-white',
  secondary: 'bg-[#f9fafe] dark:bg-[#252945] text-[#7e88c3] dark:text-[#dfe3fa] hover:bg-[#dfe3fa] dark:hover:bg-[#dfe3fa] dark:hover:text-[#0c0e16]',
  danger: 'bg-red hover:bg-red-light text-white',
  ghost: 'bg-transparent text-[#7e88c3] hover:text-[#0c0e16] dark:hover:text-white',
  dark: 'bg-[#373b53] hover:bg-[#0c0e16] dark:hover:bg-[#1e2139] text-[#888eb0]',
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center gap-2 px-6 py-4 rounded-full
          font-bold text-xs tracking-wide
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
