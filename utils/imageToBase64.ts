import {type EventHandlerRequest, H3Event, readFormData} from "h3";
import {returnStatement} from "@babel/types";

export const imageToBase64 = async (event: H3Event<EventHandlerRequest>) => {

    const {buffer, imageFile, detected} = await imageToBuffer(event)

    return {
        base64: `data:${imageFile.type};base64,${buffer.toString('base64')}`,
        imageFile,
        detected
    }
}

export const imageToBuffer = async (event: H3Event<EventHandlerRequest>) => {
    const formData = await readFormData(event)
    const imageFile  = formData.get('file') as File
    const detected  = formData.get('detected') as string

    const blob = new Blob([imageFile], { type: 'image/png' });
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer)
    return {
        imageFile,
        buffer,
        detected
    }
}