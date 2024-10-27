'use strict';

// Підключаємо бібліотеку "flatpickr" - бібліотека для вибору дати й часу, разом із її CSS-стилями, щоб календар виглядав гарно.
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Підключаємо бібліотеку "iziToast" - бібліотека для виведення повідомлень, разом із її стилями для коректного відображення сповіщень.
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо доступ до HTML-елементів на сторінці за допомогою document.querySelector
const startButton = document.querySelector('button[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

// Ініціалізуємо змінну userSelectedDate значенням null. Це потрібно для того, щоб у подальшому зберегти дату й час, вибрані користувачем.
let userSelectedDate = null;

// Вимикаємо кнопку startButton (задаємо startButton.disabled = true;), щоб вона була неактивною на початку. Це необхідно для того, щоб користувач не зміг запустити таймер до вибору коректної дати.
startButton.disabled = true;

// Створюємо об'єкт options для налаштувань бібліотеки flatpickr, щоб налаштувати вибір дати та часу:
const options = {
  enableTime: true, // enableTime: дає можливість вибирати час, а не тільки дату.
  time_24hr: true, // time_24hr: використовує 24-годинний формат часу.
  defaultDate: new Date(), // defaultDate: задає початкову дату за допомогою new Date(), щоб вона збігалася з поточним моментом часу.
  minuteIncrement: 1, // minuteIncrement: встановлює крок вибору хвилин на 1, щоб точніше контролювати час.

  // Оголошуємо метод onClose - він викликається, коли користувач закриває вибір дати:
  onClose(selectedDates) {
    console.log(selectedDates); // selectedDates - масив вибраних дат, де selectedDates[0] є першим (і єдиним) вибраним значенням.
    const selectedDate = selectedDates[0]; // selectedDate: змінна, яка зберігає значення вибраної дати.

    // Робимо валідацію вибраної дати
    // Перевіряємо, чи вибрана дата (selectedDate) знаходиться в майбутньому щодо поточного часу new Date():
    if (selectedDate <= new Date()) {
      // Якщо дата в минулому або збігається з поточним моментом, виводимо повідомлення за допомогою iziToast.error
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true; // вимикаємо кнопку startButton
    } else {
      // Якщо дата коректна (в майбутньому), зберігаємо її у змінну userSelectedDate і активуємо кнопку startButton для запуску таймера.
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
    // Таким чином, options налаштовує flatpickr і додає перевірку дати, щоб таймер можна було запустити лише для майбутнього часу.
    console.log(selectedDate);
  },
};

// Викликаємо flatpickr на елементі #datetime-picker
flatpickr('#datetime-picker', options); // тут ми ініціалізуємо вибір дати й часу, передаючи в нього елемент #datetime-picker як перший аргумент, а об'єкт options як другий. Це дозволяє налаштувати календар відповідно до раніше заданих параметрів.

// Додаємо слухач події click для кнопки startButton
startButton.addEventListener('click', handleStart); // коли користувач натискає кнопку startButton, викликається функція handleStart, яка запускає таймер.

// Створюємо функцію-обробник handleStart
function handleStart() {
  // Перевірка - якщо userSelectedDate не встановлено (тобто є null або undefined), функція завершиться (return;), не виконуючи подальший код.
  if (!userSelectedDate) {
    return;
  }

  // Вимикаємо кнопку startButton і поле dateTimePicker
  startButton.disabled = true; // блокуємо кнопку Start, щоб запобігти повторному натисканню під час роботи таймера.
  dateTimePicker.disabled = true; // блокуємо елемент (input), щоб запобігти зміні вибору дати

  // Ініціалізуємо setInterval для запуску таймера, intervalId - цифровий ідентифікатор інтервала
  // setInterval створює інтервал, який виконує вкладену функцію щосекунди (кожні 1000 мс).
  const intervalId = setInterval(() => {
    const currentTime = new Date(); // Оголошуємо змінну currentTime: зберігає поточний момент у змінну
    const timeLeft = userSelectedDate - currentTime; // Визначаємо змінну timeLeft як різницю між userSelectedDate та currentTime: обчислює кількість мілісекунд, що залишилися до вибраної дати, віднімаючи поточний час від дати, встановленої користувачем.

    // Перевіряємо залишковий час timeLeft: Якщо timeLeft менше або дорівнює 0 (тобто час завершився), ми завершуємо відлік.
    if (timeLeft <= 0) {
      clearInterval(intervalId); // Зупиняємо інтервал за допомогою clearInterval: очищає інтервал, щоб припинити повторні виклики функції, зупиняючи таймер.

      // Оновлюємо відображення таймера на 0
      // Викликаємо updateTimerDisplay і передаємо об'єкт із значеннями { days: 0, hours: 0, minutes: 0, seconds: 0 }, щоб усі показники таймера обнулилися.
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateTimePicker.disabled = false; // Розблоковуємо поле dateTimePicker для нового вибору дати: дозволяє користувачу вибрати нову дату після
      return; // Завершуємо виконання функції: після очищення інтервалу та обнулення дисплея таймера функція завершує роботу.
    }

    // Створюємо змінну timeComponents, значенням якої буде виклик функції convertMs
    // Викликаємо функцію convertMs, передаючи їй значення timeLeft, і зберігаємо результат у timeComponents.
    const timeComponents = convertMs(timeLeft);

    // Викликаємо функції updateTimerDisplay
    // Ця функція викликається з параметром timeComponents
    // timeComponents містить об'єкт, що був отриманий в результаті виклику convertMs(timeLeft), тобто має структуру { days, hours, minutes, seconds }
    // Коли викликається updateTimerDisplay, функція деструктуризує timeComponents, витягуючи значення днів, годин, хвилин і секунд, і присвоює їх відповідним span-елементам на сторінці.
    updateTimerDisplay(timeComponents); // цей виклик оновлює відображення таймера на екрані відповідно до залишкового часу
  }, 1000);
}

// Створюємо функцію updateTimerDisplay
// Цей блок коду оновлює таймер на сторінці, відображаючи дні, години, хвилини та секунди у потрібному форматі.
// Функція приймає об'єкт з параметрами { days, hours, minutes, seconds }, використовуємо деструктуризацію відразу в параметрі функції
// Цей об'єкт має ту ж структуру, яку повертає функція convertMs
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  // Використовуємо textContent для оновлення тексту в елементах таймера
  // Присвоюємо значення відповідним span-елементам (daysEl, hoursEl, minutesEl, secondsEl)
  // Викликаємо функцію addLeadingZero для кожного значення, щоб забезпечити двозначний формат (наприклад, 05 замість 5)
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Створюємо функцію addLeadingZero, яка приймає число value як аргумент
// Функція перетворює value на рядок:
// String(value) - переводить число в рядок, щоб можна було застосувати метод padStart
// padStart(2, '0') приводить рядок до двозначного формату, додаючи 0 на початок, якщо значення однозначне
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Створюємо функцію convertMs
// convertMs(ms) приймає кількість мілісекунд ms і перетворює її на окремі одиниці часу (дні, години, хвилини, секунди).
// Константи для визначення тривалості однієї секунди, хвилини, години та дня (second, minute, hour, day) використовуються для обчислення відповідних компонентів.
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day); // кількість повних днів у ms (Math.floor(ms / day)).
  const hours = Math.floor((ms % day) / hour); // кількість повних годин, що залишилися після віднімання днів (Math.floor((ms % day) / hour)).
  const minutes = Math.floor(((ms % day) % hour) / minute); // кількість повних хвилин, що залишилися після віднімання днів та годин (Math.floor(((ms % day) % hour) / minute)).
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); // кількість повних секунд, що залишилися після віднімання днів, годин та хвилин (Math.floor((((ms % day) % hour) % minute) / second)).

  // Повертаємо об'єкт з обчисленими компонентами
  // Цей синтаксис не є деструктуризацією; він лише створює і повертає об'єкт. У цьому випадку { days, hours, minutes, seconds } є скороченим записом для створення об'єкта, де назви полів збігаються з назвами змінних.
  // Тобто цей рядок еквівалентний: return { days: days, hours: hours, minutes: minutes, seconds: seconds };
  return { days, hours, minutes, seconds }; // результатом функції є об'єкт, що містить дні, години, хвилини та секунди.
}

// Коментарі тезово
// Підсумок коду:
// 1. Підключення бібліотек:
// flatpickr: для вибору дати та часу.
// iziToast: для відображення сповіщень.

// 2. Отримання елементів DOM:
// Збираємо елементи для кнопки запуску таймера, вибору дати, та для відображення залишкового часу.

// 3. Ініціалізація змінних:
// userSelectedDate — зберігає дату, вибрану користувачем (ініціалізується значенням null).
// Кнопка startButton деактивується до вибору коректної дати.

// 4. Конфігурація flatpickr:
// Налаштовуємо параметри вибору дати/часу, включаючи можливість вибору часу, 24-годинний формат, початкову дату, та крок вибору хвилин.
// Додаємо валідацію вибраної дати в методі onClose, щоб активувати кнопку лише при виборі майбутньої дати.

// 5. Слухач події:
// Додаємо обробник подій для кнопки запуску таймера, який викликає функцію handleStart.

// 6. Обробка запуску таймера (handleStart):
// Перевіряється, чи вибрана дата (userSelectedDate).
// Блокує кнопку та поле введення.
// Запускає setInterval, що кожну секунду обчислює залишковий час.

// 7. Обчислення залишкового часу:
// Перевіряє, чи залишковий час не закінчився.
// Якщо закінчився — очищає інтервал, обнуляє значення таймера та розблокує поле для вибору нової дати.
// Викликає convertMs для отримання компонентів часу (дні, години, хвилини, секунди).

// 8. Оновлення відображення таймера:
// Функція updateTimerDisplay відповідає за оновлення вмісту елементів span на сторінці відповідно до залишкового часу, використовуючи addLeadingZero для форматування.

// 9. Допоміжні функції:
// addLeadingZero: перетворює значення в рядок з двозначним форматом.
// convertMs: перетворює мілісекунди в дні, години, хвилини та секунди, повертаючи об'єкт з цими значеннями.
