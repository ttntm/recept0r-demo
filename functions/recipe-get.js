const faunadb = require('faunadb');

function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const id = getId(event.path)
  console.log(`Function 'recipe-get' invoked. Read id: ${id}`)
  return client.query(q.Get(q.Ref(`collections/recipes/${id}`)))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {
    console.log("error", error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}