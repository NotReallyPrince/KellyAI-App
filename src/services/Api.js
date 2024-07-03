import axios from "axios";
import { APIKEY, BASE_URL } from "../../config";

export const getChatResponse = async (chatbot, msg) => {
  const response = await axios.post(
    `${BASE_URL}/chat/${chatbot}`,
    {
      prompt: msg,
      character: "KellyAI",
    },
    {
      headers: {
        Authorization: "Bearer " + APIKEY, 
      },
    }
  );
  const data = response.data.message;
  return data
};

export const getImageResponse = async (prompt, model) => {
  const response = await axios.post(
    `${BASE_URL}/image/generate`,
    {
      prompt: prompt,
      model: model,
    },
    {
      headers: {
        Authorization: "Bearer " + APIKEY, 
      },
    }
  );
  const data = response.data.image;
  return data
};