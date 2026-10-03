# Тематические фото и свободные отступы

Имени возвращена прежняя GSAP-анимация: clipPath снизу вверх + небольшой подъём за 1.05 s. Рисование по штрихам удалено. Сохраняются reduced motion и исходная надпись.

Фотоплёнка теперь содержит восемь настоящих фото Лизы и выходит за экран с запасом 80 px на mobile / 190 px desktop. Движение вправо (24 / 70 px) сохранено; край ленты не должен входить в viewport. Кадры заполняют длину ленты от её начала, а не центрируются в пустом пространстве.

Под диском увеличен нижний отступ; desktop-контейнер диска учитывает его фактическую высоту и выступ, вместо фиксированных 620 px. Сердечки полностью удалены из карты декора и sprite. Добавлены ещё две вариации звёзд, рисованный бантик и маленький цветок. На телефоне дополнительные мелкие группы скрыты.

## Внешние фото

Тематические изображения иллюстрируют направления, не являются примерами выполненных работ Лизы. Все сохранены локально в WebP. [Pexels License](https://www.pexels.com/license/) разрешает использование на сайтах и изменение.

| Asset | Author | Source |
|---|---|---|
| beauty.webp | Monstera Production | https://www.pexels.com/photo/bottles-of-cosmetic-products-placed-on-white-table-6621472/ |
| fashion.webp | Macjoy Peñaredondo | https://www.pexels.com/photo/photo-of-a-handbag-8006405/ |
| wellness.webp | Critical Smith | https://www.pexels.com/photo/delicious-matcha-latte-in-glass-cup-on-marble-table-28893064/ |
| lifestyle.webp | Esra Nur Kalay | https://www.pexels.com/photo/coffee-cup-and-candle-on-book-17352331/ |
| travel.webp | Vlada Karpovich | https://www.pexels.com/photo/view-of-the-clouds-from-an-airplane-window-7902922/ |

Фото укрупнены в овалах, подобраны отдельные object-position, единая приглушённая насыщенность. Центральный портрет Лизы и кружевная рамка сохранены.

Проверка: npm run check проходит. Браузер 320/390/1024/1440 px: нет горизонтального переполнения, сломанных фото или ошибок консоли. Сердечки и handwriting-mask отсутствуют в DOM. При прокрутке desktop лента простирается примерно от −128 до 1705 px при viewport 1440; mobile от −61 до 428 px при viewport 320. Под диском на desktop около 203 px до следующего фона. Снимок: docs/screenshots/v5-directions.png.
