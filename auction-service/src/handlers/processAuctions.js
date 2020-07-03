import AWS from 'aws-sdk'
import {getEndedAuctions} from '../libs/getEndedAuctions'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = async (event, context) => {

    const endedAuctions = await getEndedAuctions()    
    console.log('Ended auctions', endedAuctions)
}