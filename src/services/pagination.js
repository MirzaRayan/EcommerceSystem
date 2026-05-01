const getPagination = (query) => {

    // If user sends page use it otherwise default is 1
    const page = parseInt(query.page) || 1

    // If user sends limit use it otherwise default is 10
    const limit = parseInt(query.limit) || 10

    // How many products to skip
    const skip = (page - 1) * limit

    return { page, limit, skip }
}

export default getPagination