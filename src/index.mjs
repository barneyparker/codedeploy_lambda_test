const handler = async (event) => {

  console.log('event', JSON.stringify(event, null, 2))

  return {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  }
}