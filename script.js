/////// UNIVERSAL SECTIION //////
const isLogedIn = false;


/////// IF LOGEDIN ////

//...... display profile when login .....
const profileImage = document.querySelector("nav >.login")
if (isLogedIn) {
    profileImage.style.display = "block"
}
const navLoginBtn = document.querySelector(".login button")
if (isLogedIn) {
    navLoginBtn.style.display = "none"
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

const menuItems = document.querySelectorAll(".menu-container .menu .item")

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

const forYouBtn = document.querySelector(".for-you")
const postContainer = document.querySelector(".post-container")
forYouBtn.addEventListener("click",()=>{
    if (isLogedIn) {    
        postContainer.innerHTML = ""
    }
})

const followingBtn = document.querySelector(".following")
followingBtn.addEventListener("click",() =>{
    if (isLogedIn) {    
        postContainer.innerHTML = ""
    }
})

const likedBtn = document.querySelector(".liked")
likedBtn.addEventListener("click",() =>{
    if (isLogedIn) {    
        postContainer.innerHTML = ""
    }
})



/////////// VIDEO JS SECTION ////////

//.......auto play as soon as it visible


const videos = document.querySelectorAll(".myVideo");

const observer = new IntersectionObserver(
    entries =>{
        entries.forEach(entry =>{

            if (entry.target.classList.contains("film")) {

                if (entry.isIntersecting) {

                    entry.target.play()

                }else{

                    entry.target.pause()
                }
                
            }
        })
    },{
        root: null,
        rootMargin:"0px",
        threshold: 0
    }
)

videos.forEach(videoItem =>{
    observer.observe(videoItem)
    videoItem.addEventListener('ended',()=>{
        videoItem.setAttribute("src" ,"https://node-images-test.s3.eu-west-2.amazonaws.com/Pexels+Videos+2292093.mp4")
    })
   
    // videojs(videotem, {
    //     controls: true,
    //     autoplay: false,
    //     preload: 'auto'
    // });
})



/////// LINK SECTIION //////

const like = document.querySelector(".like")
let isLiked = false;
if (isLogedIn) { 
    like.classList.remove("open-login-model");
    like.addEventListener("click",()=>{
        if (!isLiked) {
            const counter = parseInt(like.querySelector("span").innerText) 
            like.querySelector("span").innerText = counter + 1;
            like.querySelector("i").style.color = "#ffa31a";
            isLiked = true; 
        }else{
            const counter = parseInt(like.querySelector("span").innerText) 
            like.querySelector("span").innerText = counter - 1;
            like.querySelector("i").style.color = "#000";
            isLiked = false
        }
        
    })
}



///////// AD SECTION /////////

//........close ad banner on click......
const adIcons = document.querySelectorAll(".ad-close-icon")
adIcons.forEach(adIcon =>{
    adIcon.addEventListener("click",()=>{
        adIcon.parentElement.style.display = "none";
        // window.open("https://github.com/DenisAtuti/overload-main") 
    })
})

///// DISPLAY ADD WHEN ITS VISIBLE /////
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

/////////// COMMENT SECTION /////////


//.......disable sent button if not loged in ......
const commentPostBtns = document.querySelectorAll(".post-comment-container > button")
if (!isLogedIn) {
    commentPostBtns.forEach(bts =>{
        bts.disabled = true;
        bts.style.cursor = "not-allowed";
    })
}

//....... open comment model .....

const commentOpenIcons = document.querySelectorAll(".comment");

commentOpenIcons.forEach(commentOpenIcon =>{
    commentOpenIcon.addEventListener("click",() =>{
        const post = commentOpenIcon.parentElement.parentElement.parentElement.querySelector(".comment-container");
        post.classList.add("active");
    })
})

const commentCloseIcon = document.querySelectorAll(".comment-close-icon")
commentCloseIcon.forEach(commentContainer =>{

    commentContainer.addEventListener("click",()=>{
        commentContainer.parentElement.classList.remove("active")
    })
})

///////////// FOLLOW BUTTON //////////
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