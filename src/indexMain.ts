import { Main } from './Main'


const view = document.getElementById("view") as HTMLCanvasElement;
let main = new Main(view);


function onReady(){
    console.log("is Ready");
    
    document.getElementById("mainmenu").style.display = "none";

    document.getElementById("loader").style.display = "none";

    document.getElementById("view").style.display = "block";

    main.getWorld().getEngine().resize();
}

(async function() {
    await main.setup(onReady);
})();