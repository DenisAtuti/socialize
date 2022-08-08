document.addEventListener('DOMContentLoaded', function() {
    openToast(processingToast,"Loading videos")
    const token = window.localStorage.getItem("token")
    if(token){
        isTokenValid(token) 
    }
    // getVideos ();
    hasQueryParams() 
    getAllLikedVideos()
    getAllFollowingVideos()
    disbleSentButton()
    
});


// UNIVERSAL SECTIION
let page = 1
let isLogedIn = false;
const storage = window.localStorage;
// const baseUrl = "http://localhost:8080"
const baseUrl = "https://socialize-backend.herokuapp.com"

// checking if the url is share or just the host
function hasQueryParams() {
    const myUrl = new URL(window.location.href)
    if(!myUrl.toString().includes("?")){
        getVideos ()
    }
}

// Checking validity of token
function isTokenValid(jwtToken) {
    fetch(`${baseUrl}/api/v1/videos/token/validity`, {
        method: 'GET',
        headers: {
                Authorization: jwtToken,
        },
    }).then(response =>{
        if (response.ok) {

           return response.json()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{

                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);

                console.log(info.message);
            })
           
        }
    }).then(data =>{

        if(data === true){
            displayProfile()
            showLoginBtn() 
            menuIconClicked()
            enableSentButton()
            

        }else{

            disbleSentButton()
        }

    })
    
}


// NAVIGATION SECTION
//...... display profile when login .....
function displayProfile() {
    const profileImage = document.querySelector("nav >.login")

    profileImage.style.display = "block"

    let profileName = JSON.parse(storage.getItem("user")).username;

    profileImage.querySelector("img").src = `https://robohash.org/${profileName}`

}

function hideProfile() {
    const profileImage = document.querySelector("nav >.login")
    profileImage.style.display = "none"
}


// DESKTOP MENU SECTION
// .......side menu button.....
function showLoginBtn() {
    const loginMenuBtn = document.querySelector(".side-login-btn")
    const logoutMenuBtn = document.querySelector(".side-logout-btn")

    loginMenuBtn.style.display = "none"
    logoutMenuBtn.style.display = "block"
    
}

function hideLoginBtn(){
    const loginMenuBtn = document.querySelector(".side-login-btn")
    const logoutMenuBtn = document.querySelector(".side-logout-btn")

    loginMenuBtn.style.display = "block"
    logoutMenuBtn.style.display = "none"
}


//.......toggle side menu it......
function toggleSideMenuItems() {
    const menuItems = document.querySelectorAll(".item")

    menuItems.forEach(item =>{


        item.addEventListener("click",()=>{
            
            menuItems.forEach(item2 =>{
                item2.classList.remove("active")
            })

            item.classList.add("active")
        }) 
    })
}

toggleSideMenuItems()


// SEARCH RESULT SECTION

// getting all the affilite names
let allAffiliateNames = []
function getAllAffilitesNames() {

    fetch(`${baseUrl}/api/v1/affiliate/get/all/affiliate/names`)
    .then(response =>{
        if (response.ok) {
            return response.json() 
        }
    }).then(data =>{
        // console.log(data);
        allAffiliateNames = data
        
    }).catch(error =>{
        console.log(error);
    })
    
}
getAllAffilitesNames()

const searchAffiliate = searchText =>{
    // get all matches
    let matches = allAffiliateNames.filter(affiliate =>{
        const regex= new RegExp(`^${searchText}`,'gi')
        return affiliate.match(regex)
    })

    if(searchText.length === 0){
        const resultContainer = document.querySelector(".search-result-container ul")
        matches = []
        resultContainer.innerHTML = ''
    }
 
    createResultHTML(matches)
    
}

function createResultHTML(matches) {
    const resultContainer = document.querySelector(".search-result-container ul")
    if (matches.length > 0) {
        const html = matches.map(match => `
            <li>${match}</li>
        `).join('')

        resultContainer.innerHTML = html
    }

    clickResults();
}

function getSearchInputValue() {
    const searchInput = document.getElementById("search-input")
    searchInput.addEventListener("input",()=>{
        searchAffiliate(searchInput.value);
    })
    
    
}

getSearchInputValue()

function clickResults() {
    const videoPostContainer = document.querySelector(".post-container")
    const results = document.querySelectorAll(".search-result-container > ul > li")
    const resultContainer = document.querySelector(".search-result-container > ul")
    results.forEach(result =>{
        result.addEventListener("click",()=>{
            videoPostContainer.innerHTML = " "
            getAffiliateVideosCall(result.innerText,0)
            videoPostContainer.scrollTop = 0
            AffiliatePageCount = 1
            resultContainer.innerHTML = ""
        })
    })
}

function submitSearchInput() {
    const videoPostContainer = document.querySelector(".post-container")
    const searchForm = document.getElementById("search-form")
    const searchInput = document.getElementById("search-input")
    const resultContainer = document.querySelector(".search-result-container > ul")
    searchForm.addEventListener("keypress",(e)=>{
        if (e.key === "Enter") {
            e.preventDefault()

            if(allAffiliateNames.includes(searchInput.value)){
                getAffiliateVideosCall(searchInput.value, 0)
                AffiliatePageCount = 1
                videoPostContainer.scrollTop = 0
                resultContainer.innerHTML = ""

            }else{
                openToast(dangerToast,`No search results for ${searchInput.value}`)
                setTimeout(() => {
                    closeToast(dangerToast)
                }, 3000);
            }
            
        }                               
       
    })

 

    const searchBtn = searchForm.querySelector("button")
    searchBtn.addEventListener("click",(e) =>{
        if(allAffiliateNames.includes(searchInput.value)){
            getAffiliateVideosCall(searchInput.value, 0)
            videoPostContainer.scrollTop = 0
            AffiliatePageCount = 1
            resultContainer.innerHTML = ""

        }else{
            openToast(dangerToast,`No search results for ${searchInput.value}`)
            setTimeout(() => {
                closeToast(dangerToast)
            }, 3000);
        }
    }) 
}
submitSearchInput()






// SUGGESTED AFFILIATE ACCOUNTS
// get all verified accounts
function getAllVerifiedAccounts() {

    fetch(`${baseUrl}/api/v1/affiliate/get/verified/affiliates`)
    .then(response =>{
        if (response.ok) {
            return response.json() 
        }
    }).then(data =>{
        createHtmlSuggestedAccounts(data.content)
       
    })
    
}

getAllVerifiedAccounts();

// create html for verrified suggested accounts
function createHtmlSuggestedAccounts(affiliates) {
    const accountContainer = document.querySelector(".suggested-account-container")
    affiliates.forEach(affiliate =>{
        accountContainer.insertAdjacentHTML('beforeEnd',`
            <div class="account">
                <img src="https://robohash.org/${affiliate.username}" alt="">
                <div>
                    <p>
                        <span>${affiliate.username}</span>
                        <i class="fas fa-check"></i>
                    </p>
                    <span>${affiliate.followersCount}</span>
                </div>
            </div>
        `)
    })
    
    getVerifiedAffiliateData()
}

// get verified affiliate data on click
function getVerifiedAffiliateData() {
    const verifiedAffiliateNames = document.querySelectorAll(".suggested-account-container .account")
    const videoPostContainer = document.querySelector(".post-container")

    verifiedAffiliateNames.forEach(affiliate =>{
        affiliate.addEventListener("click",()=>{
            const verifiedAffiliateName = affiliate.querySelector("p > span").innerText
            console.log(verifiedAffiliateName);

            getAffiliateVideosCall(verifiedAffiliateName,0)
            videoPostContainer.scrollTop = 0
            AffiliatePageCount = 1
        })
    })
}

//......for you icon clicked ......

function menuIconClicked() {

    const forYouBtn = document.querySelectorAll(".for-you")
    const postContainer = document.querySelector(".post-container")
    forYouBtn.forEach(item =>{
        item.addEventListener("click",()=>{
            postContainer.innerHTML = ""  ;     
            getVideos ()   
        })
    })   
}

// set full screen when full screen is clicked
function getFullScreen() {
    const fullScreenBtn = document.querySelector(".fullscreen")
    fullScreenBtn.addEventListener("click",()=>{
        lockMobileScreen()
    })
}
getFullScreen()

// MOBILE MENU SECTION
// Locking the mobile screen 
function lockMobileScreen() {
    let de = document.documentElement;
    if(de.requestFullscreen){
        de.requestFullscreen();
    }
    else if(de.mozRequestFullScreen){de.mozRequestFullScreen();}
    else if(de.webkitRequestFullscreen){de.webkitRequestFullscreen();}
    else if(de.msRequestFullscreen){de.msRequestFullscreen();}
    console.log("locking")
    screen.orientation.lock('portrait');
}

// mini menu on mobile
const miniMenu = document.querySelector(".mini-menu-list")
const miniMenuIcon = document.querySelector(".mini-menu-icon")

miniMenuIcon.addEventListener("click",()=>{
    miniMenu.classList.toggle("active")
})

// VIDEO POST SECTION




//.......auto play as soon as it visible
function observeVideoPost(posts) {
    const observer = new IntersectionObserver(
        entries =>{
            entries.forEach(entry =>{
                const video = entry.target.querySelector(".video-player-container > .player > video")
                const audio = entry.target.querySelector(".video-player-container > .player > audio")
                const viewCount = entry.target.querySelector(".link-container > .view > span").innerText
                const videoId = entry.target.dataset.target
                video.setAttribute("id", videoId)
                if(video.videoHeight > video.videoWidth){
                    video.classList.add("portrait")
                }  


                if (entry.isIntersecting) {          
                    addViewCount(videoId)
                    entry.target.querySelector(".link-container > .view > span").innerText = parseInt(viewCount) + 1;

                    // video.muted = false
                    setTimeout(() => {
                        video.currentTime = 0
                            
                        video.autoplay = true 

                        let playPromise = video.play();
                        let audioPlayPromise = audio.play()


                        if (playPromise !== undefined || audioPlayPromise !== undefined) {
                            playPromise.then(_ => {
                                video.play()
                                
                                
                            })
                            .catch(error => {
                                return
                            });

                            audioPlayPromise.then(_ =>{

                                audio.currentTime = video.currentTime
                                audio.play()

                            }).catch(error =>{
                                return
                            })
                        }

                        
                        

                   
                         video.loop = true 
                         audio.loop = true

                    

                    
                        // video.addEventListener("ended",()=>{
                        //     autoScroll(entry.target)
                        //     video.currentTime = 0
                        //     video.play()
                        // })
                        
                    }, 1000);
                        
                    
                       
                        
            


                  
                   
                }
                else{
                    video.pause()
                    audio.pause();
                }
                
            })
        },{
            root: null,
            rootMargin:"0px",
            threshold: 0.1
        }
    )
    

    posts.forEach(post =>{
        observer.observe(post)
    })

    
}

// creating audio url
function createAudioUrl(url) {
    const audioUrl = url.slice(0, 32) + "DASH_audio.mp4";
    return audioUrl;

}

// fetch new data every minute as soon as all video in the page are loaded
let clearTimeoutAfterCall = null
let contextshit = " "
let affiliateToCall = " "
let AffiliatePageCount = 0
let likedPageCount = 1
let followingPageCount = 1
let videoPageCount = 1
let lastPage = false;
let subredditToCall = " "
let subredditPageCount = 1
function getMoreVideosEveryMinute(videos) {
    
    if (clearTimeoutAfterCall != null) {
        clearTimeout(clearTimeoutAfterCall)   
    }
    let count = 0
    clearTimeoutAfterCall = setInterval(() => {
        
        const isAllVideoLoaded = Array.from(videos).every(isThisVideoLoaded)

        function isThisVideoLoaded(video) {
            return video.readyState === 4;
        }
        if(isAllVideoLoaded && count === 0){
            setTimeout(() => {
                openToast(successToast,"Loading videos")
                switch(contextshit) {
                    case "affiliate":
                        if(!lastPage){
                            getAffiliateVideosCall(affiliateToCall, AffiliatePageCount)
                            AffiliatePageCount++
                        }else{
                            closeToast(successToast)
                        }
                      break;

                    case "liked":
                        if(!lastPage){
                            getAllLikedVideosCall(likedPageCount)
                            likedPageCount++
                        }else{
                            closeToast(successToast)
                        }
                      break;
                    case "following":
                        if(!lastPage){
                            getAllFollowingVideosCall(followingPageCount)
                            followingPageCount++
                        }else{
                            closeToast(successToast)
                        }
                      break;
                    case "subreddit":
                        if(!lastPage){
                            getSubredditVideo(subredditToCall,subredditPageCount)
                            subredditPageCount++
                        }else{
                            closeToast(successToast)
                        }
                      break;
                    
                    default:
                        getVideos (videoPageCount)
                        videoPageCount++
                }
                count ++
                
            },1000);
        }

    },10000);

    
}

// toggle video links and headers
function displayVideoLinks(loadingIconContainer) {
    loadingIconContainer.forEach(post =>{
        post.addEventListener("click",() =>{
    
            const postHeaders = post.parentElement.parentElement.parentElement.querySelector(".post-header")
            const postLinks = post.parentElement.parentElement.parentElement.querySelector(".link-container")
            
            postHeaders.classList.toggle("active")
            postLinks.classList.toggle("active")
        })
    })
    
   
}

// show a loading icon when video is buffering
let bufferingLoadingTime = null;
let errorLoadingTime = null
function showLoadingIconWhenBuffering(videos) {
    
    videos.forEach(video =>{

        const audio =  video.parentElement.querySelector("audio");
        audio.addEventListener('error', function(e) {
            
        });

        video.addEventListener("loadstart",()=>{
            video.parentElement.querySelector(".loading-icon").classList.add("active")
            audio.pause();
        
        })
    
        video.addEventListener("error",()=>{
            video.parentElement.querySelector(".loading-icon").classList.add("active")
            audio.pause();
            if(errorLoadingTime != null){
                clearTimeout(errorLoadingTime)
            }
    
            errorLoadingTime = setTimeout(() => {
                console.log("error");
                swapVideo(video.getAttribute('id'))
            }, 60000);
        
        })
    
        video.addEventListener("waiting",()=>{
            video.parentElement.querySelector(".loading-icon").classList.add("active")
            audio.pause();
    
            if(bufferingLoadingTime != null){
                clearTimeout(bufferingLoadingTime)
            }
    
            bufferingLoadingTime = setTimeout(() => {
                console.log("waiting");
                swapVideo(video.getAttribute('id'))
            }, 20000);
            // clearTimeout(loadingTime)
        
        })
        video.addEventListener("playing",()=>{

            audioPlayPromise = audio.play();

            if (audioPlayPromise !== undefined) {
                audioPlayPromise.then(function() {
                    audio.play();
                }).catch(error =>{
                    return
                })
            }
            if(video.parentElement.querySelector(".loading-icon").classList.contains("active")){
                video.parentElement.querySelector(".loading-icon").classList.remove("active")
            }
        })

    })

    
    

}
/// auto scroll once video is completed
function autoScroll(post) {
    const postContainer = document.querySelector(".post-container")
    const video = post.querySelector("video")

    const firstPostHight = post.offsetHeight;
    let scrollTime = (firstPostHight * 9) / 5

    // video.addEventListener("loadstart",(e)=>{
    //     if(e){
    //         scrollTime = 0
    //     } else{
    //         scrollTime = (firstPostHight * 9) / 5
    //     }
    // })


    console.log(firstPostHight);

    postContainer.style.scrollSnapType = "block proximity";
    let timeInterval = setInterval(() => { 
        postContainer.scrollBy(0,5);
    }, 10);

    setTimeout(() => {
        postContainer.style.scrollSnapType = "block mandatory"
        clearInterval(timeInterval)    
    }, scrollTime);

   
}

// scroll left to open affiliate page
// increment likes when like icon is clicked
function increamentLikes(likeIcons) {

    likeIcons.forEach(icon =>{

        // icon.classList.remove("open-login-model");
        icon.addEventListener("click",()=>{
            if (!icon.classList.contains("active")) {
                
                incrementVideoLike(icon);
            }else{
                
                decrementVideoLike(icon)
            }
               
                
        })

    })
    

}

// increment likes backend
function incrementVideoLike(likeIcon) {

    const videoId = parseInt(likeIcon.parentElement.parentElement.dataset.target)
    const jwtToken = storage.getItem("token")

    fetch(`${baseUrl}/add/like?videoId=${videoId}`,{
        method: 'POST',
        headers: {
            Authorization: jwtToken,
        }
    }).then(response =>{
        if(response.ok){

            const counter = parseInt(likeIcon.querySelector("span").innerText) 
            likeIcon.querySelector("span").innerText = counter + 1;
            likeIcon.querySelector("i").style.color = "#ffa31a";
            likeIcon.classList.add("active")
            
            return response.json()
        }
        else if((response.status >= 400 && response.status < 600) ){
            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);

                console.log(info.message);
            })

            const loginModel = document.querySelector(".login-model-container")
            loginModel.classList.add("active")
           
        }
    }).then(data=>{
        // 
        console.log(data);
    })

    
}

// decrement likes backend
function decrementVideoLike(likeIcon) {

    const videoId = parseInt(likeIcon.parentElement.parentElement.dataset.target)
    const jwtToken = storage.getItem("token")

    fetch(`${baseUrl}/api/v1/videos/remove/like?videoId=${videoId}`,{
        method: 'POST',
        headers: {
            Authorization: jwtToken,
        }
    }).then(response =>{
        if(response.ok){
            
            const countertwo = parseInt(likeIcon.querySelector("span").innerText) 
            likeIcon.querySelector("span").innerText = countertwo - 1;
            likeIcon.querySelector("i").style.color = "#D3D3D3";
            likeIcon.classList.remove("active");

            return response.text()
        }
        else if((response.status >= 400 && response.status < 600) ){
            response.json().then(info =>{
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);

                console.log(info.message);
            })
            const loginModel = document.querySelector(".login-model-container")
            loginModel.classList.add("active")
           
        }
    }).then(data=>{
        return data;
    })

    
}


// edit like icon if the user liked it

//follow button on clicked
function followBtnClicked(followBtns) {

    followBtns.forEach(btn =>{

        const button = btn.querySelector("button");

        if (button.classList.contains("active")) {
            button.innerText = 'Following';             
        }else{
        
            button.innerText = 'Follow';
        }

            btn.addEventListener("click",()=>{
                
                const affiliateName = btn.parentElement.querySelector(".username p").innerText;

                button.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

                setTimeout(() => {

                    if (button.classList.contains("active")) {
                        
                        removeAffiliateFollower(affiliateName,button)           
                    }else{
                        
                        addAffiliateFollower(affiliateName,button)
                    }
                    
                }, 2000);

                
                    
            })

        
    })


}

// add affiliate follower with current user
function addAffiliateFollower(affiliateName,button) {
    const jwtToken = storage.getItem("token")
    fetch(`${baseUrl}/api/v1/user/follow?affiliateName=${affiliateName}`, {
        method: 'POST',
        headers: {
                Authorization: jwtToken,
        },
    }).then(response =>{
        if (response.ok) {

            button.innerHTML = 'Following';
            button.classList.add("active") 

           return response.text()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{

                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);

                console.log(info.message);
            })

            button.innerHTML = 'Follow';
            button.classList.remove("active") 

            const loginModel = document.querySelector(".login-model-container")
            loginModel.classList.add("active")
           
        }
    }).then(data =>{
        // console.log(JSON.stringify(data));
        addFollowingStyles(data)
    })
}

// changing all follow btn to reflect  following styles
function addFollowingStyles(affiliateName) {

    const pageAffiliateNames = document.querySelectorAll(".profile > .username.affiliate > p")
    pageAffiliateNames.forEach(pageAffiliateName =>{
        if (pageAffiliateName.innerText === affiliateName) {
            const followBtn = pageAffiliateName.parentElement.parentElement.querySelector(".follow-btn > button")
            followBtn.innerText = "Following"
            followBtn.classList.add("active")
        }
        

    })
    
}
// changing all follow btn to reflect  following styles
function removeFollowingStyles(affiliateName) {

    const pageAffiliateNames = document.querySelectorAll(".profile > .username.affiliate > p")
    pageAffiliateNames.forEach(pageAffiliateName =>{
        if (pageAffiliateName.innerText === affiliateName) {
            const followBtn = pageAffiliateName.parentElement.parentElement.querySelector(".follow-btn > button")
            followBtn.innerText = "Follow"
            followBtn.classList.remove("active")
        }
        

    })
    
}
// add affiliate follower with current user
function removeAffiliateFollower(affiliateName,button) {
    const jwtToken = storage.getItem("token")
    fetch(`${baseUrl}/api/v1/user/unfollow?affiliateName=${affiliateName}`, {
        method: 'POST',
        headers: {
                Authorization: jwtToken,
        },
    }).then(response =>{
        if (response.ok) {

            button.innerHTML = 'Follow';
            button.classList.remove("active") 
            
           return response.text()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);

                console.log(info.message);
            })

            button.innerHTML = 'Following';
            button.classList.add("active") 

            const loginModel = document.querySelector(".login-model-container")
            loginModel.classList.add("active")
           
        }
    }).then(data =>{
        removeFollowingStyles(data)
    })
}

// add view count as soon as it appear on the screen
function addViewCount(videoId) {
    fetch(`${baseUrl}/api/v1/videos/add/view/${videoId}`,{
        method: 'POST'
    })
          
    
}

// downgrading video quality from 1080 to 480
function degradeVideo(videoSrc) {

    if (videoSrc.includes("1080")) {
        return videoSrc.replace("1080","720")
        
    }
    if (videoSrc.includes("720")) {
        return videoSrc.replace("720","480")
        
    }

    return videoSrc
}

// swap video to a lower qualitity while waiting
function swapVideo(videoId) {

    const video = document.getElementById(`${videoId}`)
    const audio = video.parentElement.querySelector("audio")
    const currentBufferingTime = video.currentTime
    video.src = degradeVideo(video.getAttribute("src"))
    video.currentTime = currentBufferingTime;
    audio.currentTime = video.currentTime 
    console.log("swapped");
    video.load()
    
}

// hundling video loading error 
function handleLoadError(videos) {

    videos.forEach(video =>{
        video.addEventListener("error",() =>{
            setTimeout(() => {
                swapVideo(video.getAttribute('id'))             
            }, 60000);
        })
    })
    
}
//genneral video post api call
function getVideos () {
    let url = "";
    const user = JSON.parse(storage.getItem("user"))
    if(user !== null){
        username = user.username
        url = `?username=${username}`
    }

  fetch(`${baseUrl}/api/v1/videos/page${url}`)
  .then(response =>{
      if (response.ok) {
        return response.json() 
    }
    }).then(data =>{
        createVideoPost(data.content)
        closeToast(processingToast)
        closeToast(successToast)
        // disbleSentButton()
        openLoginModel()
        clickAdCloseIcon()

    }).catch(error =>{
        console.log(error);
    })
    
}

//get affiliate videos
function getAffiliateVideos(affiliateNames) {
   
    const videoPostContainer = document.querySelector(".post-container")

    affiliateNames.forEach(affiliate =>{
        affiliate.addEventListener("click",() =>{
            const affiliateName = affiliate.innerText
            getAffiliateVideosCall(affiliateName,0);
            videoPostContainer.scrollTop = 0
            openToast(processingToast,`Loading ${affiliateName} videos`)
            AffiliatePageCount = 1
            lastPage = false
        })
    })
    
}

function getAffiliateVideosCall(affiliate,AffiliatePageCount) {

    let url = "";
    const user = JSON.parse(storage.getItem("user"))
    if(user !== null){
        username = user.username
        url = `&username=${username}`
    }

    fetch(`${baseUrl}/api/v1/videos/get/affiliate/videos/${affiliate}?page=${AffiliatePageCount}${url}`)
    .then(response =>{
        if (response.ok) {
            contextshit = "affiliate"
            affiliateToCall = affiliate;
            closeToast(processingToast)

            return response.json() 
        }
    }).then(data =>{

        if(data.totalPages <= AffiliatePageCount){
            lastPage = true;
            console.log(AffiliatePageCount);
        }
        if(AffiliatePageCount <= 0){
            const videoPostContainer = document.querySelector(".post-container")
            videoPostContainer.innerHTML = ""         
        }
        if(data.content.length === 0 && AffiliatePageCount === 0){
            openToast(processingToast,"i have no idea what this does")            
        }else{
            createVideoPost(data.content)
        }
        closeToast(processingToast)
        closeToast(successToast)
        openLoginModel()
        clickAdCloseIcon()
    }).catch(error =>{
        console.log(error);
    })
    
}

// get all the liked videos
function getAllLikedVideos(){
    const likedIcons = document.querySelectorAll(".liked-videos")
    const videoPostContainer = document.querySelector(".post-container")
    likedIcons.forEach(icon =>{
        icon.addEventListener("click",()=>{
            getAllLikedVideosCall(0)
            openToast(processingToast,"Loading all videos you liked")
            videoPostContainer.scrollTop = 0
            likedPageCount = 1
            lastPage = false
        })
    })
}

// get all the liked videos from backed
function getAllLikedVideosCall(likedPageCount) {
    const jwtToken = storage.getItem("token")
    fetch(`${baseUrl}/api/v1/videos/get/all/liked/videos?page=${likedPageCount}`, {
        method: 'GET',
        headers: {
                Authorization: jwtToken,
        },
    }).then(response =>{
        if (response.ok) {
            contextshit = "liked"
            closeToast(successToast)
            closeToast(processingToast)
           return response.json()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);


                closeLoginModel()

                const loginModel = document.querySelector(".login-model-container")
                loginModel.classList.add("active")
                
            })
           
        }
    }).then(data =>{
        if(data.totalPages <= likedPageCount){
            lastPage = true;
        }
        if(likedPageCount <= 0){
            document.querySelector(".post-container").innerHTML = ""                    
        }
        if(data.content.length === 0 && likedPageCount === 0){
            openToast(processingToast,"You Haven't liked any video yet") 
            setTimeout(() => {
                closeToast(processingToast)
            }, 5000);           
        }else{
            const videoObject = creatingVideoObjectFromLikedVideo(data.content)
            console.log(videoObject);
            createVideoPost(videoObject)
        }

        console.log(creatingVideoObjectFromLikedVideo(data.content));


    })
}

// craeting video object from likedvideos

function creatingVideoObjectFromLikedVideo(likedVideos) {   
    const videoObject = [];

    likedVideos.forEach(likedVideo =>{
        videoObject.push(likedVideo.video)
    })

    return videoObject   
}
// get all the following videos
function getAllFollowingVideos(){
    const followingIcons = document.querySelectorAll(".following-video")
    const videoPostContainer = document.querySelector(".post-container")
    followingIcons.forEach(icon =>{
        icon.addEventListener("click",()=>{
            getAllFollowingVideosCall(0)
            openToast(processingToast,"Loading videos from accounts you follow")
            videoPostContainer.scrollTop = 0
            followingPageCount = 1
            lastPage = false
        })
    })
}

// get all the following videos from backed
function getAllFollowingVideosCall(followingPageCount) {
    const jwtToken = storage.getItem("token")
    fetch(`${baseUrl}/api/v1/videos/get/following?page=${followingPageCount}`, {
        method: 'GET',
        headers: {
                Authorization: jwtToken,
        },
    }).then(response =>{
        if (response.ok) {
            contextshit = "following"
            closeToast(successToast)
            closeToast(processingToast)
           return response.json()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);


                closeLoginModel()

                const loginModel = document.querySelector(".login-model-container")
                loginModel.classList.add("active")
                
                
            })
           
        }
    }).then(data =>{
        if(data.totalPages <= followingPageCount){
            lastPage = true;
        }
        if(followingPageCount <= 0){
            document.querySelector(".post-container").innerHTML = ""                    
        }
        createVideoPost(data.content)

    })
}



// create each post card after api call
//<source src="${video.videoLocationUrl}" type="video/mp4"></source>
let CommentVideoId
function createVideoPost(videoList) {
    const videoPostContainer = document.querySelector(".post-container")
    let style;
    let followStyle
    let verifiedIcon

    videoList.forEach(video =>{
        const audioUrl = createAudioUrl(video.videoLocationUrl)

        if (video.isLiked) {
            style = "active";
        }
        if(video.isFollowing){
            followStyle = "active"
        }
        if(video.isVerified){
            verifiedIcon = "active"
        }
        videoPostContainer.insertAdjacentHTML('beforeEnd',`
        <div class="post" data-target="${video.id}">                         
            <div class="video-player-container">
                <div class="player">
                    <video muted src="${video.videoLocationUrl}" type="video/mp4" class="myVideo film video-js" preload="metadata" data-setup='{}'>
                        Your browser does not support this video format
                    </video>
                    <audio src="${audioUrl}" rel="noreferrer" id="playAudio" ></audio>
                    <div class="loading-icon">
                        <i class="fas fa-circle-notch fa-spin"></i>
                    </div>

                </div>                   
            </div>
            <div class="post-header">
                <div class="profile-container">
                    <div class="profile">
                        <div class="username affiliate">
                            <p>${video.affiliateName}</p>
                            <i class="fas fa-check ${verifiedIcon}"></i>
                        </div>
                        <div class="follow-btn open-login-model">
                            <button class="${followStyle}">Follow</button>
                        </div>     
                    </div>

                </div>
                <div class="title-container">
                    ${video.title}
                </div>
            </div>  
            <div class="link-container">
                <div class="link link-profile">
                    <div class="image">
                        <img src="https://robohash.org/${video.affiliateName}" alt="" srcset="">
                    </div>
                </div>
                <div class="link like open-login-model ${style}">
                <i class="far fa-heart ${style}"></i>
                <span>${video.userLikes.length}</span>
                </div>
                <div class="link view">
                    <i class="far fa-play-circle"></i>
                    <span>${video.viewsCount}</span>
                </div>
                <div class="link comment comment-icon">
                    <i class="far fa-comment-alt"></i>
                    <span>${video.posts.length}</span>
                </div>
                <div class="link share share-icon">
                    <i class="far fa-share-square"></i>
                    <span>${video.sharedCounter}</span>
                </div>
            </div>

            
            <div class="ad-container" data-target="${video.ad.id}">
                <div class="ad">
                    <a href="${video.ad.affiliateLink}"  target="_blank" rel="noopener noreferrer">
                        <div class="image">
                            <img src="${video.ad.imageLocationUrl}"  alt="" srcset="">
                        </div>
                    </a>
                    
                </div>
                <i class="far fa-times-circle"></i>     
            </div>  
    </div> 
        `)
        
    })

    // <div class="ad-content-text">
    //     <h2>Best cooking</h2>
    //     <p>Get best cooking</p>
    //     <a href="">
    //         <button>Get now</button>
    //     </a>
    // </div>

    const posts = document.querySelectorAll(".post:nth-last-child(-n+3)");

    const videos = []
    const likeIcon = []
    const headerLinkContainer = []
    const affiliateNames = []
    const followBtns = []
    const commentIcons = []
    
    posts.forEach(post =>{
        likeIcon.push(post.querySelector(".like"))
        headerLinkContainer.push(post.querySelector(".loading-icon"))
        videos.push(post.querySelector("video"))
        affiliateNames.push(post.querySelector(".post-header > .profile-container > .profile > .username > p"))
        followBtns.push(post.querySelector(".post-header > .profile-container > .profile > .follow-btn"))
        commentIcons.push(post.querySelector(".link.comment.comment-icon"))
    })

    observeVideoPost(posts)
    increamentLikes(likeIcon)
    displayVideoLinks(headerLinkContainer)
    getMoreVideosEveryMinute(videos)
    handleLoadError(videos)
    showLoadingIconWhenBuffering(videos)
    getAffiliateVideos(affiliateNames)
    followBtnClicked(followBtns)
    openCommentModel()
    shareBtnClicked()
    displayAds()
    observeLastVideo()
    getAllAds()
    
}


// observe the last video post to make sure all videos are loaded to call new once
function observeLastVideo() {
    const postContainer = document.querySelector(".post-container")
    postContainer.addEventListener("scroll",()=>{

        if( postContainer.scrollTop >= (postContainer.scrollHeight - postContainer.offsetHeight)){
            if (!lastPage) {
                openToast(dangerToast,"Wait,still loading curent videos")
                setTimeout(() => {
                    closeToast(dangerToast)    
                }, 3000);
            } 

            if (lastPage) {
                console.log("lastpage");
                openToast(processingToast,"This is the last video")
                setTimeout(() => {
                    closeToast(processingToast)    
                }, 3000)
            }
        }

        
    })
 
}


// AD SECTION

//........close ad banner on click......
function clickAdCloseIcon() {
    const adIcons = document.querySelectorAll(".ad-container > i")
    adIcons.forEach(adIcon =>{
        adIcon.addEventListener("click",()=>{
            adIcon.parentElement.style.display = "none";
        })
    })
}
// display ad as soon as its visibel in the page
function displayAds() {
    const ads = document.querySelectorAll(".ad-container");

    
    const adObserver = new IntersectionObserver(
        entries =>{
            entries.forEach(entry =>{

                
                if (entry.target.classList.contains("ad-container")) {

                    
                    if (entry.isIntersecting) {

                        // entry.target.classList.add("active")
                         
                        setTimeout(() => {
                            // entry.target.style.bottom = "0"
                        }, 2000);



                    }else{

                        entry.target.classList.remove("active")
                    }
                    
                }
            })
        },{
            root: null,
            rootMargin:"0px",
            threshold: 0
        }
    )

    ads.forEach(ad =>{
        adObserver.observe(ad);
    })

    clickAdCloseIcon();
}


  


// getting all add links
function getAllAds() {
    const ads = document.querySelectorAll(".ad-container");
    ads.forEach(ad =>{
        const ad_Link = ad.querySelector("a")
        ad_Link.addEventListener("click",(avoidAdLinkLooping))
    })
}

function avoidAdLinkLooping(event) {
    const adId = event.target.parentElement.parentElement.parentElement.parentElement.dataset.target
    updatingAdClicks(adId)
    
}

// updating clicks backend
async function updatingAdClicks(adId) {
    const response = await fetch(`${baseUrl}/api/v1/ad/add/click/${adId}`)
    const data = await response.text();
    console.log(data);
}



// COMMENT SECTION
//disable sent button if not loged in
function disbleSentButton() {
    const commentSubmitBtn = document.querySelector(".add-comment form button");
    commentSubmitBtn.querySelector("i").style.color = "#D3D3D3";
    commentSubmitBtn.disabled = true;
     
}

function enableSentButton(){
    const commentSubmitBtn = document.querySelector(".add-comment form button");
    commentSubmitBtn.querySelector("i").style.color = "#ffa31a";
    commentSubmitBtn.disabled = false;
}


// open comment model
function openCommentModel() {

    const commentOpenIcons = document.querySelectorAll(".link.comment.comment-icon")

    commentOpenIcons.forEach(commentOpenIcon =>{
        commentOpenIcon.addEventListener("click",avoidLoopingWhenCommentModelOpen)
    })
    
    closingCommentModel()
}

// closing the comment model
function closingCommentModel() {
    const commentCloseIcon = document.querySelector(".comment-close-icon")

    const commentForm = document.querySelector(".comment-form")
    const replyForm = document.querySelector(".reply-form")

    const commentModel = document.querySelector(".commenting-container")
    const commentWrapper = document.querySelector(".commenting-wrapper")

    commentCloseIcon.addEventListener("click",()=>{
        document.querySelector(".comment-form").classList.remove("active")
        document.querySelector(".reply-form").classList.add("active")
        commentModel.classList.remove("active")
        commentWrapper.classList.remove("active")
        commentWrapper.querySelector(".commenting-list").innerHTML = "";

        commentForm.reset()
        replyForm.reset()
    })
}

function avoidLoopingWhenCommentModelOpen(btn) {

    const commentModel = document.querySelector(".commenting-container")
    const commentWrapper = document.querySelector(".commenting-wrapper")

    CommentVideoId = btn.target.parentElement.parentElement.parentElement.dataset.target;
    commentModel.classList.add("active")
    commentWrapper.classList.add("active")
    getAllVideoComments(CommentVideoId)
    
    console.log(btn.target.parentElement.parentElement.parentElement);
}

// fetching all the video comments

function getAllVideoComments(videoId) {

    fetch(`${baseUrl}/api/v1/posts/get/all/posts?videoId=${videoId}`, {
        method: 'GET',
    }).then(response =>{
        if (response.ok) {
           return response.json()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000)
                
                
            })
           
        }
    }).then(data =>{
        console.log(data);
        createCommentHtmlElements(data)     

    })
}

// creating comments html elements
function createCommentHtmlElements(comments) {
    const commentContainer = document.querySelector(".commenting-list")
    document.querySelector(".commenting-wrapper .title span").innerText = comments.length
    commentContainer.innerHTML = ""
    
    if(comments.length === 0){
        commentContainer.insertAdjacentHTML('beforeEnd',`
            <div class="no-comment-container">
                <div class="no-comment">
                    Be the first to comment
                </div>
            </div>
        
        `)
    }else{
        comments.forEach(comment =>{  

            commentContainer.insertAdjacentHTML('beforeEnd',`
                <div class="commenting" data-target="${comment.id}">
                    <div class="comment">
                        <div class="image fuckme">
                            <img src="https://robohash.org/${comment.username}" alt="" srcset="">
                        </div>
                        <div class="commenting-header">
                            <div class="commenting-username">${comment.username}</div>
                            <p class="commenting-text">${comment.text}</p>
                            <div class="commenting-reply-btn">
                                <button class="reply-btn">Reply</button>
                                <button class="view-reply-btn">view replies(${comment.repliesCount})</button>
                            </div>
                        </div>
                        <div class="commenting-like-icon">
                            <i class="far fa-heart"></i>
                        </div>
    
                    </div>
                    <div class="reply-container">
                        
                    </div>
                </div>
            `)
    
        })

    }


    viewRepliesBtnPressed()
    toggleLikesColor()
    toggleReplyCommentForms()
    checkIfReplyEmpty()
   

    
}

// submitting comments

function submitComment() {
    const commentForm = document.querySelector(".commenting-wrapper .add-comment .comment-form")
    const commentFormInput = commentForm.querySelector("input")
    const commentObject = {}

    
    commentForm.addEventListener("submit",(e)=>{
        
        e.preventDefault()
        console.log("submitting");
        commentObject.text = commentFormInput.value;
        commentObject.postVideoId = CommentVideoId;
    
        const serialisedData = JSON.stringify(commentObject) 
        submittingCommentToServer(serialisedData)

        commentForm.reset();

             
    })

}

submitComment()

function submittingCommentToServer(serialisedData) {

    const jwtToken = storage.getItem("token")

    fetch(`${baseUrl}/api/v1/posts/post`, {
        method: "POST",
        body: serialisedData,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: jwtToken,
        }
    }).then(response =>{
        if (response.ok) {  
            return response.json()

        }
        else if((response.status >= 400 && response.status < 600) ){
            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);
            })
           
        }
    }).then(data =>{
        console.log(data);
        addCommentTopAfterSubmit(data)
       
        
    })
    
}
// add the new comment at the biging of the comment container
function addCommentTopAfterSubmit(comment) {
    const commentContainer = document.querySelector(".commenting-list")
    commentContainer.scrollTop = 0;

    const noCommentElement = document.querySelector(".no-comment-container");

    if (noCommentElement) {
        noCommentElement.style.display = "none"
    }

    let commentCounter = document.querySelector(".commenting-wrapper .title span");
    console.log(parseInt(commentCounter.innerText) + 1);
    commentCounter.innerText = parseInt(commentCounter.innerText) + 1;
    
    commentContainer.insertAdjacentHTML('afterbegin',`
        <div class="commenting" data-target="${comment.id}">
            <div class="comment">
                <div class="image fuckme">
                    <img src="https://robohash.org/${comment.username}" alt="" srcset="">
                </div>
                <div class="commenting-header">
                    <div class="commenting-username">${comment.username}</div>
                    <p class="commenting-text">${comment.text}</p>
                    <div class="commenting-reply-btn">
                        <button class="reply-btn">Reply</button>
                        <button class="view-reply-btn">view replies(23)</button>
                    </div>
                </div>
                <div class="commenting-like-icon">
                    <i class="far fa-heart"></i>
                </div>

            </div>
            <div class="reply-container">
                
            </div>
        </div>
    `)

    
    viewRepliesBtnPressed();
    toggleLikesColor()
    toggleReplyCommentForms()
    checkIfReplyEmpty()
}


// toggle comment and reply forms when reply button is pressed
let repliesContainer
let repliesCommentId
function toggleReplyCommentForms() {
    const replyBtns = document.querySelectorAll(".commenting-header .commenting-reply-btn .reply-btn")

    replyBtns.forEach(btn =>{
        btn.addEventListener("click",(avoidLoopingWhenR))
    })
}

function avoidLoopingWhenR(btn) {

    // repliesContainer = btn.target.parentElement.parentElement.parentElement.parentElement.querySelector(".reply-container")
    // repliesContainer.classList.toggle("active")

    const commentForm = document.querySelector(".comment-form")
    const replyForm = document.querySelector(".reply-form")

    const username = btn.target.parentElement.parentElement.querySelector(".commenting-username").innerText;
    const commentId = btn.target.parentElement.parentElement.parentElement.parentElement.dataset.target;
    const replyFormInput = replyForm.querySelector("input")

    commentForm.classList.add("active")
    replyForm.classList.remove("active")

    replyFormInput.value = `@${username} `;

    console.log(commentId);
}

/// deactive the reply form once there is no input value
function checkIfReplyEmpty() {
    const commentForm = document.querySelector(".comment-form")
    const replyForm = document.querySelector(".reply-form")
    const replyFormInput =  replyForm.querySelector("input")
    replyFormInput.addEventListener("keyup",() =>{
        if(replyFormInput.value.length === 0){
            commentForm.classList.remove("active")
            replyForm.classList.add("active")
        }
    })
}

// toggle like comment icon on click
function toggleLikesColor() {
    const likeCommentIcon = document.querySelectorAll(".commenting-like-icon > i")
    likeCommentIcon.forEach(icon =>{
        icon.addEventListener("click",()=>{
            icon.style.color = "#ffa31a"
        })
    })
}



// REPLIES SECTION
// get all the replies once the replies button is pressed
function viewRepliesBtnPressed() {
    const viewReplies = document.querySelectorAll(".view-reply-btn")
    viewReplies.forEach(reply =>{
        reply.addEventListener("click",avoidLoopingViewReplyBtnPressed)
    })
}



function avoidLoopingViewReplyBtnPressed(btn) {
    repliesContainer = btn.target.parentElement.parentElement.parentElement.parentElement.querySelector(".reply-container")
    repliesContainer.classList.toggle("active")
    repliesCommentId = btn.target.parentElement.parentElement.parentElement.parentElement.dataset.target;
    getAllCommentReplies(repliesCommentId)
    console.log(repliesCommentId);
}

// call the backend and get all comment replies
function getAllCommentReplies(repliesCommentId) {

    fetch(`${baseUrl}/api/v1/comments/get/post/comments/${repliesCommentId}`, {
        method: 'GET',
    }).then(response =>{
        if (response.ok) {
           return response.json()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000)
                
                
            })
           
        }
    }).then(data =>{

        console.log(data);
        
        createRepliesElements(data)


    })
}


// creating replies html Elements
function createRepliesElements(replies) {
    repliesContainer.innerHTML = ""
    replies.forEach(reply =>{
        repliesContainer.insertAdjacentHTML('beforeEnd',`

            <div class="comment">
                <div class="image fuckme">
                    <img src="https://robohash.org/${reply.username}" alt="" srcset="">
                </div>
                <div class="commenting-header">
                    <div class="commenting-username">${reply.username}</div>
                    <p class="commenting-text">${reply.reply}</p>
                </div>
                <div class="commenting-like-icon">
                    <i class="far fa-heart"></i>
                </div>

            </div>
        
        `)
    })

    if(replies.length === 0){
        repliesContainer.insertAdjacentHTML('beforeEnd',`
            <div class="no-comment-container">
                <div class="no-comment">
                    Be the first to reply
                </div>
            </div>
        
        `)
    }

    toggleLikesColor()
    viewRepliesBtnPressed()
    toggleLikesColor()
    toggleReplyCommentForms()
    checkIfReplyEmpty()
}

// submitting replies
function submitReply() {
    const replyForm = document.querySelector(".commenting-wrapper .add-comment .reply-form")
    const replyFormInput = replyForm.querySelector("input")
    const jwtToken = storage.getItem("token")
    const replyObject = {}


    replyForm.addEventListener("submit",(e) =>{
        e.preventDefault()

        replyObject.reply = replyFormInput.value;
        replyObject.postId = repliesCommentId;

        const serialisedData = JSON.stringify(replyObject)

        fetch(`${baseUrl}/api/v1/comments/comment`, {
            method: "POST",
            body: serialisedData,
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                Authorization: jwtToken,
            }
        }).then(response =>{
            if (response.ok) {

                return response.json()
    
            }
            else if((response.status >= 400 && response.status < 600) ){
                response.json().then(info =>{
                    // const errorText = document.querySelector(".toast.error > p")
                    // errorText.innerText = info.message
                    openToast(dangerToast,info.message)
                    setTimeout(() => {
                            closeToast(dangerToast)
                    },3000);
                })
               
            }
        }).then(data =>{
            console.log(data);
            console.log("calling replies");
            replyForm.reset();
            addReplyTop(data)
        })
        

    })

    
}

submitReply()

// posting the reply at the top of the reply container
function addReplyTop(reply) {
    repliesContainer.insertAdjacentHTML('afterbegin',`
        <div class="comment">
            <div class="image fuckme">
                <img src="https://robohash.org/${reply.username}" alt="" srcset="">
            </div>
            <div class="commenting-header">
                <div class="commenting-username">${reply.username}</div>
                <p class="commenting-text">${reply.reply}</p>
            </div>
            <div class="commenting-like-icon">
                <i class="far fa-heart"></i>
            </div>

        </div>
    `)

    repliesContainer.querySelector(".no-comment-container").style.display = "none";

    viewRepliesBtnPressed()
    toggleLikesColor()
    toggleReplyCommentForms()
    checkIfReplyEmpty()
}




// LOGIN SECTION 
//.......highligt primary color inputs .....
const inputs = document.querySelectorAll(".model-controller input")
inputs.forEach(input =>{
    input.addEventListener("keyup",() =>{
        const text = input.value
        // console.log(text);
        if (text.length != 0) {
            input.parentElement.classList.add("active");
            input.parentElement.querySelector("i").classList.add("active")

        }else{
            input.parentElement.classList.remove("active");
            input.parentElement.querySelector("i").classList.remove("active")
        }
    })
})

//...... open login model .....
function openLoginModel() {
    const closeModelIcon = document.querySelector(".login-model-close-icon")
    
    closeModelIcon.addEventListener("click",() =>{
        closeLoginModel()
    })

}
//........ close login model .......
function closeLoginModel() {
    const loginModel = document.querySelector(".login-model-container")
    loginModel.classList.remove("active")
    console.log("closing");
}

// login
const loginForm = document.getElementById("login-form")
loginForm.addEventListener("submit",(e) =>{
    e.preventDefault()
    const formData = new FormData(loginForm)
    const formDataSerialised = Object.fromEntries(formData);
    console.log(formDataSerialised);

    fetch(`${baseUrl}/api/v1/user/join`, {
        method: "POST",
        body: JSON.stringify(formDataSerialised),
        headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Jwt-token",
        }
    }).then(async (response) => {
        if (response.ok) {

            const token = "Bearer " + response.headers.get('Jwt-token');
            storage.setItem("token", token)
            storage.setItem("isUserLoggedIn","true")
           

            return response.json()

        }
        else if((response.status >= 400 && response.status < 600) ){
            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);
            })
           
        }

    }).then( data =>{
        console.log(data);
        storage.setItem("user",JSON.stringify(data))
        closeLoginModel()
        displayProfile()
        showLoginBtn() 
        menuIconClicked()
        enableSentButton()
        
    });


})
function logoutBtnClicked(){
    const logoutBtn = document.querySelectorAll(".logout-btn")
    logoutBtn.forEach(btn =>{
        btn.addEventListener("click",()=>{
            hideProfile();
            hideLoginBtn()
            disbleSentButton()
            localStorage.clear();
        })
    })
}

logoutBtnClicked()


// TOAST SECTION
const allToasts = document.querySelectorAll(".toast")

const processingToast = document.querySelector(".toast.processing")
const successToast = document.querySelector(".toast.success")
const dangerToast = document.querySelector(".toast.danger")


function openToast(toast,message) {
    allToasts.forEach(toast =>{
        closeToast(toast)
    })
    toast.querySelector("p").innerText = message
    toast.classList.add("active")    
}

function closeToast(toast) {
    toast.classList.remove("active") 
    toast.querySelector("p").innerText = ""
}

// ${video.videoLocationUrl}
// https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4

// QUERY SEARCH FUNCTIONS

// SHARE SECTION
// get  share url
function getSharedUrl() {
    const myUrl = new URL(window.location.href)
    const param = myUrl.searchParams.get("q")
    if(param !== null){
        getSharedLinkVideo(param)
    }
}

getSharedUrl()

function getSharedLinkVideo(param) {

    fetch(`${baseUrl}/api/v1/videos/get/by/id/${param}`)
    .then(response =>{
        if (response.ok) {
            return response.json() 
        }
    }).then(data =>{
        
        createVideoPost([data])

    })
    
    
}

function shareBtnClicked() {  
    const shareBtns = document.querySelectorAll(".link.share.share-icon")
    shareBtns.forEach(btn =>{
        btn.addEventListener("click",avoidLoopingWhenShareBtnClicked)
    })
}

// commentOpenIcon.addEventListener("click",avoidLoopingWhenCommentModelOpen)

function avoidLoopingWhenShareBtnClicked(btn) {
    const myUrl = new URL(window.location.href)
    const videoSharedId = btn.target.parentElement.parentElement.parentElement.dataset.target;


    navigator.clipboard.writeText(`${myUrl.host}?q=${videoSharedId}`);

    openToast(successToast,"video link is copied")
    setTimeout(() => {
        closeToast(successToast)
    }, 3000);

    

    const shareIcon = btn.target.parentElement.querySelector("span")
    const counter =  parseInt(shareIcon.innerText)
    shareIcon.innerText = counter + 1;

    UpdatingBackendShareCounter(videoSharedId) 
}

// updating share counter in the backend
function UpdatingBackendShareCounter(videoId) {
    fetch(`${baseUrl}/api/v1/videos/add/share/${videoId}`)
    .then(response =>{
        if (response.ok) {
           console.log(response); 
        }
    })
}

///GET AFFILIATES FROM SHARED LINK
function getSharedAffiliateLink() {
    const myUrl = new URL(window.location.href)
    const param = myUrl.searchParams.get("model")
    if(param !== null){
        console.log(param);
        getAffiliateVideosCall(param,0);
        openToast(processingToast,`Loading ${param} videos`)
        AffiliatePageCount = 1
        lastPage = false
    }
}
getSharedAffiliateLink();

///GET SUBREDDIT FROM SHARED LINK
function getSharedSubredditLink() {
    const myUrl = new URL(window.location.href)
    const param = myUrl.searchParams.get("subreddit")
    if(param !== null){
        getSubredditVideo(param,0)
        lastPage = false
    }
}

getSharedSubredditLink();

function getSubredditVideo(subreddit,page) {

    const jwtToken = storage.getItem("token")

    fetch(`${baseUrl}/api/v1/videos/get/subreddit/${subreddit}?page=${page}`, {
        method: 'GET',
        headers: {
                Authorization: jwtToken,
        },
    }).then(response =>{
        if (response.ok) {
            contextshit = "subreddit"
            subredditToCall = subreddit
           return response.json()

        }else if((response.status >= 400 && response.status < 600) ){

            response.json().then(info =>{
                // const errorText = document.querySelector(".toast.error > p")
                // errorText.innerText = info.message
                openToast(dangerToast,info.message)
                setTimeout(() => {
                        closeToast(dangerToast)
                },3000);
                
                
            })
           
        }
    }).then(data =>{
        if(data.totalPages <= page){
            lastPage = true;
        }
        if(page <= 0){
            document.querySelector(".post-container").innerHTML = ""                    
        }
        console.log(data);
        createVideoPost(data.content)

    })
}

