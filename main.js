(()=>{
    //объявляем функцию которая создает и возвращает заголовок
    function createGameAppTitle(title) {
        let appTitle = document.createElement('h1');
        appTitle.textContent = title;
        return appTitle;
    }

    //создаем форму с инпутом и кнопкой и возвращаем их
    function createGameAppForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let startButton = document.createElement('button');

        form.textContent = 'Количество карточек по вертикали/горизонтали';
        startButton.textContent = 'Начать игру';
        input.classList.add('form-control');
        input.type = 'text';
        startButton.classList.add('btn-start');
        input.placeholder = 'Введите четное число от 2 до 10';

       form.append(input);
       form.append(startButton);

        return {
            form,
            input,
            startButton
        }
    }
    
    let timer; // для setTimeout;

    //Отрисовываем формы и делаем валидность
    function getGameApp() {
        const formContainer = document.querySelector('.header');
        const gameAppTitle = createGameAppTitle('Игра в пары');
        const gameAppForm = createGameAppForm();

        formContainer.append(gameAppTitle);
        formContainer.append(gameAppForm.form);

        //вешаем обработчик событий на отправку формы
        gameAppForm.form.addEventListener('submit', (e)=> {
            e.preventDefault();
            const inputValue = gameAppForm.input.value;
            if (!inputValue) {
                return;
            }
            // инструкции по валидации формы
            const validNumber = checkValidation(inputValue);
            if (!validNumber) {
                gameAppForm.input.value = '4';
            } else {
                gameAppForm.input.value = '';
                gameAppForm.startButton.disabled = true;
                // задали длительность игры
                timer = setTimeout(()=>{
                    alert('Время вышло');
                    window.location.reload();
                }, 120000);
                // создание поля карточек
                startOfGame(Math.pow(validNumber, 2));
            } 
        })
    }

    //Проверка на валидность
    function checkValidation(number) {
        if (number > 1 && number < 11) {
            if (!(number % 2)) {
                return number;
            }
        }
        return null;
    }

    //перемешивание значений массива 
    function shuffle(array) {
        for (let i = array.length - 1; i>0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let t = array[i];
            array[i] = array[j];
            array[j] = t;
        } return array
    }

    //создание блока (списка) с карточками
    function createCardList() {
        const list = document.createElement('ul');
        list.classList.add('cards-list');
        return list
    }

    //создание одной карточки с атрибутами
    function createCard(idValue, numberOfCards) {
        const containerWidth = document.querySelector('.main-block').offsetWidth;
        const cardWidth = containerWidth * 0.85 / (Math.sqrt(numberOfCards));
        const card = document.createElement('li');
        const button = document.createElement('button');

        card.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth}px`);
        card.classList.add('el');
        button.classList.add('btn', 'btn-primary');
        button.id = idValue;
        button.setAttribute('style', `font-size: ${cardWidth * 0.7}px;`);

        card.append(button);

        return {
            card,
            button
        }
    }

    function startOfGame(numberOfCards) {
        let arrayOfCards = [];
        let valuesOfCards = numberOfCards / 2;

        for (let i = 0; i < numberOfCards; i++) {
            arrayOfCards.push(valuesOfCards);
            if (i % 2) {
                --valuesOfCards;
            }
        }

        const shuffledArray = shuffle(arrayOfCards); //перемешиваем массив

        createListOfCards(numberOfCards, shuffledArray); //создаем карточки
    }

    let numberOfCoincidences = 0;

    function createListOfCards(numberOfCards, shuffledArray) {
        const section = document.querySelector('.main-block');
        const listOfCards = createCardList();

        for (let i =0; i < numberOfCards; i++) {
            let currentCard = createCard(i, numberOfCards);
            listOfCards.append(currentCard.card);
            currentCard.button.addEventListener('click', ()=> {
                let valueOfCard = shuffledArray[currentCard.button.id];
                currentCard.button.innerHTML = valueOfCard;
                comparePairs(currentCard, valueOfCard);                     //
                if (numberOfCards === numberOfCoincidences * 2) {
                    playAgain();                                            //
                }
            })
        }
        section.appendChild(listOfCards);
    }

    let firstNumberObj = {}; //для записи  значения первой карточки {card: currentCard, value: valueOfCard}
    let secondNumberObj = {}; // для записи значения второй карточки
    let isEqual = false;

    function comparePairs(card, value) {
        if (!Object.keys(firstNumberObj).length) { //если значение первой карты пустое - записываем переданное значение
            firstNumberObj = {
                card: card,
                value: value
            };
            card.button.setAttribute('disabled', 'true');
        } else if (!Object.keys(secondNumberObj).length) { //если значение второй карты пустое - записываем переданное значение
            secondNumberObj = {
                card: card,
                value: value
            };
            card.button.setAttribute('disabled', 'true');

            if (firstNumberObj.value === secondNumberObj.value) {
                isEqual = true;
                ++numberOfCoincidences;
                return;
            } 
        }  else { //если есть значение первой и второй карты
            if (!isEqual) {
                firstNumberObj.card.button.innerHTML = '';
                secondNumberObj.card.button.innerHTML = '';
                firstNumberObj.card.button.removeAttribute('disabled');
                secondNumberObj.card.button.removeAttribute('disabled');
            } else {
                isEqual = false;
            }

            firstNumberObj = {
                card: card,
                value: value
            };

            card.button.setAttribute('disabled', 'true');
            secondNumberObj = {};
        }
    }

    function playAgain() {
        const section = document.querySelector('.main-block');
        const button = document.createElement('button');
        button.textContent = 'Сыграть ещё раз';
        button.classList.add('btn-restart');
        section.after(button);

        clearTimeout(timer);

        button.addEventListener('click', ()=> {
            window.location.reload();
        })
    }

    document.addEventListener('DOMContentLoaded', ()=> {
        getGameApp();
    })

})();