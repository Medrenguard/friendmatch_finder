# Аналитика по друзьям VK
Проект позволяет построить список всех друзей VK у любых пользователей, а так же вывести из них общих для конкретного друга, а так же записи со стены этого друга

Функционал позволяет добавлять/удалять пользователей VK по их идентификатору.<br/>
Пользователи динамически сортируются по фамилии/имени.<br/>
В интерфейсе присутствует возможность выбора пользователей, а также кнопка "построить", при нажатии на которую отображается единый список всех друзей выбранных пользователей.<br/>
При этом цвет панели друга тем ярче, чем у большего числа выбранных пользователей он находится в друзьях.<br/>
При клике по другу осуществляется переход на страницу, где отображаются те пользователи, у которых он находится в друзьях, а также последние 20 записей на его стене(в упрощенном виде: только текст)<br/>
При этом, независимо от перехода по карточкам друзей, результаты на основной странице сохраняются.<br/>

## Демонстрация
Кликни на изображение, чтобы посмотреть демо функционала  
[![demo video](http://img.youtube.com/vi/mlEf1I39lH0/0.jpg)](https://www.youtube.com/watch?v=mlEf1I39lH0)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

Так же, необходимо вставить access_token своего приожения ВК в значение в сторе: access_token

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
