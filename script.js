document.addEventListener('DOMContentLoaded', function() {
    openToast(loadToast)
    getVideos ();
    
});

let page = 1

/////// UNIVERSAL SECTIION //////
const isLogedIn = false;

/////// IF LOGEDIN ////

//...... display profile when login .....
const profileImage = document.querySelector("nav >.login")
if (isLogedIn) {
    profileImage.style.display = "block"
}

// .......side menu button.....
const loginMenuBtn = document.querySelector(".side-login-btn")
const logoutMenuBtn = document.querySelector(".side-logout-btn")

if (isLogedIn) {
    loginMenuBtn.style.display = "none"
    logoutMenuBtn.style.display = "block"
}


///////// MINI MENU /////////\
const miniMenu = document.querySelector(".mini-menu-list")
const miniMenuIcon = document.querySelector(".mini-menu-icon")

miniMenuIcon.addEventListener("click",()=>{
    miniMenu.classList.toggle("active")
})


///////// SIDE MENU SECTION ////////
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



/////////// VIDEO SECTION ////////

//.......auto play as soon as it visible

function observeVideoPost() {
    const posts = document.querySelectorAll(".post:nth-last-child(-n+10)");

    const observer = new IntersectionObserver(
        entries =>{
            entries.forEach(entry =>{
                const video = entry.target.querySelector(".video-player-container > .player > video")
                const viewCount = entry.target.querySelector(".link-container > .view > span").innerText
                const videoId = entry.target.dataset.target
               
                
                if (entry.isIntersecting) {
                    addViewCount(videoId)
                    console.log("intersecting");
                    entry.target.querySelector(".link-container > .view > span").innerText = parseInt(viewCount) + 1;
                    video.currentTime = 0
                    video.play();
                    video.loop = true
                   
                }
                else{
                    if (video.readyState === 4) {
                        video.loop = false
                        video.pause();
                        
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

function displayVideoLinks() {
    const allPosts = document.querySelectorAll(".video-player-container");
    allPosts.forEach(post =>{
        post.addEventListener("click",() =>{
            post.parentElement.querySelector(".post-header").classList.toggle("active")
            post.parentElement.querySelector(".link-container").classList.toggle("active")
        })
    })
   
}


function showLoadingIconWhenBuffering() {
    const videos = document.querySelectorAll(".myVideo");
    

    videos.forEach(videoItem =>{

        videoItem.addEventListener("loadstart",()=>{
            videoItem.parentElement.querySelector(".loading-icon").classList.add("active")
    
        })
        videoItem.addEventListener("waiting",()=>{
            videoItem.parentElement.querySelector(".loading-icon").classList.add("active")
    
        })
        videoItem.addEventListener("playing",()=>{
            videoItem.parentElement.querySelector(".loading-icon").classList.remove("active")
        })
    
       
    })
}



/////// LINK SECTIION //////

function increamentLikes() {
    const likeIcons = document.querySelectorAll(".like")
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



///////// AD SECTION /////////

//........close ad banner on click......
function clickAdCloseIcon() {
    const adIcons = document.querySelectorAll(".ad-close-icon")
    adIcons.forEach(adIcon =>{
        adIcon.addEventListener("click",()=>{
            adIcon.parentElement.style.display = "none";
        })
    })
}
///// DISPLAY ADD WHEN ITS VISIBLE /////
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


/////////// COMMENT SECTION /////////


//.......disable sent button if not loged in ......
function disbleSentButton() {
    const commentPostBtns = document.querySelectorAll(".post-comment-container > button")
    if (!isLogedIn) {
        commentPostBtns.forEach(bts =>{
            bts.disabled = true;
            bts.style.cursor = "not-allowed";
        })
    }
}


//....... open comment model .....
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

///////////// FOLLOW BUTTON //////////
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

function addViewCount(videoId) {
    fetch(`https://socialize-backend.herokuapp.com/api/v1/videos/add/view/${videoId}`,{
        method: 'POST'
    })
          
    
}

/////////   LOGIN SECTION /////

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

// generating random page numbers numbers
function generateRandomPageNumber(pageSize){
    let rand = Math.random() * pageSize;
    rand = Math.floor(rand); 
  
    return rand;
}

// TOAST SECTION
const loadToast = document.querySelector(".toast.loading")
const fetchToast = document.querySelector(".toast.fetching")
const downloadToast = document.querySelector(".toast.downloading")

function openToast(toast) {
    setTimeout(() => {
        toast.classList.add("active")    
    }, 50);
    toast.classList.remove("active") 
}

function closeToast(toast) {
    setTimeout(() => {
        toast.classList.remove("active")    
    }, 50);
}



// VIDEO API CALL

function getVideos () {

    const page = generateRandomPageNumber(898)

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
      observeVideoPost();
      displayVideoLinks()
      displayAds()
      increamentLikes()
      openCommentModel()
      disbleSentButton()
      followBtnClicked()
      openCloseLoginModel()
      showLoadingIconWhenBuffering();
      clickAdCloseIcon()
    }).catch(error =>{
        console.log(error);
    })
    
}

// ${video.videoLocationUrl}
// https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4

// CREATING A VIDEO POST
function createVideoPost(videoList) {
    const videoPostContainer = document.querySelector(".post-container")
    
    videoList.forEach(video =>{
        videoPostContainer.insertAdjacentHTML('beforeEnd',`
        <div class="post" data-target="${video.id}">                         
            <div class="video-player-container">
                <div class="player">
                    <video class="myVideo film video-js"  preload="auto" loop autoplay muted data-setup='{}'>
                        <source src="${video.videoLocationUrl}" type="video/mp4">
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

}

// OBSERVER VIDEO POST THEN MAKE API CALL WHEN THE SCROLL IS 100PX ABOVE
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

            console.log(isAllVideoLoaded);

            function isThisVideoLoaded(video) {
                console.log(video.readyState );
                return video.readyState >= 3;
            }

            

            console.log( 'Scrolling has stopped.' );
            if( postContainer.scrollTop >= (postContainer.scrollHeight - postContainer.offsetHeight)){
                console.log("its at the bottom");

                if (!isAllVideoLoaded) {
                    openToast(downloadToast)                
                }else{
                    closeToast(downloadToast)
                }

                if (count === 0) {

                    console.log("counting asshole " + count);

                    if(isAllVideoLoaded){
                        console.log(postContainer.scrollTop);
                        console.log(postContainer.scrollHeight - postContainer.offsetHeight)
    
                        console.log("calling more troops");
                        getVideos ()
                        openToast(fetchToast)
                        count++
                    }
                    

                }
                
            }
        }, 100);
    },false)
 
}

