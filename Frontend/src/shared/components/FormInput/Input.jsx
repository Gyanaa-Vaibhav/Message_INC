import React, { forwardRef } from "react";
import "./Input.css";

/**
 * A reusable input component for forms with ref forwarding.
 *
 * @param {Object} props - Props for the Input component.
 * @param {string} props.type - The type of the input (e.g., "text", "email").
 * @param {string} props.id - The id of the input for accessibility.
 * @param {string} props.name - The name of the input field.
 * @param {string} props.placeholder - Placeholder text for the input.
 * @param {string} [props.autoComplete] - Optional autocomplete attribute.
 * @param {boolean} [props.required] - Optional flag to mark the input as required.
 * @param {React.Ref} [ref] - Optional ref for the input field.
 *
 * @returns {JSX.Element} The Input component.
 */
const Input = forwardRef((props, ref) => {
    const { type, id, name, placeholder, autoComplete, required,value } = props;
    const nameFiled =  (name.split('_')).map(e=>e.charAt(0).toUpperCase() + e.slice(1)).join(' ')

    return (
        <>
            <label htmlFor={name}>
                {nameFiled}:
            </label>
            <input
                ref={ref}
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                value={value}
            />
        </>
    );
});

export default Input;
