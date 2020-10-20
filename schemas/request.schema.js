module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id: '/request',
  title: 'Request',
  description: 'A user created request to borrow a book',
  type: 'object',
  properties: {
    message: {
      description: 'Message sent by user to the book owner when making a request',
      type: 'string',
    },
  },
};
