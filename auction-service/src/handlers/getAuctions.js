import AWS from 'aws-sdk'
import { middyMiddleware } from '../libs/middyMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = middyMiddleware(async (event, context) => {

    let status;
    if (event.queryStringParameters.status) {
        status = event.queryStringParameters.status
    }
    let auctions;

    try {
        let result;
        if (status) {
            result = await dynamodb.query({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                IndexName: 'statusAndEndDate',
                KeyConditionExpression: '#status = :status',
                ExpressionAttributeValues: {
                    ':status': status
                },
                ExpressionAttributeNames: {
                    '#status': 'status'
                }
            }).promise()
        }
        else {
            result = await dynamodb.scan({
                TableName: process.env.AUCTIONS_TABLE_NAME
            }).promise()
        }

        auctions = result.Items
    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    }
})
