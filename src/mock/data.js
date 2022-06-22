import { nanoid } from 'nanoid';
import { getRandomNumber, getRandomArray} from '../utils/utils';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export const pointTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const citiesNames = 'Абаза, Абакан, Абдулино, Абинск, Агидель, Агрыз, Адыгейск, Азнакаево, Азов, Ак-Довурак, Аксай, Алагир, Алапаевск, Алатырь, Алдан, Алейск, Александров, Александровск, Александровск-Сахалинский, Алексеевка, Алексин, Алзамай, Алупка, Алушта, Альметьевск';
export const cities = citiesNames.split(', ');

const generatePictures = () => {
  const isPictures = Boolean(getRandomNumber(0,1));
  if (!isPictures) {
    return null;
  }
  const generatePicture = () => ({
    src:  `http://picsum.photos/300/200?r=${Math.random()}`,
    description: lorem.generateSentences(1),
  });
  return Array.from({length: getRandomNumber(0, 5)}, generatePicture);
};

const generateDestinations = (destinationPoint) => {
  const destinationsList = getRandomArray(destinationPoint).map((destination) => ({
    description: getRandomNumber(0, 1) ? null : lorem.generateSentences(getRandomNumber(0, 5)),
    name: destination,
    pictures: generatePictures(),
  }));
  return destinationsList;
};
export const destinations = generateDestinations(cities);

export const offersSet = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': nanoid(),
        'title': 'Upgrade to a business class',
        'price': 120
      },
      {
        'id': nanoid(),
        'title': 'Choose the radio station',
        'price': 60
      },
      {
        'id': nanoid(),
        'title': 'Order Uber',
        'price': 20
      }
    ]
  },
  {
    'type': 'flight',
    'offers': [
      {
        'id': nanoid(),
        'title': 'Add luggage',
        'price': 30
      },
      {
        'id': nanoid(),
        'title': 'Switch to comfort class',
        'price': 100
      },
      {
        'id': nanoid(),
        'title': 'Add meal',
        'price': 15
      },
      {
        'id': nanoid(),
        'title': 'Choose seats',
        'price': 5
      },
      {
        'id': nanoid(),
        'title': 'Travel by train',
        'price': 40
      }
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': nanoid(),
        'title': 'Rent a car',
        'price': 200
      },
    ]
  },
  {
    'type': 'check-in',
    'offers': [
      {
        'id': nanoid(),
        'title': 'Add breakfast',
        'price': 50
      },
    ]
  },
  {
    'type': 'sightseeing',
    'offers': [
      {
        'id': nanoid(),
        'title': 'Book tickets',
        'price': 40
      }, {
        'id': nanoid(),
        'title': 'Lunch in city',
        'price': 30
      }
    ]
  }
];


