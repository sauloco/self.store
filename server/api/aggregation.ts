import OpenAI from "openai";
import {readFormData} from "h3";
import {imageToBase64} from "~/utils/imageToBase64";
import {SymbolKind} from "vscode-languageserver-types";
import Array = SymbolKind.Array;
import Object = SymbolKind.Object;
import {isArray} from "@vue/devtools-shared";

const openai = new OpenAI();

export default defineEventHandler(async (event) => {

    const {base64, detected} = await imageToBase64(event);

    let detectedMessages = [];
    let detectedMessagesString = ''
    if (detected) {
        const detectedObjects = detected.split(';')
        for (const object of detectedObjects) {
            const sentence = `There is a ${object}. Flag it as detectedBy: 'segments'. `
            detectedMessagesString +=  sentence
            detectedMessages.push(
                {
                    type: "text",
                    text: sentence.trim()

// Add a short description of the ${object}.
// Provide any visible brand logos or unique features that could assist in determining the brand and model of the ${object}? if not possible provide the reason why.
// what is the best category to label the ${object}?
// what are the colors in hexadecimal of the ${object}?`,
                },
            )
        }

    }

    const messages =
        [
            {
                role: "system",
                content: `
[grounding] return a JSON array following the next schema describing all the objects in the image. 

const productSchema = z.object({objects: z.array(z.object({
  object: z.string(), // the name of the object
  detectedBy: z.string(), // the method used to detect the object 'openai' or 'segments'
  boundingBox?: z.object({ // the bounding box of the object
    left: z.number(),
    top: z.number(),
    width: z.number(),
    height: z.number()
  }),
  shortDescription: z.string(), // a short description of the object
  metadata: z.object({
    brand: z.string().optional(), // the brand from any visible logo or brand featured on the object
    model: z.string().optional(), // the model of the object
    colorsHex: z.array(z.string()), // the colors in hexadecimal of the object
    type: z.string().optional() // the category of the object
  })
}))});`,
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: base64,
                            detail: "low"
                        },
                    },
                    // ...detectedMessages,
                    {
                        type: "text",
                        text: `${detectedMessagesString}
[grounding] recognize more objects.
Flag them as detectedBy: 'openai'.`,
                    }
                ],
            },
        ]

    console.log(JSON.stringify(messages, (key, value) => key === 'url' ? "ImageBase64String" : value, 2))

    return openai.chat.completions.create({
        model: "gpt-4-turbo",
        response_format: {type: "json_object"},
        messages,
        // max_tokens: 300
        seed: 22
    });
})