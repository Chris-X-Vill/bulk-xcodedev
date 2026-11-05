// ─────────────────────────────────────────────────────────────────────────────
//  EDIT THIS FILE to change the words and pictures on your website.
//
//  • Text: change anything between the quotes '...'. Keep the quotes and commas.
//  • Images: put your picture in  public/images/  then write its name here,
//    e.g.  image: 'images/my-photo.jpg'   (jpg, png, webp and svg all work).
//  • Lists: copy a { ... } block, including the comma after it, to add an item;
//    delete a block to remove one.
//  • Sections: change the order of SECTIONS at the bottom, or delete a line to
//    hide that section.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  name: 'Oliver The Dog',
  // Shown in the browser tab and in search results.
  title: 'Oliver · Ideas, work and projects',
  description: 'A home for my ideas, work, past projects and code.',
  // Shown in the Contact section and the footer.
  email: 'you@example.com',
}

export const hero = {
  eyebrow: 'Builder · Designer · Developer',
  heading: 'Ideas turned into things you can use.',
  text: 'This is the opening of your site. Say in a sentence or two who you are, what you make, and why someone should keep reading.',
  image: 'images/hero.svg',
  imageAlt: 'A short description of the picture, for screen readers',
  primaryButton: { label: 'See my projects', href: '#projects' },
  secondaryButton: { label: 'Get in touch', href: '#contact' },
}

export const about = {
  heading: 'About me',
  paragraphs: [
    'Meet Oliver, a 9-year-old Morkie (Maltese & Yorkie mix) living absolute royalty status. At nine years young, Oliver has mastered the fine art of living       the good life. He operates on a strict, highly demanding schedule: 10% patrolling the perimeter for rogue delivery drivers, 20% perfecting the art of         the sunbeam nap, and 70% supervising whatever is happening in the kitchen.',
    'Add a second paragraph for your background, the tools you like, or what you are learning now. Add or remove paragraphs as you like.',
  ],
  image: 'images/about.svg',
  imageAlt: 'Portrait or photo that represents you',
  // Small facts shown as a list. Edit, add or remove rows.
  facts: [
    { label: 'Based in', value: 'Your city' },
    { label: 'Focus', value: 'Web apps & design' },
    { label: 'Currently', value: 'Building side projects' },
  ],
}

// Icons available for services: code, design, idea, launch, camera, people, chart, phone
export const services = {
  heading: 'What I do',
  intro: 'Three or four things you offer or enjoy doing. Keep each one short.',
  items: [
    { icon: 'code', title: 'Web development', text: 'Fast, accessible websites and apps built with modern tools.' },
    { icon: 'design', title: 'Interface design', text: 'Clear layouts and visual systems that are easy to use.' },
    { icon: 'idea', title: 'Prototyping', text: 'Turning rough ideas into something you can click and test.' },
  ],
}

export const projects = {
  heading: 'Projects',
  intro: 'A few things I have built. Each card can link to a live site, a repository or a write-up.',
  items: [
    {
      title: 'Daily Activity Tracker',
      description: 'A personal dashboard to log time, set goals and see weekly trends. Installable on a phone and works offline.',
      image: 'images/project-1.svg',
      tags: ['React', 'Tailwind', 'PWA'],
      link: '../', // the tracker lives one folder up on the same site
      linkLabel: 'Open the app',
    },
    {
      title: 'Project two',
      description: 'Describe the problem, what you built, and what you learned. Two or three sentences is plenty.',
      image: 'images/project-2.svg',
      tags: ['Tag', 'Another tag'],
      link: '',
      linkLabel: '',
    },
    {
      title: 'Project three',
      description: 'Leave link empty ( link: \'\' ) if there is nothing to open yet; the button is hidden automatically.',
      image: 'images/project-3.svg',
      tags: ['Idea'],
      link: '',
      linkLabel: '',
    },
  ],
}

export const gallery = {
  heading: 'Gallery',
  intro: 'Photos, sketches or screenshots. Tap any image to see it larger.',
  items: [
    { image: 'images/gallery-1.svg', caption: 'Caption for the first image' },
    { image: 'images/gallery-2.svg', caption: 'Caption for the second image' },
    { image: 'images/gallery-3.svg', caption: 'Caption for the third image' },
    { image: 'images/gallery-4.svg', caption: 'Caption for the fourth image' },
    { image: 'images/gallery-5.svg', caption: 'Caption for the fifth image' },
    { image: 'images/gallery-6.svg', caption: 'Caption for the sixth image' },
  ],
}

export const contact = {
  heading: 'Get in touch',
  // Optional: shorter text for the menu. Any section can have a menuLabel.
  menuLabel: 'Contact',
  text: 'Have a question, an idea or a project in mind? Send me an email and I will get back to you.',
  // Links shown as buttons. Remove any you don't use.
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
}

export const footer = {
  text: 'Built and maintained by Your Name.',
}

// Order of the sections on the page. Delete a line to hide that section.
// To add a new section, see "Add a new section" in website/README.md.
export const SECTIONS = ['hero', 'about', 'services', 'projects', 'gallery', 'contact']
