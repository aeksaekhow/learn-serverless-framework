import AWS from 'aws-sdk'
import {middyMiddleware} from '../libs/middyMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = middyMiddleware(async (event, context) => {

    const { id } = event.pathParameters
    const auction = await getAuctionById(id)

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    }
})

export const getAuctionById = async (id) => {
    let auction;
    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id }
        }).promise()
        auction = result.Item

    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }

    if (!auction) {
        throw new createError.NotFound(`Auction with "${id}" not found`)
    }

    return auction
}
