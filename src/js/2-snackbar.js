'use strict';

// Підключаємо бібліотеку iziToast для показу pop-up повідомлень та її CSS для коректного відображення
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо доступ до HTML-елемента форми за допомогою document.querySelector('.form')
const form = document.querySelector('.form');

// Додаємо слухач події submit на форму, що викликає функцію-обробник handleSubmit при відправці форми
form.addEventListener('submit', handleSubmit);

// Створюємо функцію-обробник події handleSubmit
function handleSubmit(event) {
  event.preventDefault(); // скасовує стандартну поведінку браузера при відправці форми, запобігаючи перезавантаженню сторінки.

  const delay = parseInt(event.target.delay.value); // бере значення введене в поле з name="delay" (в інпуті), а parseInt перетворює його в число.

  const state = event.target.state.value; // отримує значення обраної радіо-кнопки з групи з ім'ям state

  // Створення промісу
  // У колбек-функції setTimeout реалізується затримка на основі введеного значення delay, а умова для resolve та reject перевіряє значення стану.
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Очищаємо форму, скидаючи всі поля вводу до їхніх початкових значень
  form.reset();

  // Обробляємо проміс
  // Коли проміс виконується успішно (тобто викликається resolve), обробляємо результат за допомогою методу then
  // В цьому випадку, якщо state дорівнює 'fulfilled', буде виведено повідомлення про успішне виконання з використанням iziToast.success, яке містить текст ✅ Fulfilled promise in ${delay}ms. Повідомлення з'явиться в верхньому правому куті.

  // Якщо проміс НЕ виконується успішно (викликається reject), обробляємо це за допомогою методу catch
  // У випадку, якщо state не дорівнює 'fulfilled', відобразиться повідомлення про помилку за допомогою iziToast.error з текстом ❌ Rejected promise in ${delay}ms, також у верхньому правому куті.
  promise
    .then(delay => {
      iziToast.success({
        title: '✅ Fulfilled',
        message: `promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: '❌ Rejected',
        message: `promise in ${delay}ms`,
        position: 'topRight',
      });
    });
}
