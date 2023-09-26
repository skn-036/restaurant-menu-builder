import { Request, Response } from 'express';
import { PDFOptions } from 'puppeteer';
import path from 'path';
import pdf2img from 'pdf-img-convert';
import fs from 'fs';

import { launchPuppeteer, closePuppeteer } from '@/utils/puppeteer';
import { createDirectory } from '@/helpers/file';
import { resolveTemplateString } from '@/composables/resolve-template';

import { TemplateInformation } from '@/types/pdf';

export const onPdfGeneration = async (req: Request, res: Response) => {
    try {
        const pdf = await generatePdf(req);

        if (!pdf) {
            res.sendStatus(500);
            return;
        }
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="document.pdf"',
            'Content-Length': pdf.length,
        }).send(pdf);
    } catch (error) {
        res.send(error);
    }
};

export const onPdfPreview = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../public/pdf/output.pdf');
        await generatePdf(req, filePath);

        const pdfArray = await pdf2img.convert(filePath, {
            scale: 1.8,
        });

        const directory = path.join(__dirname, '../public/pdf/temp');
        createDirectory(directory, false);

        let filePaths: string[] = [];
        for (let i = 0; i < pdfArray.length; i++) {
            fs.writeFile(`${directory}/output-${i}.png`, pdfArray[i], error => {
                if (error) {
                    console.error('Error: ' + error);
                }
            });
            filePaths = filePaths.concat(`/pdf/temp/output-${i}.png`);
        }

        res.send(filePaths);
    } catch (error) {
        res.status(404).send(error);
    }
};

export const generatePdf = async (req: Request, filePath: string = '') => {
    try {
        const { templateInformation, templateString } = req.body as {
            templateInformation: TemplateInformation;
            templateString: string;
        };

        const body = templateString;

        const browser = await launchPuppeteer();
        const page = await browser.newPage();

        await page.setContent(body);
        const header = `<header style="position: fixed; width: 100%; height: 100%; top: 0; left: 0"><img width: 100%; height: 100%;" src="${templateInformation.template.background}"><div>Test header</div></header>`;

        await page.addStyleTag({
            content: `
              html {
                -webkit-print-color-adjust: exact !important;
                -webkit-filter: opacity(1) !important;
              }
              @media print {
                .wrapper-div {
                   break-inside: avoid;
                }
              }
            `,
        });

        const pdfFilePath = filePath ? filePath : undefined;

        if (pdfFilePath) createDirectory(pdfFilePath);

        const marginValue = 72;
        const scale =
            templateInformation.pageSize.size === 'A4' ? 1 : 1 * 0.705;

        const options: PDFOptions = {
            format: templateInformation.pageSize.size,
            printBackground: false,
            displayHeaderFooter: true,
            headerTemplate: header,
            path: pdfFilePath,
            margin: {
                top: marginValue,
                bottom: marginValue,
                left: marginValue,
                right: marginValue,
            },
            scale,
        };

        const pdf = await page.pdf(options);
        await closePuppeteer(browser);

        return pdf;
    } catch (error) {
        console.log(error);
    }
};
