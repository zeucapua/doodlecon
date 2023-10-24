<script lang="ts">
  import { onMount } from "svelte";
  import { fabric } from "fabric";

  export let doodle_id : string | undefined = undefined; 
  let canvas : fabric.Canvas | fabric.StaticCanvas;
  let isDrawingMode = false;

  let canvas_data : string = "";
  let artist : string = ""; // set from doodle_id

  let parent /* container */ : HTMLDivElement; 
  onMount(() => {

    // render from canvas_data (if fetched via doodle_id)
    if (doodle_id) {
      canvas = new fabric.StaticCanvas("fabric", {
        backgroundColor: "rgb(46, 16, 101)"
      });

      // TODO: fetch canvas_data from database
    }
    else { 
      canvas = new fabric.Canvas("fabric", {
        backgroundColor: "rgb(46, 16, 101)"
      }); 

      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = "#fff";

      canvas.setWidth(parent.clientWidth);
      canvas.setHeight(parent.clientWidth);

      canvas.renderAll();

      isDrawingMode = true;

      canvas.on("path:created", () => {
        canvas_data = JSON.stringify(canvas);
      });

      canvas.on("object:modified", () => {
        canvas_data = JSON.stringify(canvas);
      });
    }
    
  });

  $: if (canvas) { 
    canvas.isDrawingMode = isDrawingMode; 
  } 
</script>

<div class="flex flex-col gap-4 w-full h-full" bind:this={parent}>
  {#if !doodle_id}
    <div class="flex flex-row justify-between gap-4 items-center">
      <label class="flex items-center">
        <svg viewBox="0 0 32 32" width="32" height="32" stroke="currentColor" fill="currentColor"><path d="M9.3 17.7c-3.2 0-5.2 2.9-5.2 6 0 1.3-0.7 2.3-2 2.9-0.1 0.1-0.2 0.2-0.1 0.3 1 1.5 4 2.1 6 2.1 0.5 0 1 0 1.4-0.1 2.2-0.4 5-1.6 5.6-4.8 0.8-3.8-2.4-6.4-5.7-6.4z"  /><path d="M29.2 3.8C28.8 3.3 28.2 3 27.6 3c-0.4 0-0.8 0.1-1.2 0.4L16.1 12.5c-0.3 0.3-0.8 0.5-1.2 0.5h0 0c-0.3 0-0.7 0.1-1 0.3l-3.4 2.8c-0.1 0.1-0.2 0.3 0 0.4 0.1 0.1 0.2 0.2 0.2 0.2 2.9 0.3 5.4 2.3 5.5 5.4 0 0.1 0 0.2 0.1 0.3 0.2 0.1 0.4 0.1 0.5 0l2.8-3.3c0.2-0.3 0.4-0.6 0.4-0.9v-0.1c0-0.5 0.2-0.9 0.5-1.2l9.1-10.3c0.7-0.9 0.5-2-0.4-2.8z"  /></svg>
        <input type="checkbox" bind:checked={isDrawingMode} />
      </label>
    </div>
  {/if}
  <canvas id="fabric" class="rounded-xl px-auto border-4 border-white border-dashed" />
  {#if !doodle_id}
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
