# Лиза — lifestyle & UGC creator

Одностраничное mobile-first портфолио на семантическом HTML, CSS и JavaScript ES modules. Motion-зависимость — GSAP 3.15.0 и ScrollTrigger, локально в `dist/vendor/`. Статические исходники в `dist/` являются готовой сборкой и намеренно хранятся в Git. V2 полностью заменяет визуальный слой: Prata + Golos Text + Marck Script, съёмочный дневник, плёнка, бумага и вращающийся винил. UI/UX skill на V2 не использовался.

## Запуск

```sh
cd site # если вы находитесь в папке Elizaveta
npm run dev
```

Открыть http://127.0.0.1:5173. Проверки: `npm run check`. Для воспроизводимой сборки: `npm ci && npm run build` (копирование GSAP из установленной версии и проверка статических файлов).

## Архитектура

- `dist/index.html` — обложка, навигация, meta, native dialog.
- `dist/components.js` — About, Contents, Niches, Work, Services, Gallery, Contact.
- `dist/content.js` — все изменяемые фото, направления, видео, услуги и контакты.
- `dist/interactions.js` — welcome, scroll reveals, media dialog, focus/keyboard handling.
- `dist/styles.css` — дизайн-токены, mobile-first композиция и breakpoints.
- `dist/assets/photos/` — восемь настоящих фотографий в WebP, варианты 480/960/1440; EXIF-поворот применён, метаданные не переносятся.
- `dist/assets/fonts/` — локальные Prata, Golos Text и Marck Script, WOFF2, latin/cyrillic.

## Добавление 12 видео

1. Положить MP4/H.264 файлы в `dist/assets/videos/`, постеры — в `dist/assets/photos/`. Можно использовать HTTPS CDN.
2. Изменить объект в `videos` в `dist/content.js`:

```js
{ id: '01', title: 'Реальное название', category: 'BEAUTY · UGC',
  poster: '/assets/photos/work-01.webp', src: '/assets/videos/work-01.mp4',
  description: 'Описание работы' }
```

`poster` принимает ключ из `photos` или путь/HTTPS URL. Пустой `src` показывает честное превью «Скоро», без фиктивного ролика. Вводный текст `.work-draft` автоматически исчезает после заполнения всех видео. Все текущие названия — заменяемые названия слотов, а не утверждения о выполненных проектах.

`video` создаётся только при открытии выбранной работы; до клика нет video elements и запросов роликов. При закрытии/переключении плеер останавливается, src удаляется. Native dialog блокирует фон, поддерживает Escape, Tab и возвращает фокус. Предыдущая/следующая работа — кнопки и клавиши влево/вправо.

## Что ещё заменить

- 12 видео, их финальные подписи и индивидуальные постеры.
- Описание WELLNESS в `niches` (сейчас пустое).
- Уточнённые тексты, если Лиза пришлёт следующую редакцию.

Контакты взяты из приложенного брифа. Никаких цен, брендов, отзывов и статистики не добавлено. Прилагаемый MP4 и Canva — референсы, чужие работы на сайте не используются.

## Motion и доступность

Intro 3.4 секунды, пропуск, sessionStorage, пропуск при deep link и reduced motion. Scroll reveals отключаются при reduced motion; нативный scroll сохранён. Пластинка вращается от −35° до 115° через ScrollTrigger с `scrub: .65`, ссылки находятся вне вращающегося слоя. Секции имеют разные появления и небольшой parallax. Reduced motion отключает GSAP-сцены через matchMedia, а CSS фиксирует диск. Фото открываются в просмотрщике. Фон не скроллится под диалогом.

## Публикация

Sites identity хранится в `.openai/hosting.json`, статический каталог `dist`. Первая публикация приватная: прежде чем отправлять ссылку брендам, нужно изменить доступ. Любой обычный static hosting также может отдавать содержимое `dist`.

## Второй дизайн-проход

См. `docs/art-direction-v2.md`, `docs/assets-v2.md`, `docs/verification-v2.md`. Шрифтовые OFL-лицензии сохранены рядом с WOFF2. Видео по-прежнему являются 12 честно отмеченными placeholders.
