//Retorna las horas y minutos a partir de un tiempo en ms
export const getHoursAndMinutes = (time = 0) => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time - hours * 3600000) / 60000);
  return { hours, minutes };
};
