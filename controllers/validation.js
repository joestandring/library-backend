/**
 * Validate incoming requests/responses using JSON schema
 * @module controllers/validation
 * @author Joe Standring
 * @see schemas/* for JSON schemas
 */

const { Validator, ValidationError } = require('jsonschema');
const userSchema = require('../schemas/user.json').definitions.user;
const bookSchema = require('../schemas/book.json');
const requestSchema = require('../schemas/request.json');

/**
 * Wrapper that returns a Koa middleware validator for a given schema
 * @param {object} schema The JSON schema definition of the resource
 * @param {string} resource The name of the resource e.g. 'book'
 * @returns {function} A Koa middleware handler taking (ctx, next) params
 */
const makeValidator = (schema, resource) => {
  const validator = new Validator();
  // Options used by Validator.validate
  const validationOptions = {
    throwError: true,
    propertyName: resource,
  };

  /**
   * Koa middleware handler function to perform validation
   * @param {object} ctx The Koa request/response context object
   * @param {function} next The Koa next callback
   * @throws {ValidationError} A jsonschema library exception
   */
  const handler = async (ctx, next) => {
    try {
      // Perform the validation on the request body
      validator.validate(ctx.request.body, schema, validationOptions);
      await next();
    } catch (error) {
      // If the input fails validation
      if (error instanceof ValidationError) {
        ctx.body = error;
        ctx.status = 400;
      } else {
        throw error;
      }
    }
  };
  return handler;
};

/** Validate data against user schema */
exports.validateUser = makeValidator(userSchema, 'user');
/** Validate data against book schema */
exports.validateBook = makeValidator(bookSchema, 'book');
/** Validate data against request schema */
exports.validateRequest = makeValidator(requestSchema, 'request');
