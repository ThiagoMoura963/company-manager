import { FormControl, TextInput } from '@primer/react';
import type { ComponentProps } from 'react';

type FormFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  error?: string;
};

export default function FormField({ label, error, ...props }: FormFieldProps) {
  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>

      <TextInput
        block
        validationStatus={error ? 'error' : undefined}
        {...props}
      />

      {error && (
        <FormControl.Validation variant="error">{error}</FormControl.Validation>
      )}
    </FormControl>
  );
}
