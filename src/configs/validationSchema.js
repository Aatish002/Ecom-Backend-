import joi from "joi";

export const registerValidationSchema = joi.object({
  userName: joi.string().min(3).max(25).required().messages({
    "string.base": "User name must be a string",
    "string.empty": "User name is required",
    "string.min": "User name must be 3 character long",
    "any.required": "User name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  phoneNo: joi.string().required().messages({
    "string.base": "Phone number must be a string",
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  }),
  password: joi
    .string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be atleast 8 character long",
      "string.pattern.base":
        "Password is too weak. Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).",
    }),
  profilePic: joi.string().uri().optional().messages({
    "string.uri": "Profile pic must be a valid URL",
  }),
  isAdmin: joi.boolean().optional(),
  refreshToken: joi.string().optional(),
});
