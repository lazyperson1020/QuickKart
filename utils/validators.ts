export function validateSignUp(
    name: string,
    contact: string,
    email: string,
    password: string,
    confirmPassword: string
) {
    const errors: any = {};
    if (!name) errors.name = "Name is required";
    if (!contact) errors.contact = "Contact is required";
    if (!email.includes("@")) errors.email = "Email is invalid";
    if (password.length < 6) errors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
}

export function validateLogin(email: string, password: string){
    const errors: any = {};
    if(!email){
        errors.email = "Email is required";
    }else if(!email.includes("@")){
        errors.email = "Invalid email";
    }

    if(!password){
        errors.password = "Password is required";
    }
    else if (password.length < 6){
        errors.password = "Password must be at least 6 characters";
    }
    return errors;
}