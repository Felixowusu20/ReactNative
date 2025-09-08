import ratelimiter from "../config/upstash.js"

const rateLimiting = async(req,res,next) =>{
    try {
        // in production put your ip address or the api address
        const{success} = await ratelimiter.limit("my-rate-limiter")
        if(!success){
            return res.status(429).json({
                message:"Too many request please try again later"
            })
        }
        next()
    } catch (error) {
        console.log("Rate limit error" ,error)
        next(error)
        
    }
}

export default rateLimiting