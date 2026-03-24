'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce(function (acc, mov) {
    return (acc += mov);
  });
  labelBalance.textContent = `${balance}€`;
};
calcDisplayBalance(account1.movements);

const calcDisplaySummery = function (movements) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // ternary to
  const interest = movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * 1.2) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int > 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummery(account1.movements);
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// console.log(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(1, -1));
// console.log([...arr], 'sasas');

// splice : it changes the original

// console.log(arr.splice(1, 2));
// console.log(arr);

// reverse: mutateeeee

const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// conacat

const letters = arr.concat(arr2);
// console.log([...arr, ...arr2], 'spread');
// console.log(letters, 'concat');

// join

// console.log(letters.join('-'));

// new (at) instead of []
// getting the last element of an array
// console.log(arr.at(-1)); // perfect for chaining
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log('jon'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    // console.log(`You deposited ${i + 1}`);
  } else {
    // console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

// console.log('-------forEach--------');
// no continue or break
movements.forEach(function (movement, index) {
  if (movement > 0) {
    // console.log(`You deposited ${(movement, index)}`);
  } else {
    // console.log(`You withdrew ${(movement, index)}`);
  }
});

// map

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // set

// const currenciesUnique = new Set(['USD', 'EUR', 'GBP']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

const eurToUsd = 1.1;

// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
const movementsUsd = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsd);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
// console.log(movementsDescriptions);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
// console.log(movements);
// console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
// console.log(withdrawals);

// data transformation method
// to boil values of an array to a single value
// console.log(movements);
// accumulator -> snowball
const balance = movements.reduce((acc, cur) => (acc += cur), 100);
// console.log('balance', balance);

let balance2 = 100;
for (const mov of movements) balance2 += mov;
// console.log(balance2);

// maximum value

const maxNum = movements.reduce(function (max, mov) {
  max < mov ? (max = mov) : max;
  return max;
}, movements[0]);

// console.log(maxNum);

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages 
and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), 
and does the following things in order:

1. Calculate the dog age in human years using the following formula: 
    if the dog is <= 2 years old, humanAge = 2 * dogAge. 
    If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old 
(which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs 
(you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
const ages = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAges = function (arr) {
//   return arr
//     .map(function (dogAge) {
//       let humanAge = 0;
//       if (dogAge <= 2) {
//         humanAge = 2 * dogAge;
//       } else humanAge = 16 + dogAge * 4;
//       return humanAge;
//     })
//     .filter(function (dogAge) {
//       return dogAge > 18;
//     })
//     .reduce(function (acc, cur) {
//       acc += cur;
//       return acc / arr.length;
//     });
// };

// console.log(calcAverageHumanAges(ages));

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);
  // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  const average = adults.reduce(age => age, 0) / adults.length;

  //
  return average;
};
const average1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log(average1);

//pipeline
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);
