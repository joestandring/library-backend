it('Testing to see if Jest works', () => {
  expect(1).not.toBe(2)
});

test('Jest should use the correct database', () => {
  expect(process.env.DB_DATABASE).toBe('test');
});
