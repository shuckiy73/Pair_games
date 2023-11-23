(() => {
  let clickCount = 0;
  let successPair = 0;
  let firstClick = '';
  let secondClick = '';
  let thirdClick = '';
  let timerId = '';

  function inactionTimer() {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      document.querySelector('.pair-list').innerHTML = '';
      clickCount = 0;
      successPair = 0;
      firstClick = '';
      secondClick = '';
      thirdClick = '';
      timerId = '';
    }, 60000);
  }

  function createArrayNumbers(maxCounCards) {
    let numbersArray = [];
    let startNumber = 1;

    for (let i = 1; i <= maxCounCards / 2; i++) {
      numbersArray.push(startNumber);
      numbersArray.push(startNumber);
      if (startNumber < 8) startNumber++;
      else startNumber = 1;
    }

    return numbersArray;
  }

  function shuffledArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createCard(cardNumber, columnsNumber, maxCounCards) {
    const card = document.createElement('li');
    const numberInner = document.createElement('div');

    card.classList.add('pair-list__item');
    card.style.width = `calc(100% /${columnsNumber})`;
    card.style.height = '250px';
    numberInner.classList.add('pair-list__number');
    numberInner.textContent = cardNumber;
    card.append(numberInner);

    card.addEventListener('click', () => {
      clickCount++;

      card.classList.add('pair-list__item--opened');
      card.style.pointerEvents = 'none';

      if (clickCount === 1) {
        firstClick = card;
      } else if (clickCount === 2) {
        secondClick = card;

        if (firstClick.textContent === secondClick.textContent) {
          firstClick.classList.add('pair-list__item--success');
          secondClick.classList.add('pair-list__item--success');
          ++successPair;
        }
      } else if (clickCount === 3) {
        thirdClick = card;
        if (firstClick.textContent !== secondClick.textContent) {
          firstClick.classList.remove('pair-list__item--opened');
          secondClick.classList.remove('pair-list__item--opened');
          firstClick.style.pointerEvents = 'auto';
          secondClick.style.pointerEvents = 'auto';
        }
        firstClick = thirdClick;
        clickCount = 1;
      }

      if (successPair === maxCounCards / 2) {
        resetGame(maxCounCards, columnsNumber);
      }
      inactionTimer();
    });

    return card;
  }

  function resetGame(maxCounCards, columnsNumber) {
    const resetButton = document.createElement('button');
    const buttonRow = document.createElement('div');

    resetButton.textContent = 'Сыграть ещё раз';
    resetButton.classList.add('btn', 'btn-primary');
    buttonRow.classList.add('col-md-12', 'btn-wrapper');

    buttonRow.append(resetButton);
    const cardsField = document.querySelector('.pair-list');

    cardsField.after(buttonRow);

    resetButton.addEventListener('click', () => {
      const newNumbers = shuffledArray(createArrayNumbers(maxCounCards));
      cardsField.querySelectorAll('li').forEach((e) => e.remove());
      for (const newNumber of newNumbers) {
        cardsField.append(createCard(newNumber, columnsNumber, maxCounCards));
      }
      successPair = 0;
      resetButton.remove();
    });
  }

  function createStartForm() {
    const startFormHeader = document.createElement('h2');
    const startFormSubHeader = document.createElement('p');
    const startForm = document.createElement('form');
    const enteredColumns = document.createElement('input');
    const enteredRows = document.createElement('input');
    const startButton = document.createElement('button');

    startFormHeader.textContent = 'Введите количество карточек';
    startFormHeader.classList.add('mb-3', 'col-md-12', 'text-center');

    startFormSubHeader.textContent = 'Чётное число от 2 до 10';
    startFormSubHeader.classList.add('mb-3', 'col-md-12', 'text-center');

    enteredRows.classList.add('mr-3');
    enteredRows.placeholder = 'По горизонтали';
    enteredRows.value = 4;

    enteredColumns.classList.add('mr-3');
    enteredColumns.placeholder = 'По вертикали';
    enteredColumns.value = 4;

    startButton.classList.add('btn', 'btn-primary');
    startButton.textContent = 'Начать игру';

    startForm.classList.add('input-group', 'mb-3', 'col-md-12', 'justify-content-center');

    startForm.append(enteredColumns);
    startForm.append(enteredRows);
    startForm.append(startButton);

    return {
      startFormHeader,
      startFormSubHeader,
      startForm,
      enteredColumns,
      enteredRows,
      startButton,
    };
  }

  function createPairApp(container) {
    const cardsRow = container.querySelector('.pair-list');
    const enteredForm = createStartForm();
    cardsRow.before(enteredForm.startFormHeader);
    cardsRow.before(enteredForm.startFormSubHeader);
    cardsRow.before(enteredForm.startForm);

    enteredForm.startForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formsInput = enteredForm.startForm.querySelectorAll('input');
      const resetBtn = container.querySelector('.btn-wrapper');

      if (resetBtn) {
        resetBtn.remove();
      }

      for (let inp of formsInput) {
        if (inp.value % 2 !== 0 || (inp.value > 10 || inp.value < 2) || Number.isNaN(inp.value)) {
          inp.value = 4;
        }
      }

      let maxCounCards = enteredForm.enteredColumns.value * enteredForm.enteredRows.value;
      cardsRow.querySelectorAll('li').forEach((el) => el.remove());
      const shuffledNumbers = shuffledArray(createArrayNumbers(maxCounCards));

      for (const number of shuffledNumbers) {
        cardsRow.append(createCard(number, enteredForm.enteredColumns.value, maxCounCards));
      }
      successPair = 0;
      inactionTimer();
    });
  }
  window.createPairApp = createPairApp;
})();
