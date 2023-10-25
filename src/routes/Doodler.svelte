<script lang="ts">
  import { fabric } from "fabric";
  import { onMount } from "svelte";
  import type { Doodle } from "$lib/schema";

  export let doodle : Doodle | undefined = undefined; 
  let canvas : fabric.Canvas | fabric.StaticCanvas;

  let canvas_data : string = "";
  
  let brush_size : number = 3;

  let parent /* container */ : HTMLDivElement; 
  onMount(() => {

    // render from canvas_data (if fetched via doodle_id)
    if (doodle) {
      canvas = new fabric.StaticCanvas(`${doodle.id}`, {
        backgroundColor: "rgb(46, 16, 101)"
      });

      canvas.setWidth(parent.clientWidth);
      canvas.setHeight(parent.clientWidth);
      canvas.loadFromJSON(JSON.parse(doodle.canvas ?? "{}"));
    }
    else { 
      canvas = new fabric.Canvas("fabric", {
        backgroundColor: "rgb(46, 16, 101)"
      });

      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = "#faf";

      canvas.setWidth(parent.clientWidth);
      canvas.setHeight(parent.clientWidth);

      canvas.isDrawingMode = true;
      canvas.renderAll();


      canvas.on("path:created", () => {
        canvas_data = JSON.stringify(canvas);
      });

      canvas.on("object:modified", () => {
        canvas_data = JSON.stringify(canvas);
      });
    }
  });

  $: if (canvas) canvas.freeDrawingBrush.width = brush_size;
</script>

<div class="flex flex-col gap-4 w-full h-full max-w-md" bind:this={parent}>
  {#if doodle}
    <canvas id={`${doodle.id}`} class="rounded-xl px-auto border-4 border-white" />
    <p>{doodle.artist}</p>
  {:else}
    <div class="flex justify-between gap-4 items-center">
      <div class="flex gap-2">
        <label>
          Small
          <input type="radio" bind:group={brush_size} value={3} />
        </label>
        <label>
          Big
          <input type="radio" bind:group={brush_size} value={10} />
        </label>
      </div>
    </div>

    <canvas id="fabric" class="rounded-xl px-auto border-4 border-white border-dashed" />

    <form method="POST" action="?/submitDoodle" class="w-full flex flex-col gap-4">
      <input name="canvas_data" type="hidden" value={canvas_data} />
      <label class="self-end flex items-center gap-2 basis-1/2">
        Signed,
        <input name="artist" type="text" class="px-2 py-1 rounded-lg bg-black/50 border border-white" />
      </label>
      <button class="w-full px-4 py-2 bg-white text-black shadow-md rounded-xl">Submit Doodle</button>
    </form>
  {/if}
</div>
