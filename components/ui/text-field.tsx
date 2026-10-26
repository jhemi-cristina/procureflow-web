import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import styles from "./text-field.module.css";

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  size?: "md" | "lg";
}

type TextFieldProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    ref?: Ref<HTMLInputElement>;
  };

type TextAreaFieldProps = Omit<BaseFieldProps, "icon" | "size"> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: Ref<HTMLTextAreaElement>;
  };

function FieldShell({
  id,
  label,
  error,
  hint,
  icon,
  trailing,
  size = "md",
  children,
}: BaseFieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.control} ${styles[size]} ${error ? styles.invalid : ""}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={styles.hint}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  label,
  error,
  hint,
  icon,
  trailing,
  size,
  id,
  ref,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      icon={icon}
      trailing={trailing}
      size={size}
    >
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(inputId, error, hint)}
        {...props}
      />
    </FieldShell>
  );
}

export function TextAreaField({ label, error, hint, id, ref, rows = 4, ...props }: TextAreaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FieldShell id={inputId} label={label} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(inputId, error, hint)}
        {...props}
      />
    </FieldShell>
  );
}
