import puppeteer, { PuppeteerLaunchOptions, Browser } from 'puppeteer';
import env from '@/utils/env';

const resolveLaunchOptions = () => {
    let launchOptions: PuppeteerLaunchOptions = { headless: 'new' };
    if (env.ENVIRONMENT === 'production') {
        launchOptions = {
            ...launchOptions,
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox'],
        };
    }

    return launchOptions;
};

export const launchPuppeteer = async () => {
    const options = resolveLaunchOptions();
    const browser = await puppeteer.launch(options);

    return browser;
};

export const closePuppeteer = async (browser: Browser) => {
    await browser.close();
};
