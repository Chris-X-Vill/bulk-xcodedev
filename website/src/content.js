// ─────────────────────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change the words and pictures on Oliver's website.
//
//  • Text: change anything between the quotes '...'. Keep the quotes and commas.
//    If your text needs an apostrophe, write it as  ’  (curly) or  \'  e.g. 'Oliver\'s'.
//  • Images: put your photo in  website/public/images/  then write its name here,
//    e.g.  image: 'images/oliver-sofa.jpg'   (jpg, png, webp and svg all work).
//  • Lists: copy a { ... }, block (including the comma) to add an item;
//    delete a block to remove one.
//  • Sections: change the order of SECTIONS at the bottom of this file, or
//    delete a line to hide that section.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'Oliver the Dog',
  // Shown in the browser tab and in search results.
  title: 'Oliver the Dog · Animal love and care',
  description: 'Meet Oliver, a 9-year-old Morkie, and find simple ideas for loving and caring for the animals in your life.',
  // Shown in the Say hello section and the footer. Leave it empty ('') to hide email.
  email: 'you@example.com',
}

export const hero = {
  eyebrow: 'Animal love & care',
  heading: 'Hi, I’m Oliver. Let’s take good care of our best friends.',
  text: 'A small dog with a big personality, sharing everyday ideas for keeping pets happy, healthy and loved.',
  image: 'images/hero.svg',
  imageAlt: 'Oliver, a small tan Morkie, looking at the camera',
  primaryButton: { label: 'Meet Oliver', href: '#about' },
  secondaryButton: { label: 'Care tips', href: '#care' },
}

export const about = {
  heading: 'About Oliver',
  paragraphs: [
    'Meet Oliver, a 9-year-old Morkie (Maltese & Yorkie mix) living absolute royalty status. At nine years young, Oliver has mastered the fine art of living the good life. He operates on a strict, highly demanding schedule: 10% patrolling the perimeter for rogue delivery drivers, 20% perfecting the art of the sunbeam nap, and 70% supervising whatever is happening in the kitchen.',
    'Add a second paragraph here: how Oliver joined the family, his funniest habit, or the thing he loves most.',
  ],
  image: 'images/about.svg',
  imageAlt: 'Portrait of Oliver',
  // Quick facts shown as cards. Edit, add or remove rows.
  facts: [
    { label: 'Breed', value: 'Morkie (Maltese & Yorkie)' },
    { label: 'Age', value: '9 years young' },
    { label: 'Favorite spot', value: 'Any sunbeam' },
    { label: 'Job title', value: 'Kitchen supervisor' },
  ],
}

// Icons you can use: food, walk, groom, vet, play, love, water, home, sun
export const care = {
  heading: 'Caring for your dog',
  intro: 'Simple habits that make a big difference. Every dog is different, so check with your vet for advice about yours.',
  menuLabel: 'Care tips',
  items: [
    { icon: 'food', title: 'Good food, right amounts', text: 'Feed a complete diet suited to your dog’s age and size, at regular times. Treats are best kept small.' },
    { icon: 'water', title: 'Fresh water, always', text: 'Keep a clean bowl topped up, and bring water on walks when it’s warm.' },
    { icon: 'walk', title: 'Daily walks', text: 'Walks are exercise and adventure. Let them sniff; it’s how dogs read the news.' },
    { icon: 'groom', title: 'Grooming', text: 'Brush often, keep nails trimmed, and check ears, eyes and teeth. Long-haired pups like Oliver need extra brushing.' },
    { icon: 'vet', title: 'Regular vet visits', text: 'Yearly check-ups, vaccines and parasite prevention. Senior dogs may need check-ups more often.' },
    { icon: 'love', title: 'Love and attention', text: 'Play, cuddles and calm routines keep dogs happy. Time together is the best gift.' },
  ],
}

// A day in Oliver's life, shown as a timeline. Add, remove or reorder rows.
export const routine = {
  heading: 'A day in Oliver’s life',
  intro: 'Dogs love routine. Here’s how Oliver runs the household.',
  menuLabel: 'His day',
  items: [
    { time: '7:00', title: 'Morning walk', text: 'A slow sniff around the block to check the neighborhood news.' },
    { time: '8:00', title: 'Breakfast', text: 'Served promptly. Any delay will be reported.' },
    { time: '10:00', title: 'Perimeter patrol', text: 'Watching the window for rogue delivery drivers.' },
    { time: '13:00', title: 'Sunbeam nap', text: 'Follows the sun across the living room floor.' },
    { time: '17:00', title: 'Play time', text: 'Fetch, tug, and a few zoomies.' },
    { time: '18:00', title: 'Dinner & kitchen duty', text: 'Supervises all cooking, closely.' },
    { time: '21:00', title: 'Bedtime', text: 'Claims the warmest blanket in the house.' },
  ],
}

export const gallery = {
  heading: 'Oliver’s gallery',
  intro: 'Tap any picture to see it larger.',
  menuLabel: 'Gallery',
  items: [
    { image: 'images/gallery-1.svg', caption: 'Ball is life' },
    { image: 'images/gallery-2.svg', caption: 'Bone appétit' },
    { image: 'images/gallery-3.svg', caption: 'Professional napper' },
    { image: 'images/gallery-4.svg', caption: 'Paw prints everywhere' },
    { image: 'images/gallery-5.svg', caption: 'Full of love' },
    { image: 'images/gallery-6.svg', caption: 'A day at the park' },
  ],
}

// Ideas for future pages. Keep them here as a "coming soon" list, then turn
// each into its own section when you're ready.
export const comingSoon = {
  heading: 'More to come',
  intro: 'Oliver is just getting started. Here’s what’s on the way.',
  menuLabel: null, // null keeps this section out of the menu
  items: [
    { title: 'Caring for senior dogs', text: 'Comfort, mobility and health tips for older pups.' },
    { title: 'Adoption & rescue stories', text: 'Celebrating animals who found their forever homes.' },
    { title: 'Healthy homemade treats', text: 'Simple recipes, checked for dog-safe ingredients.' },
  ],
}

export const contact = {
  heading: 'Say hello to Oliver',
  text: 'Have a story about your own pet, a care tip to share, or a question? Send a message.',
  menuLabel: 'Say hello',
  // Links shown under the email. Remove any you don't use.
  links: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
}

export const footer = {
  text: 'Oliver the Dog. Made with love for animals everywhere.',
}

// Order of the sections on the page. Delete a line to hide that section.
// To add a new section, see "Add a new section" in website/README.md.
export const SECTIONS = ['hero', 'about', 'care', 'routine', 'gallery', 'comingSoon', 'contact']
