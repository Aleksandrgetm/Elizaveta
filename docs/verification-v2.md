# Проверка V2 — 3 октября 2026

## Браузер

Codex in-app browser, локальный HTTP preview. Вручную просмотрены композиции на 320, 375, 390, 430, 768, 1024 и 1440 px. Основные проверки: услуги 320/768, контакты 375, hero/work/vinyl 390, about 430, hero 1024, gallery 1440. Во всех семи размерах `documentElement.scrollWidth === innerWidth`. Выходящая за границы плёнка обрезается по горизонтали, native scroll сохраняется. На 320 уменьшен заголовок виниловой секции. Это проверка responsive viewport, не физического iPhone/Safari.

- Mobile video wall: 3 колонки, 12 подписанных превью. Desktop: 4 колонки.
- Письмо: закрытый конверт, открытая створка, физический выезд листа, появление рукописной строки, fade к странице. Проверены промежуточные кадры примерно 0.7/1.6/2.3 s. Исправлена высота бумаги, чтобы подпись оставалась на листе. Intro завершает работу и снимает scroll lock; есть повторное открытие и пропуск.
- Vinyl: реальные computed matrices меняются с `matrix(.905661,.424002,-.424002,.905661,0,0)` до `matrix(.109446,.993993,-.993993,.109446,0,0)` после PageDown. Треклист не вращается.
- Media: клик открывает native dialog; ArrowRight меняет работу; Escape закрывает и возвращает фокус на исходное превью. Tab с кнопки закрытия переходит к предыдущей работе внутри диалога. Фото открывается в том же viewer.
- Консоль: ошибок и предупреждений не обнаружено.
- До открытия видео: 0 video elements. Отсутствующие видео явно обозначены как превью. В реальных файлах playback/network ещё проверить нельзя: 12 исходных роликов не предоставлены.

## Reduced motion

`node scripts/motion-check.mjs`: подставляет matchMedia(reduce=true), проверяет пропуск welcome и выход до создания GSAP-анимаций. CSS отключает transition/animation, smooth scroll и фиксирует диск; viewer тоже проверяет reduced motion. Физический iPhone и браузерная эмуляция OS reduced-motion в доступном инструменте не поддерживаются, поэтому полная OS/browser проверка не заявляется.

## Производительность

WebP 480/960/1440 с responsive srcset, local WOFF2 Latin/Cyrillic, hero preload и fetchpriority, lazy images ниже обложки. Все восемь фото во всех размерах вместе ~2.6 MB; GSAP + ScrollTrigger на диске ~172 KB без gzip. Ролики не запрашиваются при initial load. Нативный scroll, ограниченный transform/opacity parallax, однократные reveals. При Save-Data/малой hardwareConcurrency отключается gallery parallax. Бенчмарки Lighthouse, CPU throttling и реальные Core Web Vitals не запускались; score не заявляется.

## Команды

`npm run build` и `npm run check` проходят: JS syntax, 12 уникальных video slots, наличие фото/шрифтов/локальных ссылок, русская metadata, reduced-motion branch. build копирует закреплённые package-lock версией GSAP-файлы в dist/vendor.
