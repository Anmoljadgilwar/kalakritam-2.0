/**
 * @file pageOptimizationScript.js
 * @description Dynamically injects speculation rules for prefetching internal links to improve navigation performance.
 * This is part of the "Speed Brain" optimization strategy.
 */

/**
 * Checks if the Speculation Rules API is supported by the browser.
 * @returns {boolean} True if supported, false otherwise.
 */
const isSpeculationRulesSupported = () => {
    return HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');
};

/**
 * Injects or updates speculation rules in the document head.
 * It finds all internal links on the page and adds them to a prefetch list.
 */
export const updateSpeculationRules = () => {
    if (!isSpeculationRulesSupported()) {
        console.warn('Speculation Rules API is not supported in this browser.');
        return;
    }

    // Use a timeout to ensure the DOM has been updated by React
    setTimeout(() => {
        // Remove any existing speculation rules script to avoid duplicates
        const existingScript = document.querySelector('script[type="speculationrules"]');
        if (existingScript) {
            existingScript.remove();
        }

        // Find all unique internal links, excluding certain paths
        const internalLinks = [...new Set(
            Array.from(document.querySelectorAll('a'))
                .map(anchor => {
                    try {
                        return new URL(anchor.href);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(url => url && url.hostname === window.location.hostname)
                .map(url => url.pathname)
                .filter(path => path && !path.startsWith('/admin') && !path.includes('/login'))
        )];

        if (internalLinks.length === 0) {
            return;
        }

        const rules = {
            prefetch: [{
                "source": "list",
                "urls": internalLinks
            }]
        };

        const script = document.createElement('script');
        script.type = 'speculationrules';
        script.textContent = JSON.stringify(rules);
        document.head.appendChild(script);

    }, 100); // 100ms delay to allow for DOM updates
};
