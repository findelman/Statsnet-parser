# Statsnet Парсер Даты Регистрации

Этот проект представляет собой простой парсер, который получает информацию о дате регистрации компании с веб-сайта Statsnet.co. Парсер реализован в 2 вариациях, 1 с использованием cheerio, и 2 puppeteer, для смены вариации нужно выбрать ветку

## Установка

1. Убедитесь, что у вас установлен Node.js на вашем компьютере.

2. Клонируйте репозиторий или загрузите файлы проекта.

3. Установите зависимости с помощью yarn:
   yarn install

## Использование

1. Запуск: yarn start
По умолчанию сервер будет доступен на порту 3000.

2. Выполните GET-запрос к /api/getInfo/:iin, где :iin - ИИН (Идентификационный номер налогоплательщика) компании, для которой вы хотите получить информацию о дате регистрации.

Пример запроса:
GET http://localhost:3000/api/getInfo/123456789012
В ответ вы получите JSON-объект с информацией о компании, включая полное наименование и дату регистрации.
{
    "fullName": "Фамилия Имя Отечство stat.gov.kz",
    "dateRegistration": "ДЕНЬ.МЕСЯЦ.ГОД"
}