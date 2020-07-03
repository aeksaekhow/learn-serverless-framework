import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = async (event, context) => {

    console.log('Process auctions ' + new Date().toISOString())
}