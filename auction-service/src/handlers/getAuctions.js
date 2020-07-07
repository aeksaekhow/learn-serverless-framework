import AWS from 'aws-sdk'
import { useDefaultMiddyMiddlewares } from '../libs/useDefaultMiddyMiddlewares'
import createError from 'http-errors'
import validator from '@middy/validator'
import getAuctionsSchema from '../libs/schemas/getAuctionsSchema'

const dynamodb = new AWS.DynamoDB.DocumentClient()

const handlerFunc = async (event, context) => {

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
}

export const handler = useDefaultMiddyMiddlewares(handlerFunc).use(validator({inputSchema: getAuctionsSchema, ajvOptions: {useDefaults: true}}))
