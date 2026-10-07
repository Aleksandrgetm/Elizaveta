// EDIT HERE. Sources can be local /assets/videos/*.mp4 paths or HTTPS CDN URLs.
// Empty src is intentional: the supplied MP4 is an animation reference, not Liza's work.
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
// Draft titles describe the intended slots, not completed or published projects.
export const videos = [
  {id:'01',title:'Демонстрация косметики',category:'BEAUTY · UGC',poster:'flowers',src:'',description:''},
  {id:'02',title:'Собираемся вместе',category:'FASHION · GRWM',poster:'mirror',src:'',description:''},
  {id:'03',title:'Маленький влог',category:'LIFESTYLE · VLOG',poster:'cafe',src:'',description:''},
  {id:'04',title:'Любимый уход',category:'BEAUTY · ROUTINE',poster:'beauty',src:'',description:''},
  {id:'05',title:'Детали образа',category:'FASHION · STYLE',poster:'street',src:'',description:''},
  {id:'06',title:'Один день со мной',category:'LIFESTYLE · UGC',poster:'summer',src:'',description:''},
  {id:'07',title:'Распаковка',category:'BEAUTY · UNBOXING',poster:'portrait',src:'',description:''},
  {id:'08',title:'Городская история',category:'FASHION · UGC',poster:'fashion',src:'',description:''},
  {id:'09',title:'Новые места',category:'TRAVEL · VLOG',poster:'cafe',src:'',description:''},
  {id:'10',title:'Бьюти-находка',category:'BEAUTY · REVIEW',poster:'flowers',src:'',description:''},
  {id:'11',title:'Примерка настроения',category:'FASHION · TRY-ON',poster:'mirror',src:'',description:''},
  {id:'12',title:'История в деталях',category:'LIFESTYLE · UGC',poster:'summer',src:'',description:''},
];
export const services = ['UGC-видео','GRWM','Разговорные видео','Видео с закадровой озвучкой','Обзоры продукции','Распаковки','Лайфстайл-влоги','Нативные интеграции','Фото для социальных сетей'];
export const gallery = ['summer','flowers','street','cafe','fashion','mirror'];
export const socials = [
  {name:'Instagram',label:'@waniloow',href:'https://instagram.com/waniloow'},
  {name:'Telegram',label:'@waniloow',href:'https://t.me/waniloow'},
  {name:'Email',label:'lbritakina@gmail.com',href:'mailto:lbritakina@gmail.com'},
];
