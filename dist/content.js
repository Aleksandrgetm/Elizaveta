// EDIT HERE. Sources can be local /assets/videos/*.mp4 paths or HTTPS CDN URLs.
export const photos = {
  portrait: { id: '2681', alt: 'Лиза в бордовой рубашке' },
  beauty: { id: '0994', alt: 'Лиза с жемчужным колье, портрет крупным планом' },
  street: { id: '5712', alt: 'Лиза в очках на городской прогулке' },
  cafe: { id: '5788', alt: 'Лиза за столиком в кафе' },
  fashion: { id: '7454', alt: 'Лиза в чёрном топе и розовых шортах у каменной лестницы' },
  summer: { id: '8011', alt: 'Лиза в зелёном топе и белой юбке на ступенях' },
  mirror: { id: '8470', alt: 'Лиза снимает образ с полосатым лонгсливом в зеркале' },
  flowers: { id: '2688', alt: 'Лиза с букетом белых цветов' },
};
export const niches = [
  {name:'BEAUTY', imageAlt:'Косметика e.l.f. на столе', description:'Косметика, уход, макияж и self-care', photo:'flowers'},
  {name:'FASHION', imageAlt:'Девушка в светло-розовой блузке', description:'Одежда, аксессуары, примерки и стилизация', photo:'mirror'},
  {name:'LIFESTYLE', imageAlt:'Лиза с розовыми бигудями', description:'Влоги, рутина, товары для дома и повседневной жизни', photo:'cafe'},
  {name:'WELLNESS', imageAlt:'Розовый спортивный коврик, бутылка и аксессуары для тренировок', description:'Забота о себе, здоровье, спорт и баланс', photo:'summer'},
  {name:'TRAVEL', imageAlt:'Крыло самолёта и небо за иллюминатором', description:'Путешествия, места, отели и новые впечатления', photo:'fashion'},
];
// Real UGC works. MP4 sources are attached only after an explicit selection.
export const videos = [
  {id:'01',title:'Нативная демонстрация патчей во влоге',category:'BEAUTY · UGC',poster:'/assets/videos/posters/patches-vlog-intro.webp',src:'/assets/videos/patches-vlog.mp4',sourceFile:'нативная демонстрация патчей во влоге.mp4',description:''},
  {id:'02',title:'Демонстрация косметики · короткая',category:'BEAUTY · UGC',poster:'/assets/videos/posters/makeup-short-intro.webp',src:'/assets/videos/makeup-short.mp4',sourceFile:'демонстрация косметики короткая.mp4',description:''},
  {id:'03',title:'Нативная демонстрация косметики',category:'BEAUTY · UGC',poster:'/assets/videos/posters/makeup-native-intro.webp',src:'/assets/videos/makeup-native.mp4',sourceFile:'нативная демонстрация косметики.mp4',description:''},
  {id:'04',title:'Нативная демонстрация крема',category:'BEAUTY · UGC',poster:'/assets/videos/posters/cream-native-intro.webp',src:'/assets/videos/cream-native.mp4',sourceFile:'нативная демонстрация крема.mp4',description:''},
  {id:'05',title:'Демонстрация bubble tea',category:'FOOD · UGC',poster:'/assets/videos/posters/bubble-tea-intro.webp',src:'/assets/videos/bubble-tea.mp4',sourceFile:'демонстрация бабл ти.mp4',description:''},
  {id:'06',title:'Демонстрация одежды · короткая',category:'FASHION · UGC',poster:'/assets/videos/posters/fashion-short-intro.webp',src:'/assets/videos/fashion-short.mp4',sourceFile:'демонстрация одежды короткая.mp4',description:''},
  {id:'07',title:'Демонстрация одежды · полная версия',category:'FASHION · UGC',poster:'/assets/videos/posters/fashion-long-intro.webp',src:'/assets/videos/fashion-long.mp4',sourceFile:'демонстрация одежды длинная.mp4',description:''},
  {id:'08',title:'Демонстрация косметики · 60 секунд',category:'BEAUTY · UGC',poster:'/assets/videos/posters/makeup-60s-intro.webp',src:'/assets/videos/makeup-60s.mp4',parts:['/assets/videos/makeup-60s.part-1.bin','/assets/videos/makeup-60s.part-2.bin'],sourceFile:'демонстрация косметики 60с.mp4',description:''},
  {id:'09',title:'Креативная распаковка',category:'UNBOXING · UGC',poster:'/assets/videos/posters/creative-unboxing-intro.webp',src:'/assets/videos/creative-unboxing.mp4',sourceFile:'креативная распаковка.mp4',description:''},
  {id:'10',title:'Демонстрация обуви',category:'FASHION · UGC',poster:'/assets/videos/posters/footwear-intro.webp',src:'/assets/videos/footwear.mp4',sourceFile:'демонстрация обуви.mp4',description:''},
  {id:"11",title:"Демонстрация спортивного костюма",category:"FASHION · UGC",poster:"/assets/videos/posters/tracksuit-intro.webp",src:"/assets/videos/tracksuit.mp4",sourceFile:"демонстрация спортивного костюма.mp4",description:''},
  {id:"12",title:"Креативная демонстрация косметики",category:"BEAUTY · UGC",poster:"/assets/videos/posters/makeup-creative-intro.webp",src:"/assets/videos/makeup-creative.mp4",sourceFile:"креативная демонстрация косметики.mp4",description:''},
  {id:"13",title:"Демонстрация камеры",category:"LIFESTYLE · UGC",poster:"/assets/videos/posters/camera-intro.webp",src:"/assets/videos/camera.mp4",sourceFile:"демонстрация камеры.mp4",description:''},
  {id:"14",title:"Демонстрация косметики",category:"BEAUTY · UGC",poster:"/assets/videos/posters/makeup-new-intro.webp",src:"/assets/videos/makeup-new.mp4",sourceFile:"демонстрация косметики новая.mp4",description:''},
  {id:"15",title:"Демонстрация SPA",category:"WELLNESS · UGC",poster:"/assets/videos/posters/spa-intro.webp",src:"/assets/videos/spa.mp4",sourceFile:"демонстрация спа.mp4",description:''},
];
export const services = ['UGC-видео','GRWM','Разговорные видео','Видео с закадровой озвучкой','Обзоры продукции','Распаковки','Лайфстайл-влоги','Нативные интеграции','Фото для социальных сетей'];
export const gallery = ['summer','flowers','street','cafe','fashion','mirror'];
export const socials = [
  {name:'Instagram',label:'@waniloow',href:'https://instagram.com/waniloow'},
  {name:'Telegram',label:'@waniloow',href:'https://t.me/waniloow'},
  {name:'Email',label:'lbritakina@gmail.com',href:'mailto:lbritakina@gmail.com'},
];
