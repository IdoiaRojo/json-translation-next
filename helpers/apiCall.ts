export const apiCall = async ({
  text,
  inputLanguage,
  outputLanguage,
  mode,
}: {
  text: string;
  inputLanguage;
  outputLanguage;
  mode;
}): Promise<any> => {
  /* try {
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

    return responseData.data.inputLanguage
      ? responseData.data.data
      : responseData.data;
  } catch (error) {
    console.error('An error occurred while making the API request:', error);
    return null;
  } */

  return new Promise((resolve) => {
    setTimeout(() => {
      // Genera un número aleatorio entre 0 y 1
      const randomValue = Math.random();
      console.log(randomValue);
      // Devuelve null aproximadamente el 10% del tiempo (ajusta este valor según tus necesidades)
      if (randomValue < 0.3) {
        resolve(null);
      } else {
        // Devuelve una respuesta simulada después de 2 segundos
        resolve({
          image_text: 'We take care of your well-being',
          login: {
            email_verified: '',
            go_to_sign_up: 'Create it here',
            oauth: {
              azure: 'Microsoft sign-in',
              facebook: 'Sign in with Facebook',
              google: 'Login with Google',
            },
            password_forgot: 'Forgotten password',
            submit: 'Sign in',
            subtitle: 'New user?',
            title: 'Welcome 👋',
            wrong_credentials:
              'Invalid email or password. For safety reasons, after 10 failed attempts your account will be locked for 60 minutes.',
          },
        });
      }
    }, 2000); // Simula una respuesta después de 2 segundos
  });
};
