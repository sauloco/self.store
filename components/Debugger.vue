<script setup lang="ts">
interface Props {
  previewSrc: string,
  aiResponse: any,
  detections: any
}
const props = defineProps<Props>()

const canvasWidth = ref(400)
const canvasHeight = ref(400)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isImageLoaded = ref(false);

watch(() => [props.detections, props.aiResponse], () => refreshPreview())


const refreshPreview = () => {
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    previewBoundingBoxes(ctx,  props.detections.map(detection => detectionToBoundingBox(detection)))
  }
}

const previewBoundingBoxes = (ctx: CanvasRenderingContext2D, boundingBoxes: [{object: string,  left: number, top: number, right: number, bottom: number, color: string}]) => {
  for (const {object, left, right, top, bottom, color} of boundingBoxes) {
    setTimeout(() => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.strokeRect(left, top, right-left, bottom-top)
      ctx.fillStyle = "white";
      ctx.fillText(object, left + 1, top + 1)
      ctx.fillStyle = "black";
      ctx.fillText(object, left, top)
    }, 100)
  }
}

const detectionToBoundingBox = (segment: any) => {
  const { box, label } = segment
  return {
    object: label,
    left: box.xmin,
    top: box.ymin,
    right: box.xmax,
    bottom: box.ymax,
    color: "red"
  }
}

const previewImage = (event: Event) => {
  const image = event.target as HTMLImageElement
  canvasHeight.value = image?.height
  canvasWidth.value = image?.width
  setTimeout(() => {
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) {
      ctx.drawImage(image, 0, 0, canvasWidth.value, canvasHeight.value)
    }
  }, 100)
  isImageLoaded.value = true
}

setTimeout(() => refreshPreview(), 1000)

</script>

<template>
    <canvas v-show="isImageLoaded" ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
    <img v-show="false" :src="previewSrc" alt="" @load="previewImage"/>
    <pre v-if="aiResponse">{{ JSON.stringify(aiResponse, null, 2) }}</pre>
    <pre v-else>No debug data</pre>
</template>

<style scoped>

</style>