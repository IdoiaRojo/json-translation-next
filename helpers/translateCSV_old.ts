// import {FormTranslation} from '@/types/FormTranslation';
// import {LanguageObject} from '@/types/LanguageObject';
// import {apiCall} from './apiCall';

// export const translateCSV = async ({
//   file,
//   setFileChunks,
//   setTranslation,
//   setLanguagesObjects,
//   setTranslationStatus,
//   inputLanguage,
//   outputLanguages,
//   mode,
//   openAIKey,
// }) => {
//   const reader = new FileReader();
//   reader.onload = async (event) => {
//     if (event.target) {
//       const csvContent = event.target.result as string;
//       try {
//         const lines = csvContent.split('\n');
//         const translations = lines.map((line) => line.trim());
//         setTranslation({[inputLanguage]: translations});

//         const chunkSize = 10;
//         const chunks: {data: string[]; position: number}[] = [];
//         for (let i = 0; i < translations.length; i += chunkSize) {
//           const chunk = translations.slice(i, i + chunkSize);
//           chunks.push({data: chunk, position: i / chunkSize});
//         }
//         setFileChunks(chunks);
//         const initialChunks: LanguageObject[] = outputLanguages.map((key) => ({
//           key,
//           status: 'pending',
//           chunksCount: chunks.length,
//         }));
//         setLanguagesObjects(initialChunks);
//         setTranslationStatus('loading');

//         for (const lang of outputLanguages) {
//           const startTime = Date.now();
//           let stopLoop = false;
//           updateTranslationStatus(lang, 'loading', setLanguagesObjects, 0);
//           for (const chunk of chunks) {
//             const result = await translateChunk({
//               lang,
//               data: chunk.data,
//               inputLanguage,
//               mode,
//               setTranslation,
//               openAIKey,
//               setLanguagesObjects,
//               chunkPosition: chunk.position,
//               startTime,
//             });

//             if (!result) {
//               updateTranslationStatus(
//                 lang,
//                 'error',
//                 setLanguagesObjects,
//                 chunk.position,
//                 startTime
//               );
//               stopLoop = true; // Establece la variable de control para detener el bucle
//               break; // Sale del bucle
//             }
//             updateTranslationStatus(
//               lang,
//               'loading',
//               setLanguagesObjects,
//               chunk.position
//             );
//           }

//           if (stopLoop) {
//             break; // Sale del bucle externo si la variable de control está establecida
//           }
//           updateTranslationStatus(
//             lang,
//             'completed',
//             setLanguagesObjects,
//             chunks.length,
//             startTime
//           );
//         }

//         setTranslationStatus('finished');
//       } catch (error) {
//         console.error('Error al parsear el archivo JSON:', error);
//       }
//     }
//   };

//   reader.readAsText(file.file);
// };

// export const translateChunk = async ({
//   lang,
//   data,
//   inputLanguage,
//   mode,
//   setTranslation,
//   openAIKey,
//   setLanguagesObjects,
//   chunkPosition,
//   startTime,
// }: {
//   lang: string;
//   data: string[];
//   inputLanguage: FormTranslation['inputLanguage'];
//   mode: FormTranslation['mode'];
//   setTranslation: FormTranslation['setTranslation'];
//   openAIKey: string;
//   setLanguagesObjects: FormTranslation['setLanguagesObjects'];
//   chunkPosition: number;
//   startTime?;
// }) => {
//   try {
//     const translation = await apiCall({
//       text: JSON.stringify(data),
//       inputLanguage,
//       outputLanguage: lang,
//       mode,
//       openAIKey,
//     });

//     if (translation) {
//       setTranslation((prevTranslations) => {
//         const newTranslation = {...prevTranslations};
//         if ((prevTranslations as object)[lang]) {
//           newTranslation[lang] = [
//             ...(prevTranslations as object)[lang],
//             ...translation.data,
//           ];
//         } else {
//           newTranslation[lang] = [...translation.data];
//         }

//         return newTranslation;
//       });
//       return true;
//     } else {
//       updateTranslationStatus(
//         lang,
//         'error',
//         setLanguagesObjects,
//         chunkPosition,
//         startTime
//       );
//       console.log('apiCall fallando');
//       // updateLanguageObjectStatus({key, status: 'error', setLanguagesObjects, time});
//       return null;
//     }
//   } catch (error) {
//     // const time = Date.now() - startTime;
//     console.error('Error al traducir el chunk:', error);
//     return null;
//     // updateLanguageObjectStatus({key, status: 'error', setLanguagesObjects, time});
//   }
// };

// const updateTranslationStatus = (
//   lang: string,
//   status: LanguageObject['status'],
//   setLanguagesObjects: (
//     updateFunc: (prev: LanguageObject[]) => LanguageObject[]
//   ) => void,
//   position: number,
//   startTime?: number
// ) => {
//   const time = startTime !== undefined ? Date.now() - startTime : undefined;

//   updateLanguageObjectStatus({
//     key: lang,
//     status,
//     setLanguagesObjects,
//     position,
//     time,
//   });
// };

// export const updateLanguageObjectStatus = ({
//   key,
//   status,
//   translation,
//   setLanguagesObjects,
//   time,
//   position,
// }: {
//   key: string;
//   setLanguagesObjects;
//   position: LanguageObject['chunkPosition'];
//   status?: LanguageObject['status'];
//   translation?: LanguageObject['translation'];
//   time?: LanguageObject['time'];
// }) => {
//   setLanguagesObjects((prevChunksStatus: LanguageObject[]) =>
//     prevChunksStatus.map((chunk) => {
//       return chunk.key === key
//         ? {
//             ...chunk,
//             ...(status !== undefined && {status}),
//             ...(translation !== undefined && {translation}),
//             ...(time !== undefined && {time}),
//             chunkPosition: position,
//           }
//         : chunk;
//     })
//   );
// };
