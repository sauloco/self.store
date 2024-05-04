<template>
<div class="flex items-center">
  <div>{{ `${objectTitleCase} ${object.metadata.brand} ${object.metadata.model}` }}</div>
</div>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

interface Props {
  object: {
    object: string,
    detectedBy: "segment" | "openai",
    boundingBox: {
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

const objectTitleCase = useChangeCase(props.object.object, 'sentenceCase')
</script>