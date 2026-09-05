export interface FieldMessageProps {
  id?: string
  children: string
  tone?: 'error' | 'hint'
}

export function FieldMessage({
  id,
  children,
  tone = 'hint',
}: FieldMessageProps) {
  return (
    <small className={`field-message field-message--${tone}`} id={id}>
      {children}
    </small>
  )
}
