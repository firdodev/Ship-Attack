import { MainMenu } from './MainMenu'


const view = document.getElementById("view") as HTMLCanvasElement;
let main = new MainMenu(view);


function onReady(){
    console.log("is Ready");
    
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 10000);


    document.getElementById("view").style.display = "block";

    main.getWorld().getEngine().resize();
}

(async function() {
    await main.setup(onReady);
})();