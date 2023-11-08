function isEven(number) {
  return number % 2 === 0;
}

function sumEvenFibonacci(limit) {
  let a = 1;
  let b = 2;
  let sum = 0;

  while (a < limit) {
    if (isEven(a)) {
      sum += a;
    }
    const nextElement = a + b;
    a = b;
    b = nextElement;
  }
  return sum;
}

const result = sumEvenFibonacci(4000000);
console.log(result);

/**
 * ? How does it work ?
 * In the terminal go to the 'exo1' folder and run `node app.js` to see the result in the terminal
 */
