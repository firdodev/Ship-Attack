import { MainMenu } from './MainMenu'


const view = document.getElementById("view") as HTMLCanvasElement;
let mainmenu = new MainMenu(view);


function onReady(){
    console.log("is Ready");
    
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 10000);


    document.getElementById("view").style.display = "block";

    mainmenu.getWorld().getEngine().resize();
}

(async function() {
    debugger;
    await mainmenu.setup(onReady);
})();