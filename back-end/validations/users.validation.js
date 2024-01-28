import yup from 'yup'

const msg = {
  username: 'Not invalid! ^[a-zA-Z][a-zA-Z0-9_.]{0, 20}$',
  username_Required: 'Username is required!',
  phone_Min: 'The number of character in the phone must be more than 11 letter.',
  phone_Max: 'The number of character in the phone must be less than 15 letter.',
  phone_Required: 'Phone is required!',
  password_Min_Max: 'The number of character in the password must be minimum 8 and maximum 16 letter.',
  password_Required: 'Password is required!',
}

const SignInValidation = yup.object({
  // username: yup.string()
  //   .matches(/^[a-zA-Z][a-zA-Z0-9_.]{0,20}$/i, msg.username)
  //   .required(msg.username_Required),
  // phone: yup.string()
  //   .min(11, msg.phone_Min)
  //   .max(15, msg.phone_Max)
  //   .required(msg.phone_Required),
  password: yup.string()
    .min(8, msg.password_Min_Max)
    .max(16, msg.password_Min_Max)
    .required(msg.password_Required)
})

const SingUpValidation = yup.object({
  username: yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9_.]{0,20}$/i, msg.username)
    .required(msg.username_Required),
  password: yup.string()
    .min(8, msg.password_Min_Max)
    .max(16, msg.password_Min_Max)
    .required(msg.password_Required),
  phone: yup.string()
    .min(11, msg.phone_Min)
    .max(15, msg.phone_Max)
    .required(msg.phone_Required)
})

export {
  SignInValidation,
  SingUpValidation
}