import form from '../../styles/form.module.scss';
import React from 'react';
import { FieldErrors } from 'react-hook-form';

export default function TextInput(
    {
        id,
        label,
        hookRef,
        errors,
    }: {
        id: string,
        label: string,
        hookRef: React.Ref<any>,
        errors: FieldErrors,
    }
) {
    const error = errors[id];

    return <>
        <label
            htmlFor={id}
            className={form.label}
        >
            {label}
        </label>
        <input
            id={id}
            name={id}
            type='text'
            className={`${form.textInput} ${error ? form.textInputError : ''}`}
            ref={hookRef}
        />

        {error && <p
            className={form.error}
        >
            {error.type === 'required' && 'This field is required.'}
            {error.type === 'pattern' && 'Oops... that doesn\'t look like a valid value.' }
        </p>}
    </>
}
