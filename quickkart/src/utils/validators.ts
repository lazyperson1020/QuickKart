import type { TranslationSchema } from '../localization/strings';

export function validateSignUp(
    name: string,
    contact: string,
    email: string,
    password: string,
    confirmPassword: string,
    t: TranslationSchema
) {
    const errors: any = {};
    if (!name) errors.name = t.validators.nameRequired;
    if (!contact) errors.contact = t.validators.contactRequired;
    if (!email.includes("@")) errors.email = t.validators.emailInvalid;
    if (password.length < 6) errors.password = t.validators.passwordMinLength;
    if (password !== confirmPassword) errors.confirmPassword = t.validators.passwordsDoNotMatch;
    return errors;
}

export function validateLogin(email: string, password: string, t: TranslationSchema){
    const errors: any = {};
    if(!email){
        errors.email = t.validators.emailRequired;
    }else if(!email.includes("@")){
        errors.email = t.validators.invalidEmail;
    }

    if(!password){
        errors.password = t.validators.passwordRequired;
    }
    else if (password.length < 6){
        errors.password = t.validators.passwordMinLength;
    }
    return errors;
}
