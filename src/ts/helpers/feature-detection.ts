/** feature detection if browser supports `passive` event-listener */
let passiveSupported = false;

// feature detection if passive event listener are supported
try {
  const options = Object.defineProperty({}, "passive", {
    get() { passiveSupported = true; },
  });
  window.addEventListener("test", null as any, options); // test add enpyt evt listener
} catch (err) { /** ignore */}

/**
 * If true browser supports `passive` event listerners
 */
export const supportsPassiveEventListener: boolean = passiveSupported;
