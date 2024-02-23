const API_KEY=`1ca59444f6184e01a70725c06a31ae22`


const getMainNews= async()=>{
    let url=`https://wemadenews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}&pageSize=20`
    const response= await fetch
    console.log("hier",response)
}