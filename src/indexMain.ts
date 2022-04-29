import { Main } from './Main'


const view = document.getElementById("view") as HTMLCanvasElement;
let main = new Main(view);

let start_btn = document.getElementById("start-btn");

function onReady(){
    console.log("is Ready");
    document.getElementById("end").style.display = "none";
    
    // document.getElementById("mainmenu").style.display = "none";
    start_btn.style.display = "none";
   // document.getElementById("loader").style.display = "none";

    document.getElementById("view").style.display = "block";

    main.getWorld().getEngine().resize();
}

function returnToMain(){
    location.reload();
}

(async function() {
    start_btn.addEventListener("click", async function(){
    //    document.getElementById("loader").style.display = "block";
        start_btn.parentNode.removeChild(start_btn);
        await main.setup(onReady);
    });          
    // await main.setup(onReady);
})();
