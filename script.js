(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $('[data-header]');
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    nav.classList.toggle('is-open', !isOpen);
  });
  $$('[data-nav] a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !nav?.classList.contains('is-open')) return;
    closeMenu();
    menuToggle?.focus();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) closeMenu();
  }, { passive: true });

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const sections = $$('main section[id]');
  const navLinks = $$('[data-nav] a[href^="#"]');
  $$('.reveal').forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`);
  });
  if (typeof IntersectionObserver === 'function') {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    $$('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    $$('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  const translations = {
    en: { navWhy: 'Why education', navAbout: 'About us', navPrograms: 'Programs', navShop: 'Charity shop', navImpact: 'Our impact', navContact: 'Contact', navSupport: 'Support us', heroEyebrow: 'IAHC Nepal · Pokhara, Nepal', heroTitle: 'Hope begins<br><em>with education.</em>', heroLede: 'A small, community-based charity helping children stay in school, meet basic needs, and grow with dignity.', heroPrimary: 'Help keep a child in school', heroSecondary: 'See how it works', heroNote: 'Built from a second-hand shop, carried by local care.', whyTitle: 'A school place can<br><em>change the shape of a life.</em>', whyLede: 'In communities where a family may have to choose between food, rent, and a child’s school fees, staying in education is not guaranteed. IAHC comes alongside families with practical support, so children can learn without the fear of being sent home.' },
    ne: { navWhy: 'शिक्षा किन?', navAbout: 'हाम्रो बारेमा', navPrograms: 'कार्यक्रमहरू', navShop: 'च्यारिटी पसल', navImpact: 'हाम्रो प्रभाव', navContact: 'सम्पर्क', navSupport: 'सहयोग गर्नुहोस्', heroEyebrow: 'IAHC नेपाल · पोखरा, नेपाल', heroTitle: 'आशा सुरु हुन्छ<br><em>शिक्षाबाट।</em>', heroLede: 'बालबालिकालाई विद्यालयमा रहन, आधारभूत आवश्यकता पूरा गर्न र सम्मानका साथ अघि बढ्न सहयोग गर्ने समुदायमा आधारित सानो संस्था।', heroPrimary: 'बालबालिकाको शिक्षामा सहयोग गर्नुहोस्', heroSecondary: 'कसरी काम गर्छ हेर्नुहोस्', heroNote: 'सेकेन्ड-ह्यान्ड पसलबाट सुरु भएको, स्थानीय मायाले अघि बढेको।', whyTitle: 'विद्यालयको एउटा ठाउँले<br><em>जीवनको बाटो बदल्न सक्छ।</em>', whyLede: 'खाना, घरभाडा र विद्यालय शुल्कमध्ये रोज्नुपर्ने परिवारका लागि शिक्षामा रहनु निश्चित हुँदैन। IAHC परिवारसँगै उभिएर व्यावहारिक सहयोग गर्छ, ताकि बालबालिकाले विद्यालयबाट घर पठाइने डरबिना सिक्न सकून्।' }
  };
  const pageTargets = {
    brandKicker: '.brand small',
    heroCaption: '.hero-image-wrap figcaption',
    heroStickerKicker: '.hero-sticker span',
    heroStickerTitle: '.hero-sticker strong',
    heroMetricOne: '.hero-bottom > div:nth-child(1) span',
    heroMetricTwo: '.hero-bottom > div:nth-child(2) span',
    heroMetricThree: '.hero-bottom > div:nth-child(3) span',
    heroSource: '.hero-bottom > p',
    whyIndex: '.section-intro .section-index',
    principleOneTitle: '.principles-grid .principle:nth-child(1) h3',
    principleOneCopy: '.principles-grid .principle:nth-child(1) p',
    principleTwoTitle: '.principles-grid .principle:nth-child(2) h3',
    principleTwoCopy: '.principles-grid .principle:nth-child(2) p',
    principleThreeTitle: '.principles-grid .principle:nth-child(3) h3',
    principleThreeCopy: '.principles-grid .principle:nth-child(3) p',
    aboutIndex: '.about-heading .section-index',
    aboutTitle: '#about-title',
    aboutIntro: '.about-intro',
    founderLabel: '.person-founder .photo-label',
    founderQuote: '.person-founder .person-copy h3',
    founderCopy: '.person-founder .person-copy > p:last-child',
    directorLabel: '.person-director .photo-label',
    directorQuote: '.person-director .person-copy h3',
    directorCopy: '.person-director .person-copy > p:last-child',
    programsIndex: '.programs-section .section-heading-row .section-index',
    programsTitle: '#programs-title',
    programsIntro: '.programs-section .section-heading-row > p',
    programOneTitle: '.program-list .program-row:nth-child(1) h3',
    programOneCopy: '.program-list .program-row:nth-child(1) p',
    programTwoTitle: '.program-list .program-row:nth-child(2) h3',
    programTwoCopy: '.program-list .program-row:nth-child(2) p',
    programThreeTitle: '.program-list .program-row:nth-child(3) h3',
    programThreeCopy: '.program-list .program-row:nth-child(3) p',
    programPhotoCopy: '.program-photo p',
    shopIndex: '.shop-copy .section-index',
    shopImageIndex: '.shop-image .image-index',
    shopTitle: '#shop-title',
    shopCopyOne: '.shop-copy > p:nth-of-type(2)',
    shopCopyTwo: '.shop-copy > p:nth-of-type(3)',
    shopLink: '.shop-copy .text-link',
    impactIndex: '.impact-section .section-index',
    impactTitle: '#impact-title',
    impactCopy: '.impact-copy',
    impactButton: '.impact-grid .button',
    familiesNow: '.goal-numbers > div:nth-child(1) span',
    familiesGoal: '.goal-numbers > div:nth-child(2) span',
    fundraising: '.goal-panel > p',
    supportIndex: '.support-section .section-index',
    supportTitle: '#support-title',
    supportCopy: '.support-copy > p:nth-of-type(2)',
    supportNote: '.support-copy .small-note',
    donationLegend: '.donation-form legend',
    donationOther: '.custom-amount span',
    donationCustomLabel: '.donation-form label[for="custom-amount"]',
    donationSummary: '.donation-summary > span',
    donationButton: '[data-donation-submit]',
    contactIndex: '.contact-section .section-index',
    contactTitle: '#contact-title',
    contactIntro: '.contact-intro',
    phone: '.contact-details a[href^="tel:"]',
    email: '.contact-details a[href^="mailto:"]',
    map: '.contact-details a[href*="maps.app.goo.gl"]',
    basedIn: '.contact-details > p',
    nameLabel: '.contact-form label[for="name"]',
    emailLabel: '.contact-form label[for="email"]',
    messageLabel: '.contact-form label[for="message"]',
    contactButton: '.contact-form .button',
    safeguardingTitle: '.safeguarding h2',
    safeguardingCopy: '.safeguarding p',
    supportImageNote: '.support-image span',
    footerIntro: '.footer-signup > p:first-child',
    newsletterLabel: '[data-newsletter-form] label',
    newsletterButton: '[data-newsletter-form] button',
    footerAbout: '.footer-links a:nth-child(1)',
    footerPrograms: '.footer-links a:nth-child(2)',
    footerSupport: '.footer-links a:nth-child(3)',
    footerContact: '.footer-links a:nth-child(4)',
    footerBio: '.footer-links a:nth-child(5)',
    footerTagline: '.footer-bottom p:last-child',
    cookieCopy: '.cookie-notice p',
    cookieButton: '[data-cookie-dismiss]',
    skipLink: '.skip-link'
  };
  const pageAttributes = {
    customPlaceholder: ['#custom-amount', 'placeholder'],
    newsletterPlaceholder: ['#newsletter-email', 'placeholder'],
    newsletterAria: ['[data-newsletter-form] button', 'aria-label'],
    brandAria: ['.brand', 'aria-label'],
    navigationAria: ['.site-nav', 'aria-label'],
    figuresAria: ['.hero-bottom', 'aria-label'],
    footerNavigationAria: ['.footer-links', 'aria-label'],
    cookieAria: ['.cookie-notice', 'aria-label'],
    heroImageAlt: ['.hero-image', 'alt'],
    founderImageAlt: ['.person-founder img', 'alt'],
    directorImageAlt: ['.person-director img', 'alt'],
    suppliesImageAlt: ['.program-photo img', 'alt'],
    shopImageAlt: ['.shop-image img', 'alt'],
    impactImageAlt: ['.impact-image img', 'alt'],
    supportImageAlt: ['.support-image img', 'alt']
  };
  const pageCopy = {
    en: {
      brandKicker: 'Charity · Nepal', heroCaption: 'Community at the charity shop · Pokhara', heroStickerKicker: 'Small steps.', heroStickerTitle: 'Real<br />hope.', heroMetricOne: 'children currently supported', heroMetricTwo: 'children goal by the end of this year', heroMetricThree: 'monthly support per child', heroSource: 'Source-material figures · please read the <a href="#safeguarding">safeguarding note</a>.',
      whyIndex: '01 / WHY IT MATTERS', principleOneTitle: 'Keep learning possible', principleOneCopy: 'School fees and admission support help children continue their education without worry.', principleTwoTitle: 'Meet everyday needs', principleTwoCopy: 'Uniforms, shoes, books, notebooks, stationery, hygiene and basic health essentials make school more reachable.', principleThreeTitle: 'Care for the whole child', principleThreeCopy: 'Local support is about more than money: it is a safe, supportive environment to grow, learn, and thrive.',
      aboutIndex: '02 / THE PEOPLE', aboutTitle: 'A mission shaped<br /><em>by lived experience.</em>', aboutIntro: 'I Also Help began with a simple belief: no child should lose the chance to learn because their family cannot afford it. Its work is rooted in Ranipouwa, Pokhara, and grows through community support.', founderLabel: 'Founder', founderQuote: '“I do not want any child to lose their dreams simply because their family cannot afford an education.”', founderCopy: 'As a single mother who faced hardship while educating her own children, Radha knows the worry of choosing between daily survival and a child’s future. That journey became the beginning of this charity.', directorLabel: 'Managing director', directorQuote: '“We are here to stand beside families who are doing their best.”', directorCopy: 'As managing director, Diraj carries the memory of worrying about school fees into a clear purpose: helping children stay in school with dignity, hope, and a future.',
      programsIndex: '03 / WHAT WE DO', programsTitle: 'Practical help,<br /><em>close to home.</em>', programsIntro: 'Every program starts with a simple question: what will help a child stay in school and feel ready to learn?', programOneTitle: 'Educational sponsorship', programOneCopy: 'Support for school fees so children can stay in school and continue their education.', programTwoTitle: 'School supplies & basic needs', programTwoCopy: 'Uniforms, shoes, books, notebooks, stationery, and other essentials children need to learn and grow.', programThreeTitle: 'Tuition & coaching support', programThreeCopy: 'Private tuition for students who are struggling, helping them catch up and do better in their studies.', programPhotoCopy: 'School supplies are practical support: something to carry, use, and learn with.',
      shopIndex: '04 / A DIFFERENT KIND OF FUNDRAISING', shopImageIndex: '04 / THE BEGINNING', shopTitle: 'A shop with<br /><em>a school-sized purpose.</em>', shopCopyOne: 'I Also Help began with a small second-hand charity shop: a few donated items, a big dream, and enough sales to support one child’s education.', shopCopyTwo: 'That first child gave the team hope. Today, the shop remains a tangible way for the community to turn useful things into school fees, supplies, and care.', shopLink: 'Turn care into support',
      impactIndex: '05 / THE GOAL', impactTitle: 'From two children<br /><em>to eleven.</em>', impactCopy: 'We started by supporting 2 children last year. Today, I Also Help is supporting 11 children across 5 families, with a goal of reaching 25 children in need.', impactButton: 'Be part of the next step', familiesNow: 'families supported now', familiesGoal: 'families goal', fundraising: 'Fundraising target: <strong>£400 / month</strong> · <strong>£4,800 / year</strong>',
      supportIndex: '06 / SUPPORT', supportTitle: 'Make room<br /><em>for a future.</em>', supportCopy: '£20 / $25 per child per month is the stated sponsorship amount. It can cover school fees and admission, uniform and shoes, books and stationery, tuition support, and hygiene or basic health essentials.', supportNote: 'This form is a static demonstration of the giving journey. No payment is taken here.', supportImageNote: 'Care is a shared practice.', donationLegend: 'Choose a monthly amount', donationOther: 'Other', donationCustomLabel: 'Other monthly amount', donationSummary: 'Your monthly support', donationButton: 'Continue to support',
      contactIndex: '07 / GET IN TOUCH', contactTitle: 'Let’s help,<br /><em>together.</em>', contactIntro: 'Questions about sponsorship, the charity shop, or how to support the work from where you are? Send a note or use the contact details below.', phone: '<span>Phone</span>+977 9707551689', email: '<span>Email</span>ialsohelpcharity@gmail.com', map: '<span>Visit us</span>Open the charity shop location in Google Maps', basedIn: '<span>Based in</span>Ranipouwa / Pokhara, Nepal', nameLabel: 'Your name', emailLabel: 'Email address', messageLabel: 'How can we help?', contactButton: 'Send message',
      safeguardingTitle: 'A note on dignity and safeguarding', safeguardingCopy: 'We keep children’s names, ages, family circumstances, and other sensitive details private. This website presents sponsorship as program-level support and uses images with care. Please do not ask us to publish personal stories or identifying information without appropriate consent and safeguarding review.', footerIntro: 'Follow the work, one small step at a time.', newsletterLabel: 'Your email address', newsletterButton: 'Join', footerAbout: 'About', footerPrograms: 'Programs', footerSupport: 'Support', footerContact: 'Contact', footerBio: 'Bio site', footerTagline: 'Made for education, care, and community.', cookieCopy: 'This site uses only essential browser storage for language and notice preferences.', cookieButton: 'Got it', skipLink: 'Skip to main content', customPlaceholder: 'Amount', newsletterPlaceholder: 'Your email address', newsletterAria: 'Sign up for updates', brandAria: 'I Also Help Charity home', navigationAria: 'Primary navigation', figuresAria: 'Current figures from IAHC source materials', footerNavigationAria: 'Footer navigation', cookieAria: 'Cookie notice', heroImageAlt: 'People browsing donated clothing and toys at the I Also Help Charity Shop in Pokhara', founderImageAlt: 'Radha Rana, founder of I Also Help Charity', directorImageAlt: 'Diraj Gotame, managing director of I Also Help Charity', suppliesImageAlt: 'Children holding school supplies provided through community support', shopImageAlt: 'Clothes and donated items at the I Also Help Charity Shop in Pokhara', impactImageAlt: 'Community delivery of donated supplies in Pokhara', supportImageAlt: 'Hands joined in a gesture of care and support'
    },
    ne: {
      brandKicker: 'च्यारिटी · नेपाल', heroCaption: 'च्यारिटी पसलमा समुदाय · पोखरा', heroStickerKicker: 'सानो कदम।', heroStickerTitle: 'साँचो<br />आशा।', heroMetricOne: 'हाल सहयोग पाउने बालबालिका', heroMetricTwo: 'यस वर्षको अन्त्यसम्म बालबालिकाको लक्ष्य', heroMetricThree: 'प्रति बालबालिका मासिक सहयोग', heroSource: 'स्रोतका तथ्याङ्क · कृपया <a href="#safeguarding">सुरक्षा सूचना</a> पढ्नुहोस्।',
      whyIndex: '०१ / यसको महत्व', principleOneTitle: 'पढाइ जारी राखौँ', principleOneCopy: 'विद्यालय शुल्क र भर्ना सहयोगले बालबालिकालाई चिन्ताबिना पढाइ जारी राख्न मद्दत गर्छ।', principleTwoTitle: 'दैनिक आवश्यकता पूरा गरौँ', principleTwoCopy: 'युनिफर्म, जुत्ता, किताब, कापी, लेखन सामग्री, सरसफाइ र आधारभूत स्वास्थ्य सामग्रीले विद्यालय जान सजिलो बनाउँछ।', principleThreeTitle: 'सम्पूर्ण बालबालिकाको हेरचाह', principleThreeCopy: 'स्थानीय सहयोग पैसा मात्र होइन; यो बढ्न, सिक्न र अघि बढ्न सुरक्षित वातावरण पनि हो।',
      aboutIndex: '०२ / मानिसहरू', aboutTitle: 'अनुभवबाट बनेको<br /><em>एउटा अभियान।</em>', aboutIntro: 'I Also Help को सुरुवात एउटा सरल विश्वासबाट भयो: परिवारले खर्च धान्न नसकेकै कारण कुनै बालबालिकाले पढ्ने अवसर गुमाउनु हुँदैन। यसको काम रानीपौवा, पोखरामा आधारित छ र समुदायको सहयोगबाट अघि बढ्छ।', founderLabel: 'संस्थापक', founderQuote: '“परिवारले शिक्षा खर्च धान्न नसकेकै कारण कुनै बालबालिकाले आफ्नो सपना गुमाउनु नपरोस्।”', founderCopy: 'आफ्ना छोराछोरीलाई पढाउँदा कठिनाइ भोगेकी एकल आमा राधाले दैनिक जीवन र बालबालिकाको भविष्यबीचको चिन्ता बुझ्नुहुन्छ। यही अनुभवबाट यो च्यारिटी सुरु भयो।', directorLabel: 'व्यवस्थापन निर्देशक', directorQuote: '“आफ्नो तर्फबाट सक्दो गरिरहेका परिवारको साथमा उभिन हामी यहाँ छौँ।”', directorCopy: 'व्यवस्थापन निर्देशकका रूपमा दिराजले विद्यालय शुल्कको चिन्तालाई स्पष्ट उद्देश्यमा बदल्नुभएको छ: बालबालिकालाई सम्मान, आशा र भविष्यसहित विद्यालयमा टिकाइराख्नु।',
      programsIndex: '०३ / हामी के गर्छौँ', programsTitle: 'व्यावहारिक सहयोग,<br /><em>घर नजिकै।</em>', programsIntro: 'हरेक कार्यक्रम एउटा सरल प्रश्नबाट सुरु हुन्छ: बालबालिकालाई विद्यालयमा टिकिरहन र सिक्न तयार हुन के चाहिन्छ?', programOneTitle: 'शिक्षा सहयोग', programOneCopy: 'विद्यालय शुल्कमा सहयोग, ताकि बालबालिकाले पढाइ जारी राख्न सकून्।', programTwoTitle: 'विद्यालय सामग्री र आधारभूत आवश्यकता', programTwoCopy: 'युनिफर्म, जुत्ता, किताब, कापी, लेखन सामग्री र सिक्नका लागि चाहिने अन्य सामग्री।', programThreeTitle: 'ट्युसन र पढाइ सहयोग', programThreeCopy: 'पढाइमा कठिनाइ भएका विद्यार्थीलाई थप ट्युसन दिएर अगाडि बढ्न सहयोग।', programPhotoCopy: 'विद्यालय सामग्री व्यवहारिक सहयोग हो: बोक्न, प्रयोग गर्न र सिक्नका लागि।',
      shopIndex: '०४ / फरक किसिमको सहयोग संकलन', shopImageIndex: '०४ / सुरुवात', shopTitle: 'एउटा पसल,<br /><em>बालबालिकाको पढाइका लागि।</em>', shopCopyOne: 'I Also Help को सुरुवात सानो सेकेन्ड-ह्यान्ड च्यारिटी पसलबाट भयो: केही दान गरिएका सामान, ठूलो सपना र एक बालबालिकाको पढाइमा सहयोग गर्ने आम्दानी।', shopCopyTwo: 'त्यो पहिलो बालबालिकाले टोलीमा आशा जगायो। आज पनि पसलले उपयोगी सामानलाई विद्यालय शुल्क, सामग्री र हेरचाहमा बदल्ने बाटो दिएको छ।', shopLink: 'सहयोगलाई साथमा बदल्नुहोस्',
      impactIndex: '०५ / लक्ष्य', impactTitle: 'दुई बालबालिकाबाट<br /><em>एघारसम्म।</em>', impactCopy: 'गत वर्ष हामीले २ बालबालिकालाई सहयोग गर्न सुरु गरेका थियौँ। आज IAHC ले ५ परिवारका ११ बालबालिकालाई सहयोग गरिरहेको छ। लक्ष्य २५ बालबालिका हो।', impactButton: 'अर्को कदममा साथ दिनुहोस्', familiesNow: 'अहिले सहयोग पाउने परिवार', familiesGoal: 'परिवारको लक्ष्य', fundraising: 'सहयोग संकलन लक्ष्य: <strong>£400 / महिना</strong> · <strong>£4,800 / वर्ष</strong>',
      supportIndex: '०६ / सहयोग', supportTitle: 'भविष्यका लागि<br /><em>ठाउँ बनाऔँ।</em>', supportCopy: 'प्रति बालबालिका मासिक £20 / $25 नै बताइएको सहयोग रकम हो। यसले विद्यालय शुल्क, भर्ना, युनिफर्म, जुत्ता, किताब, लेखन सामग्री, ट्युसन र सरसफाइ वा आधारभूत स्वास्थ्य सामग्रीमा सहयोग गर्न सक्छ।', supportNote: 'यो फारम सहयोग गर्ने प्रक्रियाको नमुना हो। यहाँ कुनै भुक्तानी लिइँदैन।', supportImageNote: 'हेरचाह सबैको साझा काम हो।', donationLegend: 'मासिक सहयोग रकम छान्नुहोस्', donationOther: 'अन्य', donationCustomLabel: 'अन्य मासिक रकम', donationSummary: 'तपाईंको मासिक सहयोग', donationButton: 'सहयोग जारी राख्नुहोस्',
      contactIndex: '०७ / सम्पर्क', contactTitle: 'सँगै<br /><em>मद्दत गरौँ।</em>', contactIntro: 'सहयोग, च्यारिटी पसल वा यहाँबाट कसरी साथ दिने भन्नेबारे प्रश्न छ? सन्देश पठाउनुहोस् वा तलका सम्पर्क विवरण प्रयोग गर्नुहोस्।', phone: '<span>फोन</span>+977 9707551689', email: '<span>इमेल</span>ialsohelpcharity@gmail.com', map: '<span>हामीलाई भेट्नुहोस्</span>Google Maps मा च्यारिटी पसलको स्थान खोल्नुहोस्', basedIn: '<span>स्थान</span>रानीपौवा / पोखरा, नेपाल', nameLabel: 'तपाईंको नाम', emailLabel: 'इमेल ठेगाना', messageLabel: 'हामी कसरी सहयोग गर्न सक्छौँ?', contactButton: 'सन्देश पठाउनुहोस्',
      safeguardingTitle: 'सम्मान र बाल सुरक्षा सम्बन्धी सूचना', safeguardingCopy: 'हामी बालबालिकाको नाम, उमेर, पारिवारिक अवस्था र अन्य संवेदनशील विवरण गोप्य राख्छौँ। यो वेबसाइटले कार्यक्रम स्तरको सहयोग मात्र देखाउँछ र तस्बिरहरू सावधानीपूर्वक प्रयोग गर्छ। उचित अनुमति र सुरक्षा समीक्षा बिना व्यक्तिगत कथा वा पहिचान खुल्ने विवरण प्रकाशित गर्न अनुरोध नगर्नुहोस्।', footerIntro: 'सानो सानो कदमसँगै कामलाई साथ दिनुहोस्।', newsletterLabel: 'तपाईंको इमेल ठेगाना', newsletterButton: 'जोडिनुहोस्', footerAbout: 'हाम्रो बारेमा', footerPrograms: 'कार्यक्रम', footerSupport: 'सहयोग', footerContact: 'सम्पर्क', footerBio: 'बायो साइट', footerTagline: 'शिक्षा, हेरचाह र समुदायका लागि।', cookieCopy: 'यो साइटले भाषा र सूचना प्राथमिकताका लागि आवश्यक ब्राउजर भण्डारण मात्र प्रयोग गर्छ।', cookieButton: 'बुझें', skipLink: 'मुख्य सामग्रीमा जानुहोस्', customPlaceholder: 'रकम', newsletterPlaceholder: 'तपाईंको इमेल ठेगाना', newsletterAria: 'अपडेटका लागि जोडिनुहोस्', brandAria: 'आईएचसी च्यारिटीको मुख्य पृष्ठ', navigationAria: 'मुख्य मेनु', figuresAria: 'IAHC का हालका तथ्याङ्क', footerNavigationAria: 'फुटर मेनु', cookieAria: 'कुकी सूचना', heroImageAlt: 'पोखराको I Also Help च्यारिटी पसलमा कपडा र खेलौना हेर्दै गरेका मानिसहरू', founderImageAlt: 'I Also Help च्यारिटीकी संस्थापक राधा राना', directorImageAlt: 'I Also Help च्यारिटीका व्यवस्थापन निर्देशक दिराज गोतामे', suppliesImageAlt: 'समुदायको सहयोगबाट पाएका विद्यालय सामग्री समातेका बालबालिका', shopImageAlt: 'पोखराको I Also Help च्यारिटी पसलमा राखिएका कपडा र दानका सामान', impactImageAlt: 'पोखरामा दान गरिएका सामग्री बाँड्दै गरेको समुदाय', supportImageAlt: 'हेरचाह र सहयोग जनाउन जोडिएका हातहरू'
    }
  };
  const feedbackCopy = {
    en: { required: 'Please fill in this field.', invalidEmail: 'Please enter a valid email address.', contactCheck: 'Please check the highlighted fields.', contactReady: 'Thank you — your message was sent to IAHC. If this is the first submission, check ialsohelpcharity@gmail.com for the activation link.', newsletterThanks: 'Thank you — your email was sent to IAHC. If this is the first submission, check ialsohelpcharity@gmail.com for the activation link.', formError: 'Sorry — we could not send this right now. Please try again or email ialsohelpcharity@gmail.com directly.', donationThanks: 'Thank you — the real payment connection is marked as a TODO in README.md.', donationOne: 'Enough to sponsor one child’s stated monthly support.', donationMore: 'A larger monthly gift can support more than one child’s stated program needs.', donationFlexible: 'A flexible contribution toward education and basic needs.' },
    ne: { required: 'कृपया यो ठाउँ भर्नुहोस्।', invalidEmail: 'कृपया सही इमेल ठेगाना लेख्नुहोस्।', contactCheck: 'कृपया रातो देखाइएका ठाउँहरू जाँच गर्नुहोस्।', contactReady: 'धन्यवाद — तपाईंको सन्देश IAHC मा पठाइयो। पहिलो पटक हो भने ialsohelpcharity@gmail.com मा आएको सक्रिय गर्ने इमेल खोल्नुहोस्।', newsletterThanks: 'धन्यवाद — तपाईंको इमेल IAHC मा पठाइयो। पहिलो पटक हो भने ialsohelpcharity@gmail.com मा आएको सक्रिय गर्ने इमेल खोल्नुहोस्।', formError: 'माफ गर्नुहोस् — अहिले पठाउन सकिएन। फेरि प्रयास गर्नुहोस् वा ialsohelpcharity@gmail.com मा सिधै इमेल गर्नुहोस्।', donationThanks: 'धन्यवाद — वास्तविक भुक्तानी जडान README.md मा गर्न बाँकी छ।', donationOne: 'यो रकमले एक बालबालिकाको बताइएको मासिक सहयोग धान्न सक्छ।', donationMore: 'ठूलो मासिक सहयोगले एकभन्दा बढी बालबालिकाको कार्यक्रम आवश्यकतामा साथ दिन सक्छ।', donationFlexible: 'शिक्षा र आधारभूत आवश्यकताका लागि तपाईंको इच्छाअनुसार सहयोग।' }
  };
  const languageToggle = $('[data-language-toggle]');
  let language = localStorage.getItem('iahc-language') || 'en';
  const applyPageCopy = () => {
    const dictionary = pageCopy[language];
    Object.entries(pageTargets).forEach(([key, selector]) => {
      const element = $(selector);
      if (element && dictionary[key]) element.innerHTML = dictionary[key];
    });
    Object.entries(pageAttributes).forEach(([key, [selector, attribute]]) => {
      const element = $(selector);
      if (element && dictionary[key]) element.setAttribute(attribute, dictionary[key]);
    });
    document.title = language === 'ne' ? 'आईएचसी च्यारिटी | पोखरामा शिक्षा सहयोग' : 'I Also Help Charity | Education support in Pokhara, Nepal';
    $('meta[name="description"]')?.setAttribute('content', language === 'ne' ? 'आईएचसी च्यारिटी पोखरामा बालबालिकालाई शिक्षा र आधारभूत आवश्यकतामा सहयोग गर्ने समुदायमा आधारित संस्था हो।' : 'I Also Help Charity is a community-based charity in Ranipouwa, Pokhara, supporting children through education and basic needs.');
    $('[data-menu-toggle]')?.setAttribute('aria-label', language === 'en' ? 'Open menu' : 'मेनु खोल्नुहोस्');
  };
  const applyLanguage = () => {
    const dictionary = translations[language];
    document.documentElement.lang = language === 'ne' ? 'ne' : 'en';
    $$('[data-i18n]').forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value) element.innerHTML = value;
    });
    applyPageCopy();
    if (languageToggle) {
      languageToggle.textContent = language === 'en' ? 'नेपाली' : 'English';
      languageToggle.setAttribute('aria-label', language === 'en' ? 'नेपालीमा भाषा बदल्नुहोस्' : 'Switch language to English');
    }
  };
  languageToggle?.addEventListener('click', () => {
    language = language === 'en' ? 'ne' : 'en';
    localStorage.setItem('iahc-language', language);
    applyLanguage();
    window.dispatchEvent(new CustomEvent('iahc-language-change'));
  });
  applyLanguage();

  const donationForm = $('[data-donation-form]');
  const donationTotal = $('[data-donation-total]');
  const donationMessage = $('[data-donation-message]');
  const customWrap = $('[data-custom-wrap]');
  const customInput = $('#custom-amount');
  const updateDonation = () => {
    const selected = $('input[name="amount"]:checked', donationForm);
    const custom = selected?.value === 'custom';
    if (customWrap) customWrap.hidden = !custom;
    const amount = custom ? Number(customInput?.value || 0) : Number(selected?.value || 20);
    if (donationTotal) donationTotal.textContent = amount > 0 ? `£${amount}` : '£—';
    if (donationMessage) donationMessage.textContent = amount === 20 ? feedbackCopy[language].donationOne : amount > 20 ? feedbackCopy[language].donationMore : feedbackCopy[language].donationFlexible;
    $$('[name="amount"]', donationForm).forEach((input) => input.closest('label')?.classList.toggle('selected', input.checked));
  };
  $$('input[name="amount"]', donationForm).forEach((input) => input.addEventListener('change', updateDonation));
  customInput?.addEventListener('input', updateDonation);
  window.addEventListener('iahc-language-change', updateDonation);
  updateDonation();
  $('[data-donation-submit]')?.addEventListener('click', () => {
    const status = $('[data-donation-status]');
    if (status) status.textContent = feedbackCopy[language].donationThanks;
  });

  const validateField = (field) => {
    const value = field.value.trim();
    let message = '';
    if (!value) message = feedbackCopy[language].required;
    else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) message = feedbackCopy[language].invalidEmail;
    const wrapper = field.closest('.form-field');
    wrapper?.classList.toggle('has-error', Boolean(message));
    const error = $(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = message;
    return !message;
  };
  const contactForm = $('[data-contact-form]');
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valid = $$('input[required], textarea[required]', contactForm).every(validateField);
    const status = $('[data-contact-status]');
    if (!valid) { status.textContent = feedbackCopy[language].contactCheck; return; }
    const submit = $('button[type="submit"]', contactForm);
    if (submit) submit.disabled = true;
    try {
      const response = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error('Form submission failed');
      status.textContent = feedbackCopy[language].contactReady;
      contactForm.reset();
    } catch {
      status.textContent = feedbackCopy[language].formError;
    } finally {
      if (submit) submit.disabled = false;
    }
  });
  $$('[data-contact-form] input, [data-contact-form] textarea').forEach((field) => field.addEventListener('blur', () => validateField(field)));

  const newsletterForm = $('[data-newsletter-form]');
  newsletterForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = $('input[type="email"]', newsletterForm);
    const status = $('[data-newsletter-status]');
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) { status.textContent = feedbackCopy[language].invalidEmail; email.focus(); return; }
    const submit = $('button[type="submit"]', newsletterForm);
    if (submit) submit.disabled = true;
    try {
      const response = await fetch(newsletterForm.action, { method: 'POST', body: new FormData(newsletterForm), headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error('Newsletter submission failed');
      status.textContent = feedbackCopy[language].newsletterThanks;
      newsletterForm.reset();
    } catch {
      status.textContent = feedbackCopy[language].formError;
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  const cookieNotice = $('[data-cookie-notice]');
  if (localStorage.getItem('iahc-cookie-dismissed') === 'true') cookieNotice?.classList.add('is-hidden');
  $('[data-cookie-dismiss]')?.addEventListener('click', () => { localStorage.setItem('iahc-cookie-dismissed', 'true'); cookieNotice?.classList.add('is-hidden'); });
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
