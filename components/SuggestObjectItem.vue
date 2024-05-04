<template>
  <div class="flex items-center w-full">
    <fieldset>
      <legend class="block text-sm font-medium leading-6 text-gray-900">{{ objectRef.object }}</legend>
      <span class="text-sm text-slate-300">{{ objectRef.shortDescription }}</span>
      <div class="mt-2 -space-y-px rounded-md bg-white shadow-sm">
        <div>
          <label :for="`card-object-${objectRef.object}`" class="sr-only">Object</label>
          <input type="text" v-model="objectRef.object" name="card-number" :id="`card-object-${objectRef.object}`"
                 class="relative block w-full rounded-none rounded-t-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="Object"/>
        </div>
        <div>
          <label :for="`card-brand-${objectRef.object}`" class="sr-only">Brand</label>
          <input type="text" v-model="objectRef.metadata.brand" name="card-number"
                 :id="`card-brand-${objectRef.object}`"
                 class="relative block w-full rounded-none border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="Brand"/>
        </div>
        <div>
          <label :for="`card-model-${objectRef.object}`" class="sr-only">Model</label>
          <input type="text" v-model="objectRef.metadata.model" :name="`card-model-${objectRef.object}`"
                 :id="`card-model-${objectRef.object}`"
                 class="relative block w-full rounded-none border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="Model"/>
        </div>
        <div>
          <label :for="`card-type-${objectRef.object}`" class="sr-only">Type</label>
          <input type="text" v-model="objectRef.metadata.type" :name="`card-type-${objectRef.object}`"
                 :id="`card-type-${objectRef.object}`"
                 class="relative block w-full rounded-none border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="Type"/>
        </div>
        <div class="flex -space-x-px">
          <div
              class="relative center w-1/2 min-w-0 flex gap-2 flex-1 w-full rounded-none rounded-bl-md border-0 items-center px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <div v-for="color in objectRef.metadata?.colorsHex"
                 class="w-6 h-6 border-1 border-black shadow-md rounded-md" :style="{'background-color': color}"
                 :key="color" :title="getColorName(color)"></div>
          </div>
          <div class="min-w-0 flex-1">
            <label :for="`card-detected-by-${objectRef.object}`" class="sr-only">Type</label>
            <input type="text" v-model="objectRef.detectedBy" disabled :name="`card-detected-by-${objectRef.object}`"
                   :id="`card-detected-by-${objectRef.object}`"
                   class="relative block w-full rounded-none rounded-br-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   placeholder="Detected by"/>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import {useChangeCase} from '@vueuse/integrations/useChangeCase'
import useColorName from '../utils/NameThatColor'

const getColorName = (color: string) => {
  const [, name] = useColorName(color)
  return name
}

interface Props {
  object: {
    object: string,
    detectedBy: "segment" | "openai",
    boundingBox?: {
      left: number,
      top: number,
      width: number,
      height: number
    },
    shortDescription?: string,
    metadata?: {
      brand?: string,
      model?: string,
      colorsHumanReadable?: string[],
      colorsHex?: string[],
      type?: string
    }
  }
}


const props = defineProps<Props>()

const objectRef = ref({
  object: props.object.object,
  detectedBy: props.object.detectedBy,
  boundingBox: props.object.boundingBox || {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
  shortDescription: props.object.shortDescription || '',
  metadata: props.object.metadata || {
    brand: "",
    model: "",
    colorsHumanReadable: [],
    colorsHex: [],
    type: ""
  }
})


</script>