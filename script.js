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
    en: { navWhy: 'Why education', navAbout: 'About us', navPrograms: 'Programs', navShop: 'Charity shop', navImpact: 'Our impact', navContact: 'Contact', navSupport: 'Support us', heroEyebrow: 'IAHC Nepal · Ranipouwa, Pokhara', heroTitle: 'Hope begins<br><em>with education.</em>', heroLede: 'A small, community-based charity helping children stay in school, meet basic needs, and grow with dignity.', heroPrimary: 'Help keep a child in school', heroSecondary: 'See how it works', heroNote: 'Built from a second-hand shop, carried by local care.', whyTitle: 'A school place can<br><em>change the shape of a life.</em>', whyLede: 'In communities where a family may have to choose between food, rent, and a child’s school fees, staying in education is not guaranteed. IAHC comes alongside families with practical support, so children can learn without the fear of being sent home.' },
    ne: { navWhy: 'शिक्षा किन?', navAbout: 'हाम्रो बारेमा', navPrograms: 'कार्यक्रमहरू', navShop: 'च्यारिटी पसल', navImpact: 'हाम्रो प्रभाव', navContact: 'सम्पर्क', navSupport: 'सहयोग गर्नुहोस्', heroEyebrow: 'IAHC नेपाल · रानीपौवा, पोखरा', heroTitle: 'आशा सुरु हुन्छ<br><em>शिक्षाबाट।</em>', heroLede: 'बालबालिकालाई विद्यालयमा रहन, आधारभूत आवश्यकता पूरा गर्न र सम्मानका साथ अघि बढ्न सहयोग गर्ने समुदायमा आधारित सानो संस्था।', heroPrimary: 'बालबालिकाको शिक्षामा सहयोग गर्नुहोस्', heroSecondary: 'कसरी काम गर्छ हेर्नुहोस्', heroNote: 'सेकेन्ड-ह्यान्ड पसलबाट सुरु भएको, स्थानीय मायाले अघि बढेको।', whyTitle: 'विद्यालयको एउटा ठाउँले<br><em>जीवनको बाटो बदल्न सक्छ।</em>', whyLede: 'खाना, घरभाडा र विद्यालय शुल्कमध्ये रोज्नुपर्ने परिवारका लागि शिक्षामा रहनु निश्चित हुँदैन। IAHC परिवारसँगै उभिएर व्यावहारिक सहयोग गर्छ, ताकि बालबालिकाले विद्यालयबाट घर पठाइने डरबिना सिक्न सकून्।' }
  };
  const languageToggle = $('[data-language-toggle]');
  let language = localStorage.getItem('iahc-language') || 'en';
  const applyLanguage = () => {
    const dictionary = translations[language];
    document.documentElement.lang = language === 'ne' ? 'ne' : 'en';
    $$('[data-i18n]').forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value) element.innerHTML = value;
    });
    if (languageToggle) {
      languageToggle.textContent = language === 'en' ? 'नेपाली' : 'English';
      languageToggle.setAttribute('aria-label', `Switch language to ${language === 'en' ? 'Nepali' : 'English'}`);
    }
  };
  languageToggle?.addEventListener('click', () => {
    language = language === 'en' ? 'ne' : 'en';
    localStorage.setItem('iahc-language', language);
    applyLanguage();
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
    if (donationMessage) donationMessage.textContent = amount === 20 ? 'Enough to sponsor one child’s stated monthly support.' : amount > 20 ? 'A larger monthly gift can support more than one child’s stated program needs.' : 'A flexible contribution toward education and basic needs.';
    $$('[name="amount"]', donationForm).forEach((input) => input.closest('label')?.classList.toggle('selected', input.checked));
  };
  $$('input[name="amount"]', donationForm).forEach((input) => input.addEventListener('change', updateDonation));
  customInput?.addEventListener('input', updateDonation);
  updateDonation();
  $('[data-donation-submit]')?.addEventListener('click', () => {
    const status = $('[data-donation-status]');
    if (status) status.textContent = 'Thank you — the real payment connection is marked as a TODO in README.md.';
  });

  const validateField = (field) => {
    const value = field.value.trim();
    let message = '';
    if (!value) message = 'Please fill in this field.';
    else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) message = 'Please enter a valid email address.';
    const wrapper = field.closest('.form-field');
    wrapper?.classList.toggle('has-error', Boolean(message));
    const error = $(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = message;
    return !message;
  };

  const submitEmailForm = async (payload) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Unable to send your information right now.');
    return data;
  };

  const contactForm = $('[data-contact-form]');
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valid = $$('input[required], textarea[required]', contactForm).map(validateField).every(Boolean);
    const status = $('[data-contact-status]');
    if (!valid) { status.textContent = 'Please check the highlighted fields.'; return; }
    const button = $('button[type="submit"]', contactForm);
    const formData = new FormData(contactForm);
    button.disabled = true;
    contactForm.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your message…';
    try {
      await submitEmailForm({
        kind: 'contact',
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        website: String(formData.get('website') || '')
      });
      status.textContent = 'Thank you — your message has been sent to IAHC.';
      contactForm.reset();
    } catch (error) {
      status.textContent = error.message || 'Sorry, your message could not be sent. Please email or call IAHC directly.';
    } finally {
      button.disabled = false;
      contactForm.removeAttribute('aria-busy');
    }
  });
  $$('[data-contact-form] input, [data-contact-form] textarea').forEach((field) => field.addEventListener('blur', () => validateField(field)));

  const newsletterForm = $('[data-newsletter-form]');
  newsletterForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = $('input[type="email"]', newsletterForm);
    const status = $('[data-newsletter-status]');
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) { status.textContent = 'Please enter a valid email address.'; email.focus(); return; }
    const button = $('button[type="submit"]', newsletterForm);
    const website = $('input[name="website"]', newsletterForm);
    button.disabled = true;
    newsletterForm.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending…';
    try {
      await submitEmailForm({ kind: 'newsletter', email: email.value.trim(), website: website?.value || '' });
      status.textContent = 'Thank you — your email address has been sent to IAHC.';
      newsletterForm.reset();
    } catch (error) {
      status.textContent = error.message || 'Sorry, your email could not be sent. Please try again later.';
    } finally {
      button.disabled = false;
      newsletterForm.removeAttribute('aria-busy');
    }
  });

  const reliefModal = $('[data-relief-modal]');
  const reliefClose = $('[data-relief-close]');
  let reliefPreviousFocus = null;
  let reliefIsOpen = false;
  const closeReliefModal = () => {
    if (!reliefModal || !reliefIsOpen) return;
    reliefIsOpen = false;
    reliefModal.classList.remove('is-open');
    reliefModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('relief-modal-open');
    window.setTimeout(() => { if (!reliefIsOpen) reliefModal.hidden = true; }, 240);
    reliefPreviousFocus?.focus();
  };
  const openReliefModal = () => {
    if (!reliefModal || reliefIsOpen) return;
    reliefPreviousFocus = document.activeElement;
    reliefIsOpen = true;
    reliefModal.hidden = false;
    reliefModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('relief-modal-open');
    requestAnimationFrame(() => {
      reliefModal.classList.add('is-open');
      reliefClose?.focus();
    });
  };
  reliefClose?.addEventListener('click', closeReliefModal);
  reliefModal?.addEventListener('click', (event) => { if (event.target === reliefModal) closeReliefModal(); });
  document.addEventListener('keydown', (event) => {
    if (!reliefIsOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeReliefModal(); return; }
    if (event.key !== 'Tab' || !reliefClose) return;
    event.preventDefault();
    reliefClose.focus();
  });
  window.setTimeout(openReliefModal, 120);

  const cookieNotice = $('[data-cookie-notice]');
  if (localStorage.getItem('iahc-cookie-dismissed') === 'true') cookieNotice?.classList.add('is-hidden');
  $('[data-cookie-dismiss]')?.addEventListener('click', () => { localStorage.setItem('iahc-cookie-dismissed', 'true'); cookieNotice?.classList.add('is-hidden'); });
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
