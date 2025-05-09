const totalMs = 72100000; // Example total milliseconds

const hours = Math.floor(totalMs / (1000 * 60 * 60));
const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

console.log(`Total time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);