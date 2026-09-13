export interface CustomIllustration {
  id: string;
  name: string;
  type: 'illustration' | 'person';
  url: string;
  badge: string;
  description: string;
}

export const CUSTOM_ILLUSTRATIONS: CustomIllustration[] = [
  // --- ANIMAL & CHARACTER ILLUSTRATIONS (illustration1 - illustration9) ---
  {
    id: 'illustration1',
    name: 'Panda in Green Sweater',
    type: 'illustration',
    badge: '🐼 Panda',
    description: '3D Panda character wearing a cozy green knitted sweater',
    url: '/illustrations/illustrations (1).png'
  },
  {
    id: 'illustration2',
    name: 'Corporate Cat in Suit',
    type: 'illustration',
    badge: '🐱 Suit Cat',
    description: 'Professional tabby cat wearing a formal suit and tie',
    url: '/illustrations/illustrations (2).png'
  },
  {
    id: 'illustration3',
    name: 'Golden Retriever Pup',
    type: 'illustration',
    badge: '🐶 Golden Pup',
    description: 'Happy Golden Retriever wearing a stylish yellow beanie',
    url: '/illustrations/illustration (3).png'
  },
  {
    id: 'illustration4',
    name: 'Scholar Poodle with Glasses',
    type: 'illustration',
    badge: '🐩 Scholar Poodle',
    description: 'Sophisticated brown Poodle with round spectacles',
    url: '/illustrations/illustration4.png'
  },
  {
    id: 'illustration5',
    name: 'Bear Cub in Cap',
    type: 'illustration',
    badge: '🐻 Bear Cub',
    description: 'Friendly teddy bear with curly hair and a baseball cap',
    url: '/illustrations/illustration5.png'
  },
  {
    id: 'illustration6',
    name: 'Wise Koala in Sweater',
    type: 'illustration',
    badge: '🐨 Wise Koala',
    description: 'Studious grey Koala wearing round glasses and a blue sweater',
    url: '/illustrations/illustration6.png'
  },
  {
    id: 'illustration7',
    name: 'Rebel Kitty in Bandana',
    type: 'illustration',
    badge: '😸 Rebel Kitty',
    description: 'Cool cat wearing a purple bandana and yellow vest',
    url: '/illustrations/illustration7.png'
  },
  {
    id: 'illustration8',
    name: 'Pigtail Maltese Pup',
    type: 'illustration',
    badge: '🐶 Pigtail Pup',
    description: 'Cute white Maltese dog with braided pigtails and yellow hat',
    url: '/illustrations/illustration8.png'
  },
  {
    id: 'illustration9',
    name: 'Red Beanie Raccoon',
    type: 'illustration',
    badge: '🦝 Red Beanie Raccoon',
    description: 'Cheerful raccoon with a red knitted beanie and white shirt',
    url: '/illustrations/illustration9.png'
  },

  // --- HUMAN 3D AVATARS (person1 - person15) ---
  {
    id: 'person1',
    name: 'Green Hoodie Boy',
    type: 'person',
    badge: '👦 Green Hoodie Boy',
    description: 'Animated boy with brown messy hair in a bright green hoodie',
    url: '/illustrations/person1.png'
  },
  {
    id: 'person2',
    name: 'Blonde Boy',
    type: 'person',
    badge: '👦 Blonde Boy',
    description: 'Cheerful boy with golden brown hair and bright smile',
    url: '/illustrations/person2.png'
  },
  {
    id: 'person3',
    name: 'Yellow Beanie Girl',
    type: 'person',
    badge: '👧 Yellow Beanie Girl',
    description: 'Happy girl with long hair, yellow beanie and denim jacket',
    url: '/illustrations/person3.png'
  },
  {
    id: 'person4',
    name: 'Glasses Girl',
    type: 'person',
    badge: '👩 Glasses Girl',
    description: 'Girl with wavy brown hair, round glasses and cheerful look',
    url: '/illustrations/person4.png'
  },
  {
    id: 'person5',
    name: 'Curly Cap Girl',
    type: 'person',
    badge: '👩 Curly Cap Girl',
    description: 'Girl with dark curly hair wearing a blue backward cap',
    url: '/illustrations/person5.png'
  },
  {
    id: 'person6',
    name: 'Student Boy with Backpack',
    type: 'person',
    badge: '🎒 Student Boy',
    description: 'Young student with brown hair, freckles and backpack',
    url: '/illustrations/person6.png'
  },
  {
    id: 'person7',
    name: 'Purple Beanie Girl',
    type: 'person',
    badge: '👧 Purple Beanie Girl',
    description: 'Girl with light brown hair, purple beanie and yellow vest',
    url: '/illustrations/person7.png'
  },
  {
    id: 'person8',
    name: 'Braided Girl',
    type: 'person',
    badge: '👧 Braided Girl',
    description: 'Girl with braided pigtails and a golden yellow headband cap',
    url: '/illustrations/person8.png'
  },
  {
    id: 'person9',
    name: 'Glasses Boy in Red Beanie',
    type: 'person',
    badge: '👓 Glasses Boy',
    description: 'Boy with round black glasses, red beanie and white tee',
    url: '/illustrations/person9.png'
  },
  {
    id: 'person10',
    name: 'Bearded Mentor',
    type: 'person',
    badge: '👨 Bearded Mentor',
    description: 'Friendly male mentor with neat beard in a green sweater',
    url: '/illustrations/person10.png'
  },
  {
    id: 'person11',
    name: 'Suit Professional',
    type: 'person',
    badge: '👨 Suit Professional',
    description: 'Young male professional with wavy hair wearing a grey jacket',
    url: '/illustrations/person11.png'
  },
  {
    id: 'person12',
    name: 'Blonde Beanie Woman',
    type: 'person',
    badge: '👩 Blonde Beanie Woman',
    description: 'Smiling blonde woman in denim jacket and yellow beanie',
    url: '/illustrations/person12.png'
  },
  {
    id: 'person13',
    name: 'Senior Scholar Woman',
    type: 'person',
    badge: '👩 Senior Scholar',
    description: 'Professional woman with dark wavy hair and round glasses',
    url: '/illustrations/person13.png'
  },
  {
    id: 'person14',
    name: 'Curly Cap Youth',
    type: 'person',
    badge: '🧑 Curly Cap Youth',
    description: 'Youth with voluminous curly hair, cap and orange sweater',
    url: '/illustrations/person14.png'
  },
  {
    id: 'person15',
    name: 'Senior Advisor',
    type: 'person',
    badge: '👴 Senior Advisor',
    description: 'Gentle senior academic advisor with round glasses in navy blue sweater',
    url: '/illustrations/person15.png'
  }
];

export function getIllustrationByIdOrUrl(idOrUrl: string): CustomIllustration | undefined {
  if (!idOrUrl) return undefined;
  return CUSTOM_ILLUSTRATIONS.find(item => item.id === idOrUrl || item.url === idOrUrl);
}