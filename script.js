'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2026-02-05T16:33:06.386Z',
    '2026-03-21T14:43:26.374Z',

    '2026-03-25T18:49:59.371Z',
    '2026-03-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2026-02-05T16:33:06.386Z',
    '2026-03-10T14:43:26.374Z',
    '2026-03-25T18:49:59.371Z',
    '2026-03-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'standard',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
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

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDay()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));
  console.log(...combinedMovsDates);
  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date);

    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${movement.toFixed(2)}€</div>
      </div>
    
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return (acc += mov);
  });
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  // ternary to
  const interest = acc.movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int > 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
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

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummery(acc);
};

// event handlers
let currentAccount;

// Fake always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDay()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // clear Input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    console.log('Transfer Valid!');
    // currentAccount.balance -= amount;
    currentAccount.movements.push(-amount);

    // recieverAcc.balance += amount;
    recieverAcc.movements.push(amount);

    // add transfer.date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  } else {
    console.log('Transfer invalid!');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // add transfer.date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // delete account
    accounts.splice(index, 1);
    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

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

const calcAverageHumanAge = ages => {
  const average = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return average;
};
const average1 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(average1);

//pipeline
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

const withdrawal1 = movements.find(mov => mov < 0);
// console.log(withdrawal1);

// console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log('account', account);
for (const account of accounts)
  if (account.owner === 'Jessica Davis') {
    // console.log(account);
  }

// console.log(movements);
const lastWithdrawal = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawal);

const lastIndex = movements.findLastIndex(mov => mov > 0);
// console.log(movements[lastIndex]);
const anyDepo = movements.some(mov => mov > 0);
// console.log(anyDepo);

//every
// console.log(account4.movements.every(mov => mov > 0));

const arr1 = [
  [[1, 2], 3],
  [4, [5, 6]],
  [6, 7, 8],
];
// console.log(arr1.flat(2));

const accountMovments = accounts.flatMap(acc => acc.movements);
// console.log(accountMovments.reduce((acc, mov) => acc + mov));

///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

/*  */
const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

const Husky = breeds.find(breed => breed.breed === 'Husky').averageWeight;
// console.log(Husky);

// console.log(
//   breeds.find(
//     breed =>
//       breed.activities.includes('fetch') && breed.activities.includes('running')
//   ).breed
// );

// const allActivities = breeds.map(breed => breed.activities).flat();
const allActivities = breeds.flatMap(breed => breed.activities);
// console.log(allActivities);
const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming'))
      .flatMap(breed => breed.activities)
      .filter(activity => activity !== 'swimming')
  ),
];
// console.log(swimmingAdjacent);

//  1. Store the the average weight of a "Husky" in a variable "huskyWeight"
// const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
// console.log(huskyWeight);

// // 2. Find the name of the only breed that likes both
// // "running" and "fetch" ("dogBothActivities" variable)

// const dogBothActivities = breeds.find(
//   breed =>
//     breed.activities.includes('running') && breed.activities.includes('fetch')
// ).breed;
// console.log(dogBothActivities);

// // 3. Create an array "allActivities" of all the activities
// // of all the dog breeds
// // const allActivities = breeds.activities.flatMap();
// const allActivities = breeds.map(breeds => breeds.activities).flat();
// console.log(allActivities);

// // 4. Create an array "uniqueActivities" that
// // contains only the unique activities
// // (no activity repetitions).
// // HINT: Use a technique with a special
// // data structure that we studied a few sections ago.
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

// // 5. Many dog breeds like to swim.
// // What other activities do
// // these dogs like? Store all the
// // OTHER activities these breeds like to do,
// // in a unique array called "swimmingAdjacent".

// // const swimmingAdjacent = uniqueActivities.filter(
// //   activity => activity !== 'swimming'
// // );

// const swimmingAdjacent = [
//   ...new Set(
//     breeds.filter(breed => breed.activities.includes('swimming'))
//     // .flatMap(breed => breed.activities)
//     // .filter(activity => activity !== 'swimming')
//   ),
// ];
// console.log(swimmingAdjacent);

// // 6. Do all the breeds have an average weight
// //  of 10kg or more? Log to the console
// //  whether "true" or "false".

// // console.log(breeds.every(breeds => breeds.averageWeight < 10));

// // 7. Are there any breeds that are
// // "active"? "Active" means that the
// // dog has 3 or more activities.
// // Log to the console whether "true" or
// // "false".

// console.log(breeds.some(breeds => breeds.activities.length >= 3))

// //fetch
// const fetch = breeds
//   .filter(breed => breed.activities.includes('fetch'))
//   .map(breed => breed.averageWeight);
// const hev = Math.max(...fetch);
// console.log(hev);

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);
// Numbers
// return <0 a,b
// return >0 b,a
// console.log(movements);

// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return 1;
//     if (b > a) return -1;
//   })
// );

// console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawals'
);
// console.log(groupedMovements);

const groupedByAcivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;
  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  if (movementCount >= 0) return 'inactive';
});
// console.log(groupedByAcivity);

// const groupedAccounts = Object.groupBy(accounts, account => account.type);

const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
// console.log(groupedAccounts);

const x = new Array(7);
x.fill(22, 1, 3);
x.fill(45, 0, 1);
x.fill(634565, 3);

// console.log(x);
// console.log(x.map(() => 5));

// array.from
const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

const random = Array.from(
  { length: 100 },
  () => Math.floor(Math.random() * 100) + 1
);

// labelWelcome.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
// });

labelWelcome.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => +el.textContent.replace('€', '')
  );
  // console.log(movementsUI);
});
//destructive
// const reversedMov = movements.reverse();
const reversedMov = movements.toReversed();
// movements[1] = 2000;
const newMovements = movements.with(1, 2000);
// console.log(newMovements);
// console.log(movements);
// console.log(reversedMov);
// 1.
const bankDepositsSum = accounts.flatMap(acc => acc.movements);
// .filter(mov => mov > 0);
// .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositsSum);

// 2. how many deposits within the bank with atleast 1000
// filter or every
// console.log(bankDepositsSum.filter(mov => mov >= 1000).length);
// console.log(
//   bankDepositsSum.reduce(
//     (count, cur, i, arr) => (cur >= 1000 ? ++count : count),
//     0
//   )
// );
// ++ does increment but it returns the old value
//prefixed ++x

// 3. create a new object by reduce

const { adeposits, awithdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    function (sums, cur) {
      // cur > 0 ? (sums.adeposits += cur) : (sums.awithdrawals += cur);
      sums[cur > 0 ? 'adeposits' : 'awithdrawals'] += cur;
      return sums;
    },

    { adeposits: 0, awithdrawals: 0 }
  );
// console.log(adeposits, awithdrawals);

// 4. Title Case

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = [
    'and',
    'a',
    'an',
    'and',
    'the',
    'but',
    'or',
    'on',
    'in',
    'with',
  ];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');

  return capitalize(titleCase);
};
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

labelWelcome.addEventListener('click', function (e) {
  e.preventDefault();

  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'green';
    if (i % 3 === 0) row.style.backgroundColor = 'lightgreen';
  });
});

// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);
