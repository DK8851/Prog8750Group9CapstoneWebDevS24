import { RESPONSE } from "./constant"

const { HttpStatusCode } = require("axios")
const { NextResponse } = require("next/server")

class Utils {
    static throwError = (code = HttpStatusCode.BadGateway, errorType, errorMessage) => (error) => {
        if (!error) error = new Error(errorMessage || 'Default Error')

        error.code = code
        error.errorType = errorType

        throw error
    }

    static sendSuccess = (response) => {
        return NextResponse.json(
            {
                response: (response || {}),
                message: 'Data Fetched!',
                type: RESPONSE.SUCCESS
            },
            { status: HttpStatusCode.Created },
        );
    }

    static sendError = (message = '') => (error) => {
        const data = {
            type: RESPONSE.ERROR,
            message,
            response: {}
        }

        if (error) {
            data.message = (error.message || error)
        }

        return NextResponse.json(
            data,
            { status: HttpStatusCode.BadRequest },
        );
    }
}

export default Utils