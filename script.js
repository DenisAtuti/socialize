document.addEventListener('DOMContentLoaded', function() {
    openToast(loadToast)
    getVideos ();
});


// UNIVERSAL SECTIION
let page = 1
const isLogedIn = true;

// NAVIGATION SECTION
//...... display profile when login .....
const profileImage = document.querySelector("nav >.login")
if (isLogedIn) {
    profileImage.style.display = "block"
}

// DESKTOP MENU SECTION
// .......side menu button.....
const loginMenuBtn = document.querySelector(".side-login-btn")
const logoutMenuBtn = document.querySelector(".side-logout-btn")

if (isLogedIn) {
    loginMenuBtn.style.display = "none"
    logoutMenuBtn.style.display = "block"
}
//.......toggle side menu it......

const menuItems = document.querySelectorAll(".item")

menuItems.forEach(item =>{


    item.addEventListener("click",()=>{
        
        menuItems.forEach(item2 =>{
            item2.classList.remove("active")
        })

        item.classList.add("active")
    })

    //........ login classes when logged on .....

    if (isLogedIn) {    
        item.classList.remove("open-login-model");
    }
})

//......for you icon clicked ......


const forYouBtn = document.querySelectorAll(".for-you")
const postContainer = document.querySelector(".post-container")
forYouBtn.forEach(item =>{
    item.addEventListener("click",()=>{
        if (isLogedIn) {    
            window.location.href = "https://atutidennis.com/";
        }
    })
})

const followingBtn = document.querySelectorAll(".following")
followingBtn.forEach(item =>{
    item.addEventListener("click",() =>{
        if (isLogedIn) {    
            window.location.href = "https://atutidennis.com/";
        }
    })
})

const likedBtn = document.querySelectorAll(".liked")
likedBtn.forEach(item =>{ 
    item.addEventListener("click",() =>{
        if (isLogedIn) {    
            window.location.href = "https://atutidennis.com/";
        }
    })
})

const fullScreenBtn = document.querySelector(".fullscreen")
fullScreenBtn.addEventListener("click",()=>{
    lockMobileScreen()
})

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
                const viewCount = entry.target.querySelector(".link-container > .view > span").innerText
                const videoId = entry.target.dataset.target
                video.setAttribute("id", videoId)
                if(video.videoHeight > video.videoWidth){
                    video.classList.add("portrait")
                }               
                
                if (entry.isIntersecting) {          
                    addViewCount(videoId)
                    entry.target.querySelector(".link-container > .view > span").innerText = parseInt(viewCount) + 1;
                    // console.log("this is the inter secting video: " + videoId);
                    video.currentTime = 0
                    video.play();
                    video.loop = true 
                    video.autoplay = true 
                    showLoadingIconWhenBuffering(video)
                   
                }
                else{
                    if (video.readyState === 4) {
                        video.loop = false
                        video.autoplay = false
                        video.pause();
                    }else{
                        video.load()
                    }
                }
                
            })
        },{
            root: null,
            rootMargin:"0px",
            threshold: 0
        }
    )

    posts.forEach(post =>{
        observer.observe(post)
    })

    
}

// fetch new data every minute as soon as all video in the page are loaded
function getMoreVideosEveryMinute(videos) {
    let clearTimeoutAfterCall = null

    if (clearTimeoutAfterCall != null) {
        clearTimeout(clearTimeoutAfterCall)   
    }
    
    clearTimeoutAfterCall = setInterval(() => {
        console.log("testing");
        
        const isAllVideoLoaded = Array.from(videos).every(isThisVideoLoaded)

        function isThisVideoLoaded(video) {
            return video.readyState === 4;
        }
        if(isAllVideoLoaded){
            // console.log("Calling more troops");
            openToast(fetchToast)
            getVideos ()
        }

    },10000);

    
}

// toggle video links and headers
function displayVideoLinks(loadingIconContainer) {
    loadingIconContainer.forEach(post =>{
        post.addEventListener("click",() =>{
            console.log("displaying links");
    
            const postHeaders = post.parentElement.parentElement.parentElement.querySelector(".post-header")
            const postLinks = post.parentElement.parentElement.parentElement.querySelector(".link-container")
    
            console.log(postHeaders);
            console.log(postLinks);
            
            postHeaders.classList.toggle("active")
            postLinks.classList.toggle("active")
        })
    })
    
   
}

// show a loading icon when video is buffering
let loadingTime = null;
function showLoadingIconWhenBuffering(video) {

    video.addEventListener("loadstart",()=>{
        video.parentElement.querySelector(".loading-icon").classList.add("active")
    
    })
    video.addEventListener("waiting",()=>{
        video.parentElement.querySelector(".loading-icon").classList.add("active")

        if(loadingTime != null){
            clearTimeout(loadingTime)
        }

        loadingTime = setTimeout(() => {
            console.log("waiting");
            swapVideo(video.getAttribute('id'))
        }, 20000);
        // clearTimeout(loadingTime)
    
    })
    video.addEventListener("playing",()=>{
        if(video.parentElement.querySelector(".loading-icon").classList.contains("active")){
            video.parentElement.querySelector(".loading-icon").classList.remove("active")
        }
    })
    

}

// increment likes when like icon is clicked
function increamentLikes(likeIcons) {
    likeIcons.forEach(icon =>{

        if (isLogedIn) { 
            icon.classList.remove("open-login-model");
            icon.addEventListener("click",()=>{
                if (!icon.classList.contains("active")) {
                    const counter = parseInt(icon.querySelector("span").innerText) 
                    icon.querySelector("span").innerText = counter + 1;
                    icon.querySelector("i").style.color = "#ffa31a";
                    icon.classList.add("active")
                }else{
                    const countertwo = parseInt(icon.querySelector("span").innerText) 
                    icon.querySelector("span").innerText = countertwo - 1;
                    icon.querySelector("i").style.color = "#D3D3D3";
                    icon.classList.remove("active");
                }
                
            })
        }

    })
    

}
//follow button on clicked
function followBtnClicked() {
    const followBtns = document.querySelectorAll(".follow-btn")
    if (isLogedIn) {

        followBtns.forEach(btn =>{
            btn.classList.remove("open-login-model");
            btn.addEventListener("click",()=>{
                const button = btn.querySelector("button");
                button.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
                setTimeout(() => {
                    if (button.classList.contains("active")) {
                        button.innerHTML = 'Follow';
                        button.classList.remove("active")            
                    }else{
                        button.innerHTML = 'Following';
                        button.classList.add("active") 
                    }
                }, 2000);
                
            })
        })
    }

}

// add view count as soon as it appear on the screen
function addViewCount(videoId) {
    fetch(`https://socialize-backend.herokuapp.com/api/v1/videos/add/view/${videoId}`,{
        method: 'POST'
    })
          
    
}

// generating random page numbers numbers
function generateRandomPageNumber(pageSize){
    let rand = Math.random() * pageSize;
    rand = Math.floor(rand); 
  
    return rand;
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

    
    // if (video){
    //     video.remove()
    // }
    
    // video = document.createElement('video')
    // video.src = degradeVideo(video.src)
    video.src = degradeVideo(video.getAttribute("src"))
    console.log(video);
    // clearTimeout(loadingTime)
    
}

// video post api call
function getVideos () {

    const page = generateRandomPageNumber(2383)

  fetch(`https://socialize-backend.herokuapp.com/api/v1/videos/page?page=${page}`)
  .then(response =>{
      if (response.ok) {
        return response.json() 
    }
  }).then(data =>{
      createVideoPost(data.content)
      closeToast(loadToast)
      closeToast(fetchToast)
      observeLastVideoAndCallApi()
      displayAds()
      openCommentModel()
      disbleSentButton()
      followBtnClicked()
      openCloseLoginModel()
    //   showLoadingIconWhenBuffering();
      clickAdCloseIcon()
    }).catch(error =>{
        console.log(error);
    })
    
}

// create each post card after api call
//<source src="${video.videoLocationUrl}" type="video/mp4"></source>
function createVideoPost(videoList) {
    const videoPostContainer = document.querySelector(".post-container")
    
    videoList.forEach(video =>{
        videoPostContainer.insertAdjacentHTML('beforeEnd',`
        <div class="post" data-target="${video.id}">                         
            <div class="video-player-container">
                <div class="player">
                    <video src="${video.videoLocationUrl}" type="video/mp4" class="myVideo film video-js"  preload="none" loop autoplay muted data-setup='{}'>
                        Your browser does not support this video format
                    </video>
                    <div class="loading-icon">
                        <i class="fas fa-circle-notch fa-spin"></i>
                    </div>

                </div>                   
            </div>
            <div class="post-header">
                <div class="profile-container">
                    <div class="profile">
                        <div class="username">
                            <p>${video.affiliateName}</p>
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="follow-btn open-login-model">
                            <button>Follow</button>
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
                        <img src="https://robohash.org/dennis" alt="" srcset="">
                    </div>
                </div>
                <div class="link like open-login-model">
                <i class="far fa-heart"></i>
                <span>${video.userLikes.length}</span>
                </div>
                <div class="link view">
                    <i class="far fa-play-circle"></i>
                    <span>${video.viewsCount}</span>
                </div>
                <div class="link comment comment-icon">
                    <i class="far fa-comment-alt"></i>
                    <span>${video.userViews.length}</span>
                </div>
                <div class="link share open-login-model">
                    <i class="far fa-share-square"></i>
                    <span>${video.posts.length}</span>
                </div>
            </div>

            <div class="comment-container" >
                <div class="title">167 comments</div>
                <div class="comment">
                    <div class="profile-container">
                        <div class="profile">
                            <div class="image">
                                <img src="https://robohash.org/dennis" alt="" srcset="">
                            </div>
                            <div class="username">
                                <p>
                                    Burak
                                    <i class="fas fa-check"></i>
                                </p>
                                <p>chef</p>
                            </div>
                        </div>
                        <div class="replies-container">
                            <p>i hope this work</p> 
                            <span>view replies(11)</span>
                        </div> 
                    </div>
                    <div class="comment-like-container">
                        <i class="far fa-heart"></i>
                        <span>234</span> 
                    </div>
                </div>    
                <i class="fas fa-times comment-close-icon"></i>
                <div class="post-comment-container">
                    <div class="image">
                        <img src="https://robohash.org/dennis" alt="" srcset="">
                    </div>
                    <input type="text" placeholder="Add comment ...">
                    <button>
                        <i class="far fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            
            <div class="ad-container">
                <div class="ad">
                    <div class="image">
                        <img src="https://robohash.org/dennis" alt="" srcset="">
                    </div>
                    <div class="ad-content-text">
                        <h2>Best cooking</h2>
                        <p>Get best cooking</p>
                        <button>Get Now</button>
                    </div>
                </div>
                <i class="fas fa-times ad-close-icon"></i>
            </div>  
    </div> 
        `)
        
    })

    const posts = document.querySelectorAll(".post:nth-last-child(-n+3)");

    const videos = []
    const likeIcon = []
    const headerLinkContainer = []
    posts.forEach(post =>{
        likeIcon.push(post.querySelector(".like"))
        headerLinkContainer.push(post.querySelector(".loading-icon"))
        videos.push(post.querySelector("video"))
    })

    observeVideoPost(posts)
    increamentLikes(likeIcon)
    displayVideoLinks(headerLinkContainer)
    getMoreVideosEveryMinute(videos)
    // showLoadingIconWhenBuffering(videos)

}

// observe the last video post to make sure all videos are loaded to call new once
function observeLastVideoAndCallApi() {
    const postContainer = document.querySelector(".post-container")
    console.log(postContainer);

    let isScrolling;
    let count = 0
    postContainer.addEventListener("scroll",()=>{
        clearTimeout(isScrolling)
        isScrolling = setTimeout(() => {
            const allVideos = document.querySelectorAll(".post > .video-player-container > .player > video")
            const isAllVideoLoaded = Array.from(allVideos).every(isThisVideoLoaded)

            function isThisVideoLoaded(video) {
                return video.readyState === 4;
            }

            if( postContainer.scrollTop >= (postContainer.scrollHeight - postContainer.offsetHeight)){
               
                if (!isAllVideoLoaded) {
                    openToast(downloadToast)
                    setTimeout(() => {
                        closeToast(downloadToast)
                    }, 2000);
                }   
            }

            if (count === 0) {
                if(isAllVideoLoaded){
                    getVideos ()
                    openToast(fetchToast)
                    count++
                }
                

            }                   
        }, 2000);
    },false)
 
}


// AD SECTION

//........close ad banner on click......
function clickAdCloseIcon() {
    const adIcons = document.querySelectorAll(".ad-close-icon")
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

                    entry.target.classList.add("active")

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


// COMMENT SECTION
//disable sent button if not loged in
function disbleSentButton() {
    const commentPostBtns = document.querySelectorAll(".post-comment-container > button")
    if (!isLogedIn) {
        commentPostBtns.forEach(bts =>{
            bts.disabled = true;
            bts.style.cursor = "not-allowed";
        })
    }
}


// open comment model
function openCommentModel() {
    const commentOpenIcons = document.querySelectorAll(".comment-icon");

    commentOpenIcons.forEach(commentOpenIcon =>{
        commentOpenIcon.addEventListener("click",() =>{
            const post = commentOpenIcon.parentElement.parentElement.querySelector(".comment-container");
            post.classList.add("active");
        })
    })

    const commentCloseIcon = document.querySelectorAll(".comment-close-icon")
    commentCloseIcon.forEach(commentContainer =>{

        commentContainer.addEventListener("click",()=>{
            commentContainer.parentElement.classList.remove("active")
        })
    })
    
}



// LOGIN SECTION 
//.......highligt primary color inputs .....
const inputs = document.querySelectorAll(".model-controller input")
inputs.forEach(input =>{
    input.addEventListener("keyup",() =>{
        const text = input.value
        console.log(text);
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
function openCloseLoginModel() {
    const loginModel = document.querySelector(".login-model-container")
    const loginItems = document.querySelectorAll(".open-login-model")

    loginItems.forEach(item =>{
        item.addEventListener("click",()=>{
            loginModel.classList.add("active")
        })
    })


    //........ close login model .......

    const closeModelIcon = document.querySelector(".login-model-close-icon")

    closeModelIcon.addEventListener("click",() =>{
        loginModel.classList.remove("active")
    })

}

// TOAST SECTION
const loadToast = document.querySelector(".toast.loading")
const fetchToast = document.querySelector(".toast.fetching")
const downloadToast = document.querySelector(".toast.downloading")

function openToast(toast) {
    toast.classList.add("active")    
}

function closeToast(toast) {
    toast.classList.remove("active") 
}

// ${video.videoLocationUrl}
// https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4


