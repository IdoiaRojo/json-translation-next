export const formatTime = (time) => {
  const seconds = Math.floor(time / 1000); // Convertir milisegundos a segundos
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  }
};
