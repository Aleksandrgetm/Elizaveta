# Елизавета — experimental portfolio V2

Новый интерактивный visual frontend: cinematic cover, magazine About, scroll-driven film, physical vinyl desk, constellation of five content niches, selected UGC rail, kinetic formats, photograph scrapbook and a letter finale.

Стек сохранён: статический HTML/CSS, JavaScript modules, локальные GSAP 3.15 и ScrollTrigger. Нативная прокрутка. UI/UX skill не использовался. Пользовательские assets не удалены и не заменены.

## Запуск и проверки

```sh
npm run dev
npm run check
npm run build
```

Локальный адрес: http://127.0.0.1:5173. Готовый сайт — `dist/`. Build копирует vendored GSAP из установленной зависимости и проверяет исходники; framework bundler не требуется.

## V1 сохранена

- Последний commit до экспериментальной V2: `b2cc1219ca0c7dd3d5f09adfadcd408f67a833b4` в **репозитории site/**.
- Рабочая V1 доступна по `/v1.html`, использует прежние `app.js`, `components.js`, `interactions.js` и стили. Эти файлы не изменены.
- V1 README сохранён в `docs/v1-readme.md`.
- Git history не переписывалась. Для переключения главной страницы достаточно скопировать `dist/v1.html` в `dist/index.html` и сделать обычный новый commit, не используя reset или force push.

## Файлы V2

- `dist/index.html` — метаданные, ресторанная обложка, chapter navigation и native dialog.
- `dist/v2-components.js` — остальные сцены, точное соответствие фотографий и декоративных assets.
- `dist/v2.css` — самостоятельная визуальная система; отдельные desktop/mobile композиции.
- `dist/v2.js` — инициализация и прямые ссылки на главы.
- `dist/v2-motion.js` — GSAP/ScrollTrigger, короткое intro, film, vinyl, constellation, Work, typography, scrapbook, letter; reduced-motion и fallback.
- `dist/v2-interactions.js` — медиапросмотрщик, keyboard focus trap, touch selection, pointer depth, custom cursor и chapter tracking.
- `dist/content.js` — сохранённые реальные тексты/фото, 12 видеослотов, форматы и контакты.

## Медиа

Новый полный аудит обнаружил **0 файлов видео**. Все 12 `src` пусты; карточки и просмотрщик явно отмечают фотопревью. Названия — прежние редактируемые draft slots, не заявления о выполненных рекламных проектах.

Чтобы добавить работу, заполните `src`, `title`, `category`, `poster` и при необходимости `description` в `dist/content.js`. `src` принимает `/assets/videos/name.mp4` или HTTPS CDN URL. `poster` принимает ключ `photos` либо путь к изображению.

До выбора нет `<video>` или `<source>` и нет запросов роликов. Выбранный плеер создаётся с `preload="none"`, `playsinline` и native controls. При переключении/закрытии воспроизведение останавливается и источник освобождается. Ошибка загрузки показывает постер с пояснением.

## Motion и доступность

- Intro около 1.7 секунды; пропускается при повторном посещении в сессии, deep link и reduced motion.
- Desktop Work pin только от 1100px и высоты 680px; scroll distance ограничена 1500px. На телефоне и в reduced motion работает нативный horizontal snap и кнопки.
- Все ссылки винила неподвижны, вращается только пластинка. Hero/decor pointer depth не больше 8px.
- Reduced motion не создаёт GSAP animations или pinning. Без GSAP остаются видимые сцены и кнопки ленты.
- Cursor только hover/fine pointer, отключён на телефоне и при reduced motion. Системный курсор не скрывается.
- Dialog: Escape, предыдущая/следующая работа, Tab/Shift+Tab внутри, возврат фокуса и scroll position; fixed-body lock для мобильных браузеров.

Аудит assets: `docs/experimental-v2-assets.md`. Проверки и ограничения: `docs/experimental-v2-verification.md`.

## Hosting

Существующая Site identity сохранена в `.openai/hosting.json`. Публикуется каталог `dist`. Текущий owner-private доступ сохранён; отдельная страница `/v1.html` доступна в той же публикации.
