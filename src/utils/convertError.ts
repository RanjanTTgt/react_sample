const errors = {
    'email.required': 'Email is required.',
    'email.invalid': 'Email is invalid.',
    'password.required': 'Password is required.',
    'currentPassword.required': 'Current Password is required.',
    'newPassword.required': 'New Password is required.',
    'newPassword.not_same': 'Current And New Password Should Not Be Same.',
    'newPassword.validation_failed': 'New Password must be at least 6 characters in length, one lowercase/uppercase letter, one digit and a special character(@$.!%*#?&).',
    'confirmPassword.required': 'Confirm Password is required.',
    'confirmPassword.not_matched': 'Confirm Password do not match.',
    'otp.required': 'OTP is required.',
    'firstName.required': 'First name is required.',
    'lastName.required': 'Last name is required.',
    'address.validationError': "Address length should be more than 5 characters and less than 250 characters",
    'phone.required': "Phone number is required.",
    'phone.validationError': "Invalid Phone Number.",
    'otp.expired': 'Otp has been expired.',
    'permission.denied': `You don't have permission.`,
};

export const convertError = (value: string) => {
    if (errors.hasOwnProperty(value)) {
        // tslint:disable-next-line:no-any
        return (errors as any)[value];
    }
    return value;
};