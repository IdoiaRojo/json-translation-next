// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {CSV_PROMPT, JSON_PROMPT} from '@/helpers/propms';
import type {NextApiRequest, NextApiResponse} from 'next';
import {Configuration, OpenAIApi} from 'openai';

export const fillKeys = async ({
  inputLanguage,
  object,
  openai,
  outputLanguage,
}: {
  object: Record<string, string>;
  inputLanguage: string;
  outputLanguage: string;
  openai: OpenAIApi;
}) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        content:
          'You are a bot that fills in the blanks of a locales JSON. The user provides you a JSON with a field named "keyLanguage", which defines the language the keys of the JSON are defined in. It also has a field named "outputLanguage", which defines the language you should translate the keys to. The last field is named "keys", which includes the object with the keys to translate. If a key already has a value, just leave it like this, otherwise fill the empty string with a translation, which best fits the key. I give you an example input: {"keyLanguage": "English", outputLanguage: "German", "keys": {"hello": "", "world": ""}}. The output should be {"hello": "Hallo", "world": "Welt"}.',
        role: 'system',
      },
      {
        content: JSON.stringify({
          keyLanguage: inputLanguage,
          outputLanguage,
          keys: object,
        }),
        role: 'user',
      },
    ],
  });

  return completion.data.choices[0].message.content;
};

export const translateKey = async ({
  inputLanguage,
  object,
  openai,
  outputLanguage,
  prompt,
}: {
  object: Record<string, string>;
  inputLanguage: string;
  outputLanguage: string;
  openai: OpenAIApi;
  prompt: 'json' | 'csv';
}) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        content: prompt === 'json' ? JSON_PROMPT : CSV_PROMPT,
        role: 'system',
      },
      {
        content: JSON.stringify({
          inputLanguage,
          outputLanguage,
          data: object,
        }),
        role: 'user',
      },
    ],
  });

  return completion.data.choices[0].message.content;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    !req.body.openAIKey ||
    !req.body.text ||
    !req.body.inputLanguage ||
    !req.body.outputLanguage ||
    !req.body.mode
  ) {
    res.status(400).json({error: 'Please provide all required parameters'});
    return;
  }

  if (!Boolean(process.env.OPENAI_KEY) && !req.body.openAIKey) {
    res.status(400).json({error: 'Please provide an OpenAI API key'});
    return;
  }

  const configuration = new Configuration({
    // apiKey: req.body.key ? req.body.key : process.env.OPENAI_KEY,
    apiKey: req.body.openAIKey,
  });

  const openai = new OpenAIApi(configuration);

  const localesObject = JSON.parse(req.body.text as string);

  //split localesObject into an array of objects with 30 keys each
  const keys = Object.keys(localesObject);
  const values = Object.values(localesObject);
  const chunks = keys.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 30);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push({[item]: values[index]});

    return resultArray;
  }, []);

  let results;
  try {
    results = await Promise.all(
      chunks.map(async (chunk) => {
        if (req.body.mode === 'fillEmpty') {
          return fillKeys({
            object: Object.assign({}, ...chunk),
            inputLanguage: req.body.inputLanguage as string,
            outputLanguage: req.body.outputLanguage as string,
            openai,
          });
        } else {
          return translateKey({
            object: Object.assign({}, ...chunk),
            inputLanguage: req.body.inputLanguage as string,
            outputLanguage: req.body.outputLanguage as string,
            openai,
            prompt: req.body.prompt,
          });
        }
      })
    );
  } catch (error) {
    res.send({
      success: false,
      error: "The request couldn't be processed. Maybe the API key is invalid?",
    });
    return;
  }

  let parsedResults;

  try {
    parsedResults = results.map((result) => JSON.parse(result));
  } catch (error) {
    res.send({
      success: false,
      error: "The result couldn't be parsed. Please try again.",
    });

    return;
  }

  const finalResult = Object.assign({}, ...parsedResults);

  res.send({
    success: true,
    data: finalResult,
  });
}
