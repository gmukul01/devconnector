const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name.toString() : "";
  data.email = !isEmpty(data.email) ? data.email.toString() : "";
  data.password = !isEmpty(data.password) ? data.password.toString() : "";
  data.password2 = !isEmpty(data.password2) ? data.password2.toString() : "";

  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  } else if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    console.log(data.email, validator.isEmail(data.email));
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  } else if (!validator.equals(data.password, data.password2)) {
    errors.password = "Password and Confirm passport should match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
