import type { ImageMetadata } from 'astro';
import babyBoy from '../assets/photos/baby-boy-newborn.png';
import babyGirl from '../assets/photos/baby-girl-newborn.png';
import loveSet from '../assets/photos/love-set.png';
import pkgGenderRevealInside from '../assets/photos/pkg-gender-reveal-inside.webp';
import pkgGenderReveal from '../assets/photos/pkg-gender-reveal.webp';
import pkgToyStory from '../assets/photos/pkg-toy-story.webp';
import setBirthday from '../assets/photos/set-birthday.webp';
import setClassic from '../assets/photos/set-classic.webp';
import setFriend from '../assets/photos/set-friend.webp';
import setSingleChocolate from '../assets/photos/set-single-chocolate.webp';
import setSingleRedVelvet from '../assets/photos/set-single-redvelvet.webp';
import setSingleVanilla from '../assets/photos/set-single-vanilla.webp';

/**
 * Photos for each gift set and party package, by id. One photo shows as a plain image,
 * several as a carousel, none as the empty state. To add a photo: put the file in
 * src/assets/photos/, import it here and list it under the id.
 */
export const photos: Record<string, ImageMetadata[]> = {
  'set-classic': [setClassic],
  'set-single': [setSingleChocolate, setSingleVanilla, setSingleRedVelvet],
  'set-birthday': [setBirthday],
  'set-love': [loveSet],
  'set-baby-girl': [babyGirl],
  'set-baby-boy': [babyBoy],
  'set-friend': [setFriend],
  'pkg-toy-story': [pkgToyStory],
  'pkg-birthday': [setBirthday],
  'pkg-baby-shower': [],
  'pkg-wedding': [],
  'pkg-gender-reveal': [pkgGenderReveal, pkgGenderRevealInside],
};
