import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, icon, type = 'button', ...props },
    ref,
  ) {
    return (
      <button
        aria-label={label}
        className="ui-icon-button"
        ref={ref}
        type={type}
        {...props}
      >
        {icon}
      </button>
    )
  },
)
