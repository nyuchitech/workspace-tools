/**
 * Nyuchi Email Signature Generator - Gmail Add-on
 *
 * Self-service email signature generator for Nyuchi Africa brands.
 * Each user can generate and apply their own branded email signature.
 *
 * Supported Brands:
 * - Nyuchi Africa (and divisions: Lingo, Learning, Development, Foundation)
 * - Mukoko (and Mukoko News, Mukoko ID)
 * - Zimbabwe Travel Information
 * - Technology Leaders of Africa
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const BRANDS = {
  nyuchi: {
    name: 'Nyuchi Africa',
    tagline: 'I am because we are',
    website: 'nyuchi.com',
    websiteUrl: 'https://nyuchi.com',
    logo: 'https://assets.nyuchi.com/logos/nyuchi/Nyuchi_Africa_Logo_dark.svg',
    socials: {
      linkedin: 'https://www.linkedin.com/company/nyuchi/',
      facebook: 'https://facebook.com/nyuchigroup',
      instagram: 'https://instagram.com/nyuchi.africa'
    }
  },
  lingo: {
    name: 'Nyuchi Lingo',
    tagline: 'Language Learning for Africa',
    website: 'lingo.nyuchi.com',
    websiteUrl: 'https://lingo.nyuchi.com',
    logo: 'https://assets.nyuchi.com/logos/nyuchi/Nyuchi_Lingo_Logo_dark.svg',
    parent: 'Nyuchi Africa',
    socials: {
      linkedin: 'https://www.linkedin.com/company/nyuchi/',
      instagram: 'https://instagram.com/nyuchi.africa'
    }
  },
  learning: {
    name: 'Nyuchi Learning',
    tagline: 'Education for All',
    website: 'learning.nyuchi.com',
    websiteUrl: 'https://learning.nyuchi.com',
    logo: 'https://assets.nyuchi.com/logos/nyuchi/Nyuchi_Learning_Logo_dark.svg',
    parent: 'Nyuchi Africa',
    socials: {
      linkedin: 'https://www.linkedin.com/company/nyuchi/'
    }
  },
  development: {
    name: 'Nyuchi Development',
    tagline: 'Building Digital Africa',
    website: 'services.nyuchi.com',
    websiteUrl: 'https://services.nyuchi.com',
    logo: 'https://assets.nyuchi.com/logos/nyuchi/Nyuchi_Development_Logo_dark.svg',
    parent: 'Nyuchi Africa',
    socials: {
      linkedin: 'https://www.linkedin.com/company/nyuchi/'
    }
  },
  foundation: {
    name: 'Nyuchi Foundation',
    tagline: 'Empowering Communities',
    website: 'foundation.nyuchi.com',
    websiteUrl: 'https://foundation.nyuchi.com',
    logo: 'https://assets.nyuchi.com/logos/nyuchi/Nyuchi_Foundation_Logo_dark.svg',
    parent: 'Nyuchi Africa',
    socials: {
      linkedin: 'https://www.linkedin.com/company/nyuchi/'
    }
  },
  mukoko: {
    name: 'Mukoko',
    tagline: 'Your Digital Twin Ecosystem',
    website: 'mukoko.com',
    websiteUrl: 'https://mukoko.com',
    logo: 'https://assets.nyuchi.com/logos/mukoko/Mukoko_Logo_dark.png',
    socials: {
      facebook: 'https://facebook.com/mukokoafrica',
      instagram: 'https://instagram.com/mukoko.africa'
    }
  },
  mukokoNews: {
    name: 'Mukoko News',
    tagline: 'Pan-African Journalism',
    website: 'news.mukoko.com',
    websiteUrl: 'https://news.mukoko.com',
    logo: 'https://assets.nyuchi.com/logos/mukoko/Mukoko_News_Logo_dark.png',
    parent: 'Mukoko',
    socials: {
      facebook: 'https://facebook.com/mukokoafrica',
      instagram: 'https://instagram.com/mukoko.africa'
    }
  },
  travel: {
    name: 'Zimbabwe Travel Information',
    tagline: 'Discover the Heart of Africa',
    website: 'travel-info.co.zw',
    websiteUrl: 'https://travel-info.co.zw',
    logo: 'https://assets.nyuchi.com/logos/zti/Zimbabwe_Travel_Information_Logo_dark.png',
    socials: {
      twitter: 'https://x.com/zimbabwetravel',
      instagram: 'https://instagram.com/zimbabwe.travel'
    }
  },
  techLeaders: {
    name: 'Technology Leaders of Africa',
    tagline: 'Leading African Innovation',
    website: 'techdirectors.africa',
    websiteUrl: 'https://techdirectors.africa',
    logo: 'https://assets.nyuchi.com/logos/technology-leaders/Technology_Leaders_Logo_dark.png',
    socials: {
      linkedin: 'https://www.linkedin.com/company/technology-leaders-africa/'
    }
  }
};

const COLORS = {
  primary: '#5f5873',
  text: '#2a2a2a',
  muted: '#737373',
  flagGreen: '#729b63',
  flagYellow: '#f6ad55',
  flagRed: '#d4634a',
  flagBlack: '#171717',
  flagWhite: '#ffffff'
};

// Social media icon URLs (using reliable CDN)
const SOCIAL_ICONS = {
  linkedin: 'https://cdn-icons-png.flaticon.com/512/3536/3536505.png',
  twitter: 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png',
  facebook: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png',
  instagram: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
  whatsapp: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'
};

// ============================================================================
// MAIN ENTRY POINTS
// ============================================================================

/**
 * Homepage trigger - shows the main card when add-on is opened
 */
function onHomepage(e) {
  return buildMainCard();
}

/**
 * Compose trigger - inserts signature into email draft
 */
function onComposeInsert(e) {
  const settings = getUserSettings();

  if (!settings.name || !settings.email) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Please configure your signature first by clicking on the add-on icon.'))
      .build();
  }

  const signatureHtml = generateSignatureHtml(settings);

  const response = CardService.newUpdateDraftActionResponseBuilder()
    .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
      .addUpdateContent(signatureHtml, CardService.ContentType.MUTABLE_HTML)
      .setUpdateType(CardService.UpdateDraftBodyType.INSERT_AT_END))
    .build();

  return response;
}

// ============================================================================
// CARD BUILDERS
// ============================================================================

/**
 * Build the main configuration card
 */
function buildMainCard() {
  const settings = getUserSettings();
  const userEmail = Session.getActiveUser().getEmail();

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Email Signature Generator')
      .setSubtitle('Nyuchi Africa Brands')
      .setImageUrl('https://assets.nyuchi.com/logos/nyuchi/Nyuchi_Africa_Logo_dark.svg')
      .setImageStyle(CardService.ImageStyle.SQUARE));

  // Brand Selection Section
  const brandSection = CardService.newCardSection()
    .setHeader('Select Your Brand');

  const brandDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName('brand')
    .setTitle('Brand')
    .setOnChangeAction(CardService.newAction().setFunctionName('onBrandChange'));

  // Add brand options grouped by parent
  brandDropdown.addItem('Nyuchi Africa', 'nyuchi', settings.brand === 'nyuchi');
  brandDropdown.addItem('  - Nyuchi Lingo', 'lingo', settings.brand === 'lingo');
  brandDropdown.addItem('  - Nyuchi Learning', 'learning', settings.brand === 'learning');
  brandDropdown.addItem('  - Nyuchi Development', 'development', settings.brand === 'development');
  brandDropdown.addItem('  - Nyuchi Foundation', 'foundation', settings.brand === 'foundation');
  brandDropdown.addItem('Mukoko', 'mukoko', settings.brand === 'mukoko');
  brandDropdown.addItem('  - Mukoko News', 'mukokoNews', settings.brand === 'mukokoNews');
  brandDropdown.addItem('Zimbabwe Travel', 'travel', settings.brand === 'travel');
  brandDropdown.addItem('Tech Leaders of Africa', 'techLeaders', settings.brand === 'techLeaders');

  brandSection.addWidget(brandDropdown);
  card.addSection(brandSection);

  // Personal Information Section
  const personalSection = CardService.newCardSection()
    .setHeader('Personal Information');

  personalSection.addWidget(CardService.newTextInput()
    .setFieldName('name')
    .setTitle('Full Name')
    .setValue(settings.name || '')
    .setHint('e.g., Bryan Fawcett'));

  personalSection.addWidget(CardService.newTextInput()
    .setFieldName('title')
    .setTitle('Job Title')
    .setValue(settings.title || '')
    .setHint('e.g., CEO & Founder'));

  personalSection.addWidget(CardService.newTextInput()
    .setFieldName('email')
    .setTitle('Email')
    .setValue(settings.email || userEmail)
    .setHint('e.g., bryan@nyuchi.com'));

  personalSection.addWidget(CardService.newTextInput()
    .setFieldName('phone')
    .setTitle('Phone (optional)')
    .setValue(settings.phone || '')
    .setHint('e.g., +65 9814 3374'));

  personalSection.addWidget(CardService.newTextInput()
    .setFieldName('profileImage')
    .setTitle('Profile Image URL (optional)')
    .setValue(settings.profileImage || '')
    .setHint('https://...'));

  card.addSection(personalSection);

  // Social Links Section
  const socialSection = CardService.newCardSection()
    .setHeader('Social Links (optional)')
    .setCollapsible(true)
    .setNumUncollapsibleWidgets(0);

  socialSection.addWidget(CardService.newTextInput()
    .setFieldName('linkedin')
    .setTitle('LinkedIn')
    .setValue(settings.linkedin || '')
    .setHint('https://linkedin.com/in/...'));

  socialSection.addWidget(CardService.newTextInput()
    .setFieldName('twitter')
    .setTitle('X / Twitter')
    .setValue(settings.twitter || '')
    .setHint('https://x.com/...'));

  socialSection.addWidget(CardService.newTextInput()
    .setFieldName('facebook')
    .setTitle('Facebook')
    .setValue(settings.facebook || '')
    .setHint('https://facebook.com/...'));

  socialSection.addWidget(CardService.newTextInput()
    .setFieldName('instagram')
    .setTitle('Instagram')
    .setValue(settings.instagram || '')
    .setHint('https://instagram.com/...'));

  socialSection.addWidget(CardService.newTextInput()
    .setFieldName('whatsapp')
    .setTitle('WhatsApp Number')
    .setValue(settings.whatsapp || '')
    .setHint('263771234567 (no + sign)'));

  card.addSection(socialSection);

  // Promo Banner Section
  const promoSection = CardService.newCardSection()
    .setHeader('Promotional Banner (optional)')
    .setCollapsible(true)
    .setNumUncollapsibleWidgets(0);

  promoSection.addWidget(CardService.newTextInput()
    .setFieldName('promoBanner')
    .setTitle('Banner Image URL')
    .setValue(settings.promoBanner || '')
    .setHint('https://...'));

  promoSection.addWidget(CardService.newTextInput()
    .setFieldName('promoLink')
    .setTitle('Banner Link URL')
    .setValue(settings.promoLink || '')
    .setHint('https://...'));

  card.addSection(promoSection);

  // Actions Section
  const actionSection = CardService.newCardSection();

  // Save & Preview Button
  actionSection.addWidget(CardService.newTextButton()
    .setText('Save & Preview Signature')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor(COLORS.primary)
    .setOnClickAction(CardService.newAction().setFunctionName('saveAndPreview')));

  // Apply to Gmail Button
  actionSection.addWidget(CardService.newTextButton()
    .setText('Apply to Gmail')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor('#1a73e8')
    .setOnClickAction(CardService.newAction().setFunctionName('applyToGmail')));

  card.addSection(actionSection);

  return card.build();
}

/**
 * Build the signature preview card
 */
function buildPreviewCard(settings) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Signature Preview')
      .setSubtitle('Review your signature'));

  const previewSection = CardService.newCardSection();

  // Show a text representation since Cards can't render raw HTML
  const brand = BRANDS[settings.brand] || BRANDS.nyuchi;

  previewSection.addWidget(CardService.newDecoratedText()
    .setTopLabel('Name')
    .setText(settings.name || 'Not set'));

  previewSection.addWidget(CardService.newDecoratedText()
    .setTopLabel('Title')
    .setText(settings.title || 'Not set'));

  previewSection.addWidget(CardService.newDecoratedText()
    .setTopLabel('Email')
    .setText(settings.email || 'Not set'));

  if (settings.phone) {
    previewSection.addWidget(CardService.newDecoratedText()
      .setTopLabel('Phone')
      .setText(settings.phone));
  }

  previewSection.addWidget(CardService.newDivider());

  previewSection.addWidget(CardService.newDecoratedText()
    .setTopLabel('Brand')
    .setText(brand.name));

  previewSection.addWidget(CardService.newDecoratedText()
    .setTopLabel('Tagline')
    .setText(brand.tagline));

  previewSection.addWidget(CardService.newDecoratedText()
    .setTopLabel('Website')
    .setText(brand.website));

  if (brand.parent) {
    previewSection.addWidget(CardService.newDecoratedText()
      .setTopLabel('Parent Company')
      .setText(brand.parent));
  }

  card.addSection(previewSection);

  // Social Links Preview
  const socials = [];
  if (settings.linkedin) socials.push('LinkedIn');
  if (settings.twitter) socials.push('X/Twitter');
  if (settings.facebook) socials.push('Facebook');
  if (settings.instagram) socials.push('Instagram');
  if (settings.whatsapp) socials.push('WhatsApp');

  if (socials.length > 0) {
    const socialSection = CardService.newCardSection()
      .setHeader('Social Links');

    socialSection.addWidget(CardService.newDecoratedText()
      .setText(socials.join(' | ')));

    card.addSection(socialSection);
  }

  // Actions
  const actionSection = CardService.newCardSection();

  actionSection.addWidget(CardService.newTextButton()
    .setText('Apply to Gmail')
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
    .setBackgroundColor('#1a73e8')
    .setOnClickAction(CardService.newAction().setFunctionName('applyToGmail')));

  actionSection.addWidget(CardService.newTextButton()
    .setText('Back to Edit')
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
    .setOnClickAction(CardService.newAction().setFunctionName('backToMain')));

  card.addSection(actionSection);

  return card.build();
}

/**
 * Build success card after applying signature
 */
function buildSuccessCard() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Success!')
      .setSubtitle('Your signature has been applied'));

  const section = CardService.newCardSection();

  section.addWidget(CardService.newTextParagraph()
    .setText('Your new email signature has been applied to Gmail. It will appear in all new emails you compose.'));

  section.addWidget(CardService.newTextParagraph()
    .setText('To test it, compose a new email and you should see your signature at the bottom.'));

  section.addWidget(CardService.newDivider());

  section.addWidget(CardService.newTextButton()
    .setText('Edit Signature')
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT)
    .setOnClickAction(CardService.newAction().setFunctionName('backToMain')));

  card.addSection(section);

  return card.build();
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

/**
 * Handle brand change
 */
function onBrandChange(e) {
  const brand = e.formInput.brand;
  const settings = getUserSettings();
  settings.brand = brand;

  // Update socials from brand defaults if user hasn't set them
  const brandConfig = BRANDS[brand];
  if (brandConfig && brandConfig.socials) {
    if (!settings.linkedin && brandConfig.socials.linkedin) {
      settings.linkedin = brandConfig.socials.linkedin;
    }
    if (!settings.twitter && brandConfig.socials.twitter) {
      settings.twitter = brandConfig.socials.twitter;
    }
    if (!settings.facebook && brandConfig.socials.facebook) {
      settings.facebook = brandConfig.socials.facebook;
    }
    if (!settings.instagram && brandConfig.socials.instagram) {
      settings.instagram = brandConfig.socials.instagram;
    }
  }

  saveUserSettings(settings);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .updateCard(buildMainCard()))
    .build();
}

/**
 * Save settings and show preview
 */
function saveAndPreview(e) {
  const formInput = e.formInput;

  const settings = {
    brand: formInput.brand || 'nyuchi',
    name: formInput.name || '',
    title: formInput.title || '',
    email: formInput.email || '',
    phone: formInput.phone || '',
    profileImage: formInput.profileImage || '',
    linkedin: formInput.linkedin || '',
    twitter: formInput.twitter || '',
    facebook: formInput.facebook || '',
    instagram: formInput.instagram || '',
    whatsapp: formInput.whatsapp || '',
    promoBanner: formInput.promoBanner || '',
    promoLink: formInput.promoLink || ''
  };

  // Validate required fields
  if (!settings.name || !settings.email) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Please fill in your name and email address.'))
      .build();
  }

  saveUserSettings(settings);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .pushCard(buildPreviewCard(settings)))
    .build();
}

/**
 * Apply signature to Gmail
 */
function applyToGmail(e) {
  // First save any form input
  if (e.formInput) {
    const formInput = e.formInput;
    const settings = {
      brand: formInput.brand || 'nyuchi',
      name: formInput.name || '',
      title: formInput.title || '',
      email: formInput.email || '',
      phone: formInput.phone || '',
      profileImage: formInput.profileImage || '',
      linkedin: formInput.linkedin || '',
      twitter: formInput.twitter || '',
      facebook: formInput.facebook || '',
      instagram: formInput.instagram || '',
      whatsapp: formInput.whatsapp || '',
      promoBanner: formInput.promoBanner || '',
      promoLink: formInput.promoLink || ''
    };
    saveUserSettings(settings);
  }

  const settings = getUserSettings();

  // Validate required fields
  if (!settings.name || !settings.email) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Please fill in your name and email address first.'))
      .build();
  }

  try {
    const signatureHtml = generateSignatureHtml(settings);
    const userEmail = Session.getActiveUser().getEmail();

    // Apply signature using Gmail API
    Gmail.Users.Settings.SendAs.update(
      { signature: signatureHtml },
      'me',
      userEmail
    );

    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation()
        .pushCard(buildSuccessCard()))
      .setNotification(CardService.newNotification()
        .setText('Signature applied successfully!'))
      .build();

  } catch (error) {
    Logger.log('Error applying signature: ' + error.message);

    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Error applying signature: ' + error.message))
      .build();
  }
}

/**
 * Navigate back to main card
 */
function backToMain(e) {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .popToRoot()
      .updateCard(buildMainCard()))
    .build();
}

/**
 * Reset all settings
 */
function resetSettings(e) {
  PropertiesService.getUserProperties().deleteAllProperties();

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation()
      .updateCard(buildMainCard()))
    .setNotification(CardService.newNotification()
      .setText('Settings have been reset.'))
    .build();
}

// ============================================================================
// SIGNATURE GENERATION
// ============================================================================

/**
 * Generate the HTML signature
 */
function generateSignatureHtml(settings) {
  const brand = BRANDS[settings.brand] || BRANDS.nyuchi;

  // Build social icons HTML
  let socialIconsHtml = '';
  const socialLinks = [];

  if (settings.linkedin) {
    socialLinks.push(`<td style="padding-right: 8px;"><a href="${escapeHtml(settings.linkedin)}" style="text-decoration: none;"><img src="${SOCIAL_ICONS.linkedin}" alt="LinkedIn" width="24" height="24" style="display: block; border-radius: 4px;"></a></td>`);
  }
  if (settings.twitter) {
    socialLinks.push(`<td style="padding-right: 8px;"><a href="${escapeHtml(settings.twitter)}" style="text-decoration: none;"><img src="${SOCIAL_ICONS.twitter}" alt="X" width="24" height="24" style="display: block; border-radius: 4px;"></a></td>`);
  }
  if (settings.facebook) {
    socialLinks.push(`<td style="padding-right: 8px;"><a href="${escapeHtml(settings.facebook)}" style="text-decoration: none;"><img src="${SOCIAL_ICONS.facebook}" alt="Facebook" width="24" height="24" style="display: block; border-radius: 4px;"></a></td>`);
  }
  if (settings.instagram) {
    socialLinks.push(`<td style="padding-right: 8px;"><a href="${escapeHtml(settings.instagram)}" style="text-decoration: none;"><img src="${SOCIAL_ICONS.instagram}" alt="Instagram" width="24" height="24" style="display: block; border-radius: 4px;"></a></td>`);
  }
  if (settings.whatsapp) {
    const waLink = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`;
    socialLinks.push(`<td style="padding-right: 8px;"><a href="${waLink}" style="text-decoration: none;"><img src="${SOCIAL_ICONS.whatsapp}" alt="WhatsApp" width="24" height="24" style="display: block; border-radius: 4px;"></a></td>`);
  }

  if (socialLinks.length > 0) {
    socialIconsHtml = `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
        <tbody>
          <tr>${socialLinks.join('')}</tr>
        </tbody>
      </table>`;
  }

  // Profile image HTML
  let profileImageHtml = '';
  if (settings.profileImage) {
    profileImageHtml = `
      <td style="vertical-align: top; padding-right: 16px;">
        <img src="${escapeHtml(settings.profileImage)}" alt="Profile" width="80" height="80" style="border-radius: 50%; display: block;">
      </td>`;
  }

  // Phone HTML
  let phoneHtml = '';
  if (settings.phone) {
    const phoneClean = settings.phone.replace(/\s/g, '');
    phoneHtml = `
      <tr>
        <td style="padding-bottom: 3px;">
          <a href="tel:${phoneClean}" style="color: ${COLORS.primary}; text-decoration: none;">${escapeHtml(settings.phone)}</a>
        </td>
      </tr>`;
  }

  // Parent company attribution
  let parentHtml = '';
  if (brand.parent) {
    parentHtml = `
      <tr>
        <td style="padding-top: 8px;">
          <span style="font-size: 11px; color: ${COLORS.muted};">A division of ${brand.parent}</span>
        </td>
      </tr>`;
  }

  // Promo banner HTML
  let promoBannerHtml = '';
  if (settings.promoBanner) {
    const promoLink = settings.promoLink || '#';
    promoBannerHtml = `
      <tr>
        <td colspan="2" style="padding-top: 16px;">
          <a href="${escapeHtml(promoLink)}" style="text-decoration: none;">
            <img src="${escapeHtml(settings.promoBanner)}" alt="Promotion" width="400" style="display: block; max-width: 100%; height: auto; border-radius: 8px;">
          </a>
        </td>
      </tr>`;
  }

  // Generate the signature HTML
  return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${COLORS.text}; max-width: 500px;">
  <tbody>
    <tr>
      ${profileImageHtml}
      <td style="vertical-align: top;">
        <span style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 17px; font-weight: 700; color: ${COLORS.text};">
          ${escapeHtml(settings.name)}
        </span>
        <br>
        <span style="font-size: 13px; font-weight: 500; color: ${COLORS.muted};">
          ${escapeHtml(settings.title)}
        </span>
        <br><br>
        <span style="font-family: 'Noto Serif', Georgia, serif; font-size: 15px; font-weight: 700; color: ${COLORS.primary};">
          ${escapeHtml(brand.name)}
        </span>
        <br>
        <span style="font-size: 12px; font-style: italic; color: ${COLORS.muted};">
          ${escapeHtml(brand.tagline)}
        </span>
        <br><br>
        <table cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; color: ${COLORS.muted};">
          <tbody>
            <tr>
              <td style="padding-bottom: 3px;">
                <a href="mailto:${escapeHtml(settings.email)}" style="color: ${COLORS.primary}; text-decoration: none;">
                  ${escapeHtml(settings.email)}
                </a>
              </td>
            </tr>
            ${phoneHtml}
            <tr>
              <td>
                <a href="${brand.websiteUrl}" style="color: ${COLORS.primary}; text-decoration: none;">
                  ${brand.website}
                </a>
              </td>
            </tr>
            ${parentHtml}
          </tbody>
        </table>
        ${socialIconsHtml}
      </td>
    </tr>
    ${promoBannerHtml}
  </tbody>
</table>
`.trim();
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Get user settings from Properties Service
 */
function getUserSettings() {
  const props = PropertiesService.getUserProperties();
  const settingsJson = props.getProperty('signatureSettings');

  if (settingsJson) {
    try {
      return JSON.parse(settingsJson);
    } catch (e) {
      Logger.log('Error parsing settings: ' + e.message);
    }
  }

  // Return default settings
  return {
    brand: 'nyuchi',
    name: '',
    title: '',
    email: Session.getActiveUser().getEmail() || '',
    phone: '',
    profileImage: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
    promoBanner: '',
    promoLink: ''
  };
}

/**
 * Save user settings to Properties Service
 */
function saveUserSettings(settings) {
  const props = PropertiesService.getUserProperties();
  props.setProperty('signatureSettings', JSON.stringify(settings));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

/**
 * Test signature generation with sample data
 */
function testSignatureGeneration() {
  const testSettings = {
    brand: 'nyuchi',
    name: 'Bryan Fawcett',
    title: 'CEO & Founder',
    email: 'bryan@nyuchi.com',
    phone: '+65 9814 3374',
    profileImage: '',
    linkedin: 'https://www.linkedin.com/company/nyuchi/',
    twitter: '',
    facebook: 'https://facebook.com/nyuchigroup',
    instagram: 'https://instagram.com/nyuchi.africa',
    whatsapp: '6598143374',
    promoBanner: '',
    promoLink: ''
  };

  const html = generateSignatureHtml(testSettings);
  Logger.log('Generated Signature HTML:');
  Logger.log(html);

  return html;
}

/**
 * Test applying signature to current user
 */
function testApplySignature() {
  const settings = getUserSettings();

  if (!settings.name) {
    settings.name = 'Test User';
    settings.title = 'Test Title';
    settings.email = Session.getActiveUser().getEmail();
    settings.brand = 'nyuchi';
  }

  const signatureHtml = generateSignatureHtml(settings);
  const userEmail = Session.getActiveUser().getEmail();

  try {
    Gmail.Users.Settings.SendAs.update(
      { signature: signatureHtml },
      'me',
      userEmail
    );
    Logger.log('Signature applied successfully to: ' + userEmail);
  } catch (error) {
    Logger.log('Error applying signature: ' + error.message);
  }
}
