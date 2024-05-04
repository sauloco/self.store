import { HfInference } from '@huggingface/inference'
import {imageToBuffer} from "~/utils/imageToBase64";

const hf = new HfInference(process.env.HF_USER_ACCESS_TOKEN)

export default defineEventHandler(async (event) => {

    const {buffer: data} = await imageToBuffer(event)

    const result = await hf.imageSegmentation({
        data,
        model: 'facebook/detr-resnet-50-panoptic'
    })

    console.log(result)

    return result

})

