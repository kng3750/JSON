import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sceneProperties = {
  scene_number: {
    type: Type.INTEGER,
    description: "The sequential number of the scene.",
  },
  description: {
    type: Type.STRING,
    description: "A detailed description of what happens in this scene.",
  },
  setting: {
    type: Type.STRING,
    description: "The location and time of day for the scene (e.g., 'A futuristic city at night', 'A serene beach at sunrise').",
  },
  characters: {
    type: Type.ARRAY,
    description: "A list of characters present in the scene.",
    items: { type: Type.STRING },
  },
  actions: {
    type: Type.ARRAY,
    description: "Key actions performed by characters or elements in the scene.",
    items: { type: Type.STRING },
  },
  camera_shot: {
    type: Type.STRING,
    description: "The type of camera shot to be used (e.g., 'close-up shot', 'wide angle shot', 'drone shot flying over a forest').",
  },
};

const promptDetailsProperties = {
  title: {
    type: Type.STRING,
    description: "A short, catchy title for the video.",
  },
  description: {
    type: Type.STRING,
    description: "A one-sentence summary of the video's content.",
  },
  style: {
    type: Type.STRING,
    description: "The overall visual and artistic style of the video (e.g., cinematic, anime, documentary, vlog style, hyper-realistic 3D animation).",
  },
  scenes: {
    type: Type.ARRAY,
    description: "An array of scenes that make up the video.",
    items: {
      type: Type.OBJECT,
      properties: sceneProperties,
      required: ["scene_number", "description", "setting", "camera_shot"],
    },
  },
};

const videoPromptSchema = {
  type: Type.OBJECT,
  properties: {
    english: {
      type: Type.OBJECT,
      properties: promptDetailsProperties,
      required: ["title", "description", "style", "scenes"],
      description: "The video prompt details in English.",
    },
    korean: {
      type: Type.OBJECT,
      properties: promptDetailsProperties,
      required: ["title", "description", "style", "scenes"],
      description: "The video prompt details translated into natural Korean.",
    },
  },
  required: ["english", "korean"],
};

export const generateVideoPrompt = async (userInput: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a structured video prompt in both English and Korean based on the following description: "${userInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: videoPromptSchema,
        systemInstruction: "You are an expert prompt engineer specializing in video generation. Your task is to convert a user's natural language description into a detailed, structured JSON object containing both English and Korean versions. Ensure the Korean translation is natural and high-quality. Be creative and expand on the user's idea to create a compelling video concept."
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    return jsonText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
