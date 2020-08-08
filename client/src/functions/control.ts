import { useState, useMemo } from 'react';
import { Result, Nothing, JustOk as Ok } from '../util/result';

export const useControlState = (validationFunction?: (value: string) => Result<string, Nothing>) => {
  const [value, setValue] = useState('');
  const [dirty, setDirty] = useState(false);

  const error = useMemo(() => {
    function validate(): Result<string, Nothing> {
      if (!validationFunction) return Ok();
      else return validationFunction(value);
    }

    const result = validate();
    return result.errOrElse('');
  }, [value, validationFunction]);

  

  const change = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value); 
  }

  const touch = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDirty(true);
  }

  const reset = () => {
    setValue('');
    setDirty(false);
  }

  return [{value, dirty, error, reset} as any,
    {change, touch} as any];
}