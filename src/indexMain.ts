import { Main } from './Main'


const view = document.getElementById("view") as HTMLCanvasElement;
let main = new Main(view);

function onReady(){
    console.log("is Ready");
    main.getWorld().getEngine().resize();
}

(async function() {
    await main.setup(onReady);
})();