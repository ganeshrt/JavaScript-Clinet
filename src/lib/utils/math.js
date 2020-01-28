
export const getRandomNumber = num => Math.floor(Math.random() * Math.floor(num));

export const getNextRoundRobin = (currentNum, totalNum) => (((currentNum + 1) % totalNum));
