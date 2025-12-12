import React from 'react';

interface HeadlessFormProps<T> {
  initialValues?: T;
  onSubmit: (values: T) => void;
  children: (props: {
    values: T;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setFieldValue: (field: keyof T, value: any) => void;
  }) => React.ReactNode;
  className?: string;
}

export const HeadlessForm = <T extends Record<string, any>>({
  initialValues = {} as T,
  onSubmit,
  children,
  className,
}: HeadlessFormProps<T>) => {
  const [values, setValues] = React.useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children({ values, handleChange, handleSubmit, setFieldValue })}
    </form>
  );
};
