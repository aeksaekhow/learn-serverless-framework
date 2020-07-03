import AWS from 'aws-sdk'
import createError from 'http-errors'
import { getEndedAuctions } from '../libs/getEndedAuctions'
import { closeAuction } from '../libs/closeAuction'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export const handler = async (event, context) => {

    try {
        const endedAuctions = await getEndedAuctions()
        const closeAuctionPromises = endedAuctions.map(auction => closeAuction(auction))
        await Promise.all(closeAuctionPromises)

        return {closed: closeAuctionPromises.length}
    } 
    catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }
}