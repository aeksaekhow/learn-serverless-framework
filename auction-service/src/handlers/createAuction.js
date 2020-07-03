import {v4 as uuid} from 'uuid'
import AWS from 'aws-sdk'
import middyMiddleware from '../libs/middyMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createAuction(event, context) {

  const {title} = event.body
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0
    }
  }

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise()
  }
  catch (error) {
    console.error(error)
    throw new createError.InternalServerError(er)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  }
}

export const handler = middyMiddleware(createAuction)
