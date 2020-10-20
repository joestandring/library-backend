/*
 *  controllers/validation.js
 *  Validate incoming requests using the schema defined in schemas
*/

const { Validator, ValidationError } = require('jsonschema');
const userSchema = require('../schemas/user.schema.js');
const bookSchema = require('../schemas/book.schema.js');

// Validate a resource using the specified schema
const makeValidator = (schema, resource) => {
  const validator = new Validator();
  // Options used by Validator.validate
  const validationOptions = {
    throwError: true,
    propertyName: resource,
  };

  const handler = async (ctx, next) => {
    try {
      // Perform the validation on the request body
      validator.validate(ctx.request.body, schema, validationOptions);
      await next();
    } catch (error) {
      // If the input fails validation
      if (error instanceof ValidationError) {
        ctx.body = { message: error.stack };
        ctx.status = 400;
      } else {
        throw error;
      }
    }
  };
  return handler;
};

exports.validateUser = makeValidator(userSchema, 'user');
exports.validateBook = makeValidator(bookSchema, 'book');
