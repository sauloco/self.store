import { HfInference } from '@huggingface/inference'
import {imageToBuffer} from "~/utils/imageToBase64";

const hf = new HfInference(process.env.HF_USER_ACCESS_TOKEN)

export default defineEventHandler(async (event) => {

    const {buffer: data} = await imageToBuffer(event)

    return hf.objectDetection({
        data,
        model: 'facebook/detr-resnet-101-dc5'
    })

})

