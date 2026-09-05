import type { ButtonHTMLAttributes } from 'react'
import { classes } from '../../lib/classes'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={classes('ui-button', `ui-button--${variant}`, className)}
      type={type}
      {...props}
    />
  )
}
