addEventListener("scroll", ()=>{
    console.log(window.scrollY);
    if (window.scrollY > 50){
        if (window.scrollY > 50 && window.scrollY < 100){
            document.getElementById("after-header").style.top = `-${50-(window.scrollY-50)}px`;
        }
        else{
            document.getElementById("after-header").style.top = "0px"
        }
        document.getElementById("after-header").style.opacity = "1";
    }
    else{
        document.getElementById("after-header").style.opacity = "0";
    }
});