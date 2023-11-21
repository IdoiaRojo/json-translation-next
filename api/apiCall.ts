import {FormTranslation} from '@/types/FormTranslation';

export const apiCall = async ({
  text,
  inputLanguage,
  outputLanguage,
  mode,
  openAIKey,
}: {
  text: string;
  inputLanguage: FormTranslation['inputLanguage'];
  outputLanguage: FormTranslation['outputLanguage'];
  mode: FormTranslation['mode'];
  openAIKey: FormTranslation['openAIKey'];
}): Promise<any> => {
  try {
    const response = await fetch('/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        inputLanguage,
        outputLanguage,
        mode,
        openAIKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const responseData = await response.json();

    if (!responseData.success) {
      console.error('API request was not successful:', responseData.error);
      return null;
    }

    const translationsArray = Object.values(
      responseData.data.data || responseData.data
    );
    return {data: translationsArray};
  } catch (error) {
    console.error('An error occurred while making the API request:', error);
    return null;
  }
};

/* export const apiCall = async ({
  text,
  inputLanguage,
  outputLanguage,
  mode,
  openAIKey,
  returnRandom = true,
}: {
  text: string;
  inputLanguage;
  outputLanguage;
  mode;
  openAIKey;
  returnRandom?: boolean;
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Genera un número aleatorio entre 0 y 1
      const randomValue = Math.random();
      // Devuelve null aproximadamente el 10% del tiempo (ajusta este valor según tus necesidades)
      if (returnRandom && randomValue < 0.3) {
        resolve(null);
      }

      const data = {
        '0': "Nous n'avons pas trouvé les informations demandées en fonction de cette entrée",
        '1': "Nous n'avons pas pu enregistrer l'entrée en fonction de cette entrée",
        '2': 'Les informations reçues ne sont pas valables pour cette action',
        '3': 'Les entrées reçues sont invalides ou obsolètes',
        '4': "L'authentification via %{provider} Omniauth a échoué",
        '5': 'La déconnexion a échoué',
        '6': 'Cet utilisateur ne possède pas les informations requises',
        '7': "L'utilisateur n'est pas un patient",
        '8': "L'e-mail ne correspond pas à l'utilisateur",
        '9': "« Paypal n'a pas pu traiter le paiement, veuillez réessayer »",
      };
      const translationsArray = Object.values(data);

      resolve({
        data: translationsArray,
      });
    }, 1500); // Simula una respuesta después de 2 segundos
  });
};
*/
