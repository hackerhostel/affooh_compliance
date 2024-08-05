import * as yup from 'yup';

export const LoginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const ForgotPasswordSchema = yup.object({
  username: yup.string().required(),
})

export const RegisterSchema = yup.object({
  organization: yup.string().required('Organization is required'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});