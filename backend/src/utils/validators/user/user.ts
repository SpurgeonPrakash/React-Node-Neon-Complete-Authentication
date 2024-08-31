import { User } from "../../../types/shared.types.js";

export const createUserValidator = (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
) => {
  const errors: User = {} as User;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!firstname || firstname.trim() === "") {
    errors.firstname = "firstname must not be empty";
  } else if (!nameRegex.test(firstname)) {
    errors.firstname = "Enter a valid firstname";
  }

  if (!lastname || lastname.trim() === "") {
    errors.lastname = "lastname must not be empty";
  } else if (!nameRegex.test(lastname)) {
    errors.lastname = "Enter a valid lastname";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email must not be empty";
  } else if (
    // eslint-disable-next-line no-useless-escape
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      email,
    )
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!password || password.trim() === "") {
    errors.password = "Password must not be empty";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/.test(
      password,
    )
  ) {
    errors.password = "Enter a valid password";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

type SignInErrors = {
  email: string;
  password: string;
};

export const signinUserValidator = (email: string, password: string) => {
  const errors: SignInErrors = {} as SignInErrors;
  if (!email || email.trim() === "") {
    errors.email = "Email must not be empty";
  } else if (
    // eslint-disable-next-line no-useless-escape
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      email,
    )
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!password || password.trim() === "") {
    errors.password = "Password must not be empty";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/.test(
      password,
    )
  ) {
    errors.password = "Enter a valid password";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export interface forgotPasswordErrors {
  email: string;
}

export const forgetPasswordValidator = (email: string) => {
  const errors: forgotPasswordErrors = {} as forgotPasswordErrors;
  if (!email || email.trim() === "") {
    errors.email = "Email must not be empty";
  } else if (
    // eslint-disable-next-line no-useless-escape
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      email,
    )
  ) {
    errors.email = "Enter a valid email address.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
