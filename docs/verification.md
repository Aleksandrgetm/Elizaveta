# Проверки первой версии

- Browser layout: 320, 375, 390, 430, 768, 1024, 1440 px; scrollWidth равен viewport, 12 элементов; три колонки до desktop, четыре на desktop.
- Реальные скриншоты desktop и mobile в docs/screenshots.
- Все изображения загружаются, ноль broken images. Исправлен EXIF-поворот 8470.
- На странице до взаимодействия нет video elements. src устанавливается только после открытия реальной работы. Реальные UGC-видео пока не предоставлены, их воспроизведение нельзя проверить до загрузки.
- Модальное превью: открыть, следующая работа, Escape; закрытие возвращает фокус на исходное превью, body scroll lock снимается. Диалог использует native showModal/focus trapping.
- Все видимые ссылки/кнопки не ниже 44 px после исправления wordmark и ссылки «Наверх».
- Console: ошибок и предупреждений нет.
- Reduced motion: unit smoke test подтверждает отсутствие intro/reveal DOM mutations при matches=true. CSS отключает анимации, transitions и smooth scroll. Системная настройка пользователя не менялась.
- npm run check / npm run build: синтаксис модулей, 12 уникальных слотов, локальные assets, кириллические шрифты и ссылки — PASS. Сборка статическая, runtime dependencies отсутствуют.
