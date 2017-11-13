# Notes API

## Config

*config.json* file contains:
- **port** - port number for server to be listening on
- **pageSize** - default page size for pagination

## Validation

For **POST** request both *title* and *message* fields must be set. This could have been left for **sequelize** to deal with; However, manual validation allows control over messages and error codes.

Default format is JSON. Alternatively JSONP must be used, it requires **format** query string set to *jsonp*, as well as, **callback** set.

Other formats requests will be returned with *Unsupported format* message

## Error codes:

*Error codes were not specified except 404.* Whereas, http status codes are useful, more descriptive codes would allow for easier debugging.

- 404 - note not found
- 'E001' - wrong page size
- 'E002' - wrong page number
- 'E011' - **title** field missing
- 'E012' - **message** field missing
- 'E021' - at least one of the **title** and **message** fields must be present
- 'E101' - unsupported format

## Running

To run use `yarn start` or `npm run start`. Alternatively, `node index.js` can be used.

## Testing

To run test use `yarn test` or `npm run test`

## DB

**sqlite3** is used as a database driver. **sequelize** is an ORM used. 
*./db.sqlite* is main database file, whereas *./test.sqlite* is used for testing.