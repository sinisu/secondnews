const API_KEY=`1ca59444f6184e01a70725c06a31ae22`
//https://ohmynews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}&pageSize=20
//https://newsapi.org/v2/top-headlines?country=kr&
let newsList=[];
const menus = document.querySelectorAll(".menus a")
menus.forEach(menu=>menu.addEventListener("click",(event)=>getCategory(event)))
const sideMenu = document.querySelectorAll(".side-menus a")
sideMenu.forEach(menu=>menu.addEventListener("click",(event)=>getCategory(event)))
const userInput=document.getElementById("keyword")
userInput.addEventListener("focus",()=>userInput.value="")
let url = new URL(`https://ohmynews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}&pageSize=20`)
let totalResults = 0
let page = 1
const pageSize = 10
const groupSize=5


const enter=()=>{
    switch(event.key){
        case "Enter": searchNews();
    }
}

const getNews=async()=>{
    try{
        url.searchParams.set("page",page); //=> &page=page
        url.searchParams.set("pageSize",pageSize);
        const response = await fetch(url);
        const data = await response.json();
        if(response.status===200){
            if(data.articles.length===0){
                throw new Error("No result for this search");
            }
            newsList=data.articles;
            totalResults=data.totalResults
            render();
            paginationRender();
        }else{
            throw new Error(data.message)
        }
    }catch(error){
        errorRender(error.message)
    }    
};

const getNewsAll=()=>{
    url = new URL(`https://ohmynews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}&pageSize=20`)
    getNews();
}
getNewsAll();

const getCategory=async(event)=>{
    const category=event.target.textContent.toLowerCase();
    url = new URL(`https://ohmynews.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}&pageSize=20`)
    getNews();
}

const searchNews=async()=>{
    const keyword=userInput.value;
    url = new URL(`https://ohmynews.netlify.app/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}&pageSize=20`)
    getNews();
    render();
}


const render=()=>{
    const newsHTML=newsList.map(item=>`<div class="row big-article">
    <div class="col-md-4 article-text">
        <div>
            <h2>${item.title}</h2>
            <p>${item.description==null||item.description==""?"No Centent":item.description.length>100?item.description.substring(0,100)+"...":item.description}</p>
        </div>
        <div>${item.source.name||"No Source"} ${moment(item.publishedAt).fromNow()}</div>
    </div>
    <div class="col-md-8">
        <img class="img-size" src="${item.urlToImage}" onerror="imgError(this)">
    </div> 
</div>`).join('');

    document.getElementById("news-article").innerHTML=newsHTML
}

const getVidioAll=async()=>{
    let url = new URL(`https://ohmynews.netlify.app/top-headlines?country=kr&category=sports&apiKey=${API_KEY}&pageSize=7`)
    const response = await fetch(url);
    const data = await response.json();
    newsList=data.articles;
    vidiorender();
    console.log("hey",newsList);
}
getVidioAll();

const vidiorender=()=>{
    const newsHTML=newsList.map(item=>`<div class="small-article">
    <div><img class="img-size mb-3" src="${item.urlToImage}" onerror="imgError(this)"></div>
    <h2>${item.title}</h2>
    <p>${item.description==null||item.description==""?"No Centent":item.description.length>100?item.description.substring(0,100)+"...":item.description}</p>
    <div>${item.source.name||"No Source"} ${moment(item.publishedAt).fromNow()}</div>
</div>`).join('');

    document.getElementById("video-article").innerHTML=newsHTML
}

const imgError=(img)=>{
    img.onerror=null;
    img.src="https://static.thenounproject.com/png/1583621-200.png";
    img.style.width="8rem";
};

const errorRender=(errorMessage)=>{
    const errorHTML=`<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;
  document.getElementById("news-article").innerHTML=errorHTML
}

const paginationRender=()=>{
    const totalPage = Math.ceil(totalResults/pageSize);
    const pageGroup = Math.ceil(page/groupSize);
    let lastPage = pageGroup*groupSize;
    if(lastPage>totalPage){
        lastPage=totalPage;
    }
    let firstPage = lastPage-(groupSize-1)<=0? 1:lastPage-(groupSize-1);

    let paginationHTML=``;

    if(firstPage>=6){
        paginationHTML=`<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt;&lt;</a></li>
    <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">&lt;</a></li>`;
    }
    
    for(let i=firstPage;i<=lastPage;i++){
        paginationHTML+=`<li class="page-item ${i===page?"active":""}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
    }
    if(lastPage<totalPage){paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">&gt;</a></li>
    <li class="page-item" onclick="moveToPage(${totalPage})"><a class="page-link" href="#">&gt;&gt;</a></li>`;
    }
    document.querySelector(".pagination").innerHTML=paginationHTML
}

const moveToPage=(pageNum)=>{
    console.log("move",pageNum)
    page=pageNum;
    getNews()
}


const openSearch=()=>{
    let inputArea=document.getElementById("input-area")
    if(inputArea.style.display==="block"){
        inputArea.style.display="none";
    } else{
        inputArea.style.display="block";
    }
}

const openNav=()=>{
    document.getElementById("mySidenav").style.width="18rem";
}

const closeNav=()=>{
    document.getElementById("mySidenav").style.width="0";
}