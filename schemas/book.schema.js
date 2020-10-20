module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  id: '/book',
  title: 'Book',
  description: 'A user added book',
  type: 'object',
  properties: {
    isbn: {
      description: '13 digit International Standard Book Number of this edition of the book',
      type: 'string',
    },
    title: {
      description: 'The title of the book',
      type: 'string',
    },
    imgLink: {
      description: 'URI of an image representing the book',
      type: 'string',
      format: 'uri',
    },
    authorFirst: {
      description: 'The first name of the author',
      type: 'string',
    },
    authorLast: {
      description: 'The surname of the author',
      type: 'string',
    },
    genre: {
      description: 'The genre of the book',
      type: 'string',
    },
    publisher: {
      description: 'The publisher of this edition of the book',
      type: 'string',
    },
    publishYear: {
      description: 'The year this edition of the book was published',
      type: 'string',
      pattern: '[1-2][0-9][0-9][0-9]',
    },
  },
};
