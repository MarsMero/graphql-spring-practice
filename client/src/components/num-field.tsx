import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

export const NumField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (props.onChange) {
      const newValue = event.target.value && stripValueOfNonDigits(event.target.value);
      const newEvent = {
        ...event,
        target: {
          ...event.target,
          value: newValue
        }
      };
      props.onChange(newEvent)
    }
  }
  return (
    <TextField {...props} onChange={handleChange}/>
  );
}

function stripValueOfNonDigits(value: string): string {
  value = value.replace(/[^0-9]*/g, '');
  if (value.startsWith('0')) {
    value = value.substring(1);
  }
  return value
}