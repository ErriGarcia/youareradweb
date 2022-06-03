import { useEffect, useRef } from 'react'
import classNames from '@utils/classNames'
import { useField } from '@unform/core'

/* Input is a polymorphic component designed to work directly with our unform forms. We've explored several approaches to input and form components, with this approach both being the result of that exploration and simply not wanting to spend more time optimizing. With this current approach, the Input and its state are all managed by unform. Styling here may be better with a module.css approach, especially as much of the styling is the same.  */

interface Props {
  name: string
  label?: string
  variant: 'text' | 'textarea' | 'radio' | 'email' | 'number'
}
type InputProps = JSX.IntrinsicElements['input'] & Props

export default function Input({ name, label, ...props }: InputProps) {
  const inputRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)
  const { variant = 'text', ...rest } = props

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: (ref) => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

  if (variant === 'email') {
    return (
      <div className="relative group">
        {label && <label htmlFor={fieldName}>{label}</label>}
        <input
          id={fieldName}
          ref={inputRef}
          type="email"
          disabled={props.disabled}
          defaultValue={defaultValue}
          {...rest}
          className={classNames(
            error ? 'border-red-light' : '',
            'relative block w-full px-10 py-2 text-black transition-all duration-300 ease-in-out border-2 border-gray-light rounded-xl bg-secondary-light bg-opacity-10 focus-within:bg-white focus-within:shadow-sm hover:bg-white disabled:bg-gray-light disabled:bg-opacity-50 disabled:placeholder-transparent'
          )}
        />
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-0.5 left-2 h-7 w-7 translate-y-1/3 select-none text-gray-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        {error && <span className="text-red text-sm">{error}</span>}
      </div>
    )
  }

  return (
    <div className="relative group">
      {label && <label htmlFor={fieldName}>{label}</label>}
      <input
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        type="text"
        {...rest}
        className="relative block w-full px-10 py-2 text-black transition-all duration-300 ease-in-out border-2 border-gray-light rounded-xl bg-secondary-light bg-opacity-10 focus-within:bg-white focus-within:shadow-sm hover:bg-white disabled:bg-gray-light disabled:bg-opacity-50 disabled:placeholder-transparent"
      />
      {error && <span className="text-red text-sm">{error}</span>}
    </div>
  )
}