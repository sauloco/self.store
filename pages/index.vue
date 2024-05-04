<template>
  <input type="file" @change="onFileChange" accept="image/*"/>
  <h2>What is in the image</h2>
  <input type="checkbox" v-model="debug"/>
  <div v-if="pending" class="flex items-center gap-2"><LoaderCircle  class="animate-spin"/>Getting suggestions</div>
  <div v-else-if="!previewSrc">Input an image to test the bot</div>

  <SuggestObjectItem v-for="object in aiResponse.objects" :object="object" :key="object.object"/>
<!--  <ObjectItem v-for="object in aiResponse.objects" :object="object" :key="object.object"/>-->

  <Debugger v-if="debug" :aiResponse="aiResponse" :detections="detections" :preview-src="previewSrc"/>
</template>
<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import {$fetch} from "ofetch";

const aiResponse = ref({});
const detections = ref<any[] | null>(null);
const segments = ref<any[] | null>(null);
const previewSrc = ref('');
const pending = ref(false)
const debug = ref(false)




const onFileChange = async (event: any) => {
  pending.value = true
  const formData = new FormData();

  const file = event.target.files[0];

  previewSrc.value = URL.createObjectURL(file)

  formData.append('file', file);
  formData.append('type', file.type);

  const detectionsResult = await $fetch('/api/detection', {body: formData, method: 'POST'})

  // const segmentsResult = await $fetch('/api/segmentation', {body: formData, method: 'POST'})

  if (detectionsResult) {
    detections.value = detectionsResult
    formData.append('detected', detections.value?.map(detection => `${detection.label} @ ${[detection.box.xmin, detection.box.ymin, detection.box.xmax, detection.box.ymax].join()}`).join(';'))
  }

  const { choices } = await $fetch('/api/aggregation', {body: formData, method: 'POST'})
  aiResponse.value =  JSON.parse(choices?.[0]?.message?.content || {});


  pending.value = false
}




</script>