'use client'
import toast from 'react-hot-toast';
import enTranslation from './locale/en.json'
import { store } from '../redux/store'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import { useSelector } from 'react-redux';
import { logoutSuccess } from '../redux/reuducer/authSlice';
import { useJsApiLoader } from '@react-google-maps/api';


export const placeholderImage = (e) => {
  let settings = store.getState()?.Settings?.data?.data

  const placeholderLogo = settings?.placeholder_image

  if (placeholderLogo) {
    e.target.src = placeholderLogo;
  }
};
// check user login
// is login user check
export const isLogin = () => {
  // Use the selector to access user data
  const userData = store.getState()?.UserSignup?.data
  // Check if the token exists
  if (userData?.token) {
    return true;
  }

  return false;
};


export const IsLandingPageOn = () => {
  let settings = store.getState()?.Settings?.data?.data
  return Number(settings?.show_landing_page)
}


export const getDefaultLatLong = () => {
  let settings = store.getState()?.Settings?.data?.data
  const default_latitude = Number(settings?.default_latitude)
  const default_longitude = Number(settings?.default_longitude)

  const defaultLetLong = {
    latitude: default_latitude,
    longitude: default_longitude
  }
  return defaultLetLong
}

export const getPlaceApiKey = () => {
  let settings = store.getState()?.Settings?.data?.data
  return settings?.place_api_key
}



export const getSlug = (pathname) => {
  const segments = pathname.split('/');
  return segments[segments.length - 1];
}



// function for formate date or time 
export const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();

  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days === 0) {
    return t("today");
  } else if (days === 1) {
    return t("yesterday");
  } else if (days < 30) {
    return `${days} ${t("daysAgo")}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${t('month')}${months > 1 ? t("s") : ''} ${t("ago")}`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} ${t("year")}${years > 1 ? t("s") : ''} ${t("ago")}`;
  }
};

// Function to format large numbers as strings with K, M, and B abbreviations
export const formatPriceAbbreviated = (price) => {
  // const settingsData = store.getState()?.Settings.data.data;
  // const isSuffix = Number(settingsData?.number_with_suffix)
  // if (isSuffix) {
  // if (price >= 1000000000) {
  //   return (price / 1000000000).toFixed(1) + 'B';
  // } else if (price >= 1000000) {
  //   return (price / 1000000).toFixed(1) + 'M';
  // } else if (price >= 1000) {
  //   return (price / 1000).toFixed(1) + 'K';
  // } else {
  //   return price?.toString();
  // }
  // }
  // else {
  //   return price
  // }
  return price
};

// utils/stickyNote.js
export const createStickyNote = () => {
  const stickyNote = document.createElement('div');
  stickyNote.style.position = 'fixed';
  stickyNote.style.bottom = '0';
  stickyNote.style.width = '100%';
  stickyNote.style.backgroundColor = '#ffffff';
  stickyNote.style.color = '#000000';
  stickyNote.style.padding = '10px';
  stickyNote.style.textAlign = 'center';
  stickyNote.style.fontSize = '14px';
  stickyNote.style.zIndex = '99999';

  const closeButton = document.createElement('span');
  closeButton.style.cursor = 'pointer';
  closeButton.style.float = 'right';
  closeButton.innerHTML = '&times;';

  closeButton.onclick = function () {
    document.body.removeChild(stickyNote);
  };

  const link = document.createElement('a');
  link.style.textDecoration = 'underline';
  link.style.color = '#3498db';
  link.innerText = 'Download Now';

  link.href = process.env.NEXT_PUBLIC_APPSTORE_ID;
  stickyNote.innerHTML = 'Chat and Notification features are not supported on this browser. For a better user experience, please use our mobile application. ';
  stickyNote.appendChild(closeButton);
  stickyNote.appendChild(link);

  document.body.appendChild(stickyNote);
};

export const t = (label) => {
  const langData = store.getState().CurrentLanguage?.language?.file_name && store.getState().CurrentLanguage?.language?.file_name[label];

  if (langData) {

    return langData;
  } else {
    return enTranslation[label];
  }
};

const ERROR_CODES = {
  'auth/user-not-found': t('userNotFound'),
  'auth/wrong-password': t('invalidPassword'),
  'auth/email-already-in-use': t('emailInUse'),
  'auth/invalid-email': t('invalidEmail'),
  'auth/user-disabled': t('userAccountDisabled'),
  'auth/too-many-requests': t('tooManyRequests'),
  'auth/operation-not-allowed': t('operationNotAllowed'),
  'auth/internal-error': t('internalError'),
  'auth/invalid-login-credentials': t('incorrectDetails'),
  'auth/invalid-credential': t('incorrectDetails'),
  'auth/admin-restricted-operation': t('adminOnlyOperation'),
  'auth/already-initialized': t('alreadyInitialized'),
  'auth/app-not-authorized': t('appNotAuthorized'),
  'auth/app-not-installed': t('appNotInstalled'),
  'auth/argument-error': t('argumentError'),
  'auth/captcha-check-failed': t('captchaCheckFailed'),
  'auth/code-expired': t('codeExpired'),
  'auth/cordova-not-ready': t('cordovaNotReady'),
  'auth/cors-unsupported': t('corsUnsupported'),
  'auth/credential-already-in-use': t('credentialAlreadyInUse'),
  'auth/custom-token-mismatch': t('customTokenMismatch'),
  'auth/requires-recent-login': t('requiresRecentLogin'),
  'auth/dependent-sdk-initialized-before-auth': t('dependentSdkInitializedBeforeAuth'),
  'auth/dynamic-link-not-activated': t('dynamicLinkNotActivated'),
  'auth/email-change-needs-verification': t('emailChangeNeedsVerification'),
  'auth/emulator-config-failed': t('emulatorConfigFailed'),
  'auth/expired-action-code': t('expiredActionCode'),
  'auth/cancelled-popup-request': t('cancelledPopupRequest'),
  'auth/invalid-api-key': t('invalidApiKey'),
  'auth/invalid-app-credential': t('invalidAppCredential'),
  'auth/invalid-app-id': t('invalidAppId'),
  'auth/invalid-user-token': t('invalidUserToken'),
  'auth/invalid-auth-event': t('invalidAuthEvent'),
  'auth/invalid-cert-hash': t('invalidCertHash'),
  'auth/invalid-verification-code': t('invalidVerificationCode'),
  'auth/invalid-continue-uri': t('invalidContinueUri'),
  'auth/invalid-cordova-configuration': t('invalidCordovaConfiguration'),
  'auth/invalid-custom-token': t('invalidCustomToken'),
  'auth/invalid-dynamic-link-domain': t('invalidDynamicLinkDomain'),
  'auth/invalid-emulator-scheme': t('invalidEmulatorScheme'),
  'auth/invalid-message-payload': t('invalidMessagePayload'),
  'auth/invalid-multi-factor-session': t('invalidMultiFactorSession'),
  'auth/invalid-oauth-client-id': t('invalidOauthClientId'),
  'auth/invalid-oauth-provider': t('invalidOauthProvider'),
  'auth/invalid-action-code': t('invalidActionCode'),
  'auth/unauthorized-domain': t('unauthorizedDomain'),
  'auth/invalid-persistence-type': t('invalidPersistenceType'),
  'auth/invalid-phone-number': t('invalidPhoneNumber'),
  'auth/invalid-provider-id': t('invalidProviderId'),
  'auth/invalid-recaptcha-action': t('invalidRecaptchaAction'),
  'auth/invalid-recaptcha-token': t('invalidRecaptchaToken'),
  'auth/invalid-recaptcha-version': t('invalidRecaptchaVersion'),
  'auth/invalid-recipient-email': t('invalidRecipientEmail'),
  'auth/invalid-req-type': t('invalidReqType'),
  'auth/invalid-sender': t('invalidSender'),
  'auth/invalid-verification-id': t('invalidVerificationId'),
  'auth/invalid-tenant-id': t('invalidTenantId'),
  'auth/multi-factor-info-not-found': t('multiFactorInfoNotFound'),
  'auth/multi-factor-auth-required': t('multiFactorAuthRequired'),
  'auth/missing-android-pkg-name': t('missingAndroidPkgName'),
  'auth/missing-app-credential': t('missingAppCredential'),
  'auth/auth-domain-config-required': t('authDomainConfigRequired'),
  'auth/missing-client-type': t('missingClientType'),
  'auth/missing-verification-code': t('missingVerificationCode'),
  'auth/missing-continue-uri': t('missingContinueUri'),
  'auth/missing-iframe-start': t('missingIframeStart'),
  'auth/missing-ios-bundle-id': t('missingIosBundleId'),
  'auth/missing-multi-factor-info': t('missingMultiFactorInfo'),
  'auth/missing-multi-factor-session': t('missingMultiFactorSession'),
  'auth/missing-or-invalid-nonce': t('missingOrInvalidNonce'),
  'auth/missing-phone-number': t('missingPhoneNumber'),
  'auth/missing-recaptcha-token': t('missingRecaptchaToken'),
  'auth/missing-recaptcha-version': t('missingRecaptchaVersion'),
  'auth/missing-verification-id': t('missingVerificationId'),
  'auth/app-deleted': t('appDeleted'),
  'auth/account-exists-with-different-credential': t('accountExistsWithDifferentCredential'),
  'auth/network-request-failed': t('networkRequestFailed'),
  'auth/no-auth-event': t('noAuthEvent'),
  'auth/no-such-provider': t('noSuchProvider'),
  'auth/null-user': t('nullUser'),
  'auth/operation-not-supported-in-this-environment': t('operationNotSupportedInThisEnvironment'),
  'auth/popup-blocked': t('popupBlocked'),
  'auth/popup-closed-by-user': t('popupClosedByUser'),
  'auth/provider-already-linked': t('providerAlreadyLinked'),
  'auth/quota-exceeded': t('quotaExceeded'),
  'auth/recaptcha-not-enabled': t('recaptchaNotEnabled'),
  'auth/redirect-cancelled-by-user': t('redirectCancelledByUser'),
  'auth/redirect-operation-pending': t('redirectOperationPending'),
  'auth/rejected-credential': t('rejectedCredential'),
  'auth/second-factor-already-in-use': t('secondFactorAlreadyInUse'),
  'auth/maximum-second-factor-count-exceeded': t('maximumSecondFactorCountExceeded'),
  'auth/tenant-id-mismatch': t('tenantIdMismatch'),
  'auth/timeout': t('timeout'),
  'auth/user-token-expired': t('userTokenExpired'),
  'auth/unauthorized-continue-uri': t('unauthorizedContinueUri'),
  'auth/unsupported-first-factor': t('unsupportedFirstFactor'),
  'auth/unsupported-persistence-type': t('unsupportedPersistenceType'),
  'auth/unsupported-tenant-operation': t('unsupportedTenantOperation'),
  'auth/unverified-email': t('unverifiedEmail'),
  'auth/user-cancelled': t('userCancelled'),
  'auth/user-mismatch': t('userMismatch'),
  'auth/user-signed-out': t('userSignedOut'),
  'auth/weak-password': t('weakPassword'),
  'auth/web-storage-unsupported': t('webStorageUnsupported')
};


// Error handling function
export const handleFirebaseAuthError = (errorCode) => {

  // Check if the error code exists in the global ERROR_CODES object
  if (ERROR_CODES.hasOwnProperty(errorCode)) {
    // If the error code exists, log the corresponding error message
    toast.error(ERROR_CODES[errorCode]);
  } else {
    // If the error code is not found, log a generic error message
    toast.error(`${t('errorOccurred')}:${errorCode}`)
  }
  // Optionally, you can add additional logic here to handle the error
  // For example, display an error message to the user, redirect to an error page, etc.
}


export const truncate = (text, maxLength) => {
  // Check if text is undefined or null
  if (!text) {
    return ""; // or handle the case as per your requirement
  }

  const stringText = String(text);

  // If the text length is less than or equal to maxLength, return the original text
  if (stringText.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return stringText?.slice(0, maxLength) + "...";
  }
}

export const formatDateMonth = (timestamp) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${month} ${parseInt(day, 10)}, ${year}`;

  return formattedDate;
};





export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.Settings;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key
  if (StripeKey) {
    ``
    return StripeKey
  }
  return false;
}


export const convertToMp3 = async (blob) => {
  // Initialize FFmpeg
  const ffmpeg = createFFmpeg({ log: true });

  try {
    // Load FFmpeg
    await ffmpeg.load();

    // Write the audio Blob to FFmpeg's file system
    ffmpeg.FS('writeFile', 'input.webm', await fetchFile(blob));

    // Run FFmpeg command to convert the audio to MP3
    await ffmpeg.run('-i', 'input.webm', 'output.mp3');

    // Read the converted MP3 file from FFmpeg's file system
    const mp3Data = ffmpeg.FS('readFile', 'output.mp3');

    // Create a Blob from the MP3 data
    const mp3Blob = new Blob([mp3Data.buffer], { type: 'audio/mp3' });

    // Return the MP3 Blob
    return mp3Blob;
  } catch (error) {
    console.error('Error converting audio to MP3:', error);
    throw error;
  } finally {
    // Clean up FFmpeg resources
    await ffmpeg.FS('unlink', 'input.webm');
    await ffmpeg.FS('unlink', 'output.mp3');
    await ffmpeg.exit();
  }
};


// check is Rtl
export const useIsRtl = () => {
  const lang = useSelector(CurrentLanguageData);
  return lang?.rtl === true;
};


export const logout = () => {
  // Dispatch the logout action
  store.dispatch(logoutSuccess());

  // Redirect to the home page
  // Router.push('/');
};



// Load Google Maps
export const loadGoogleMaps = () => {
  let settings = store.getState()?.Settings?.data?.data
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: settings?.place_api_key,
    libraries: ['geometry', 'drawing', 'places'], // Include 'places' library
  });
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove all characters that are not lowercase letters, digits, spaces, or hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};


// Create a temporary element to measure the width of category names

export const measureCategoryWidth = (categoryName) => {
  const tempElement = document.createElement('span');
  tempElement.style.display = 'inline-block';
  tempElement.style.visibility = 'hidden';
  tempElement.style.position = 'absolute';
  tempElement.innerText = categoryName;
  document.body.appendChild(tempElement);
  const width = tempElement.offsetWidth + 15; //icon width(12) + gap(3) between category and icon
  document.body.removeChild(tempElement);
  return width;
};