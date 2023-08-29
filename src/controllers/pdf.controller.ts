import { Request, Response } from 'express';
import { PDFOptions } from 'puppeteer';
import path from 'path';
import pdf2img from 'pdf-img-convert';
import fs from 'fs';

import { launchPuppeteer, closePuppeteer } from '@/utils/puppeteer';

import { TemplateInformation } from '@/types/pdf';

export const onPdfGeneration = async (req: Request, res: Response) => {
    // try {
    //     const filePath = path.join(__dirname, '../public/pdf/output.pdf');
    //     const pdf = await generatePdf(req, filePath);
    //     res.set({
    //         'Content-Type': 'application/pdf',
    //         'Content-Disposition': 'attachment; filename="document.pdf"',
    //         'Content-Length': pdf.length,
    //     }).send(pdf);
    // } catch (error) {
    //     res.send(error);
    // }
};

export const onPdfPreview = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../public/pdf/output.pdf');
        await generatePdf(req, filePath);

        const pdfArray = await pdf2img.convert(filePath, {
            scale: 1.8,
        });

        let filePaths: string[] = [];
        for (let i = 0; i < pdfArray.length; i++) {
            fs.writeFile(
                path.join(__dirname, `../public/pdf/temp/output-${i}.png`),
                pdfArray[i],
                error => {
                    if (error) {
                        console.error('Error: ' + error);
                    }
                }
            );
            filePaths = filePaths.concat(`/pdf/temp/output-${i}.png`);
        }

        res.send(filePaths);
    } catch (error) {
        res.status(404).send(error);
    }
};

export const generatePdf = async (req: Request, filePath: string = '') => {
    try {
        const { body, templateInformation } = req.body as {
            body: string;
            templateInformation: TemplateInformation;
        };

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

        const options: PDFOptions = {
            format: 'A4',
            printBackground: false,
            displayHeaderFooter: true,
            headerTemplate: header,
            path: filePath
                ? filePath
                : path.resolve(__dirname, '../public/pdf/output.pdf'),
            margin: {
                top: 72,
                bottom: 72,
                left: 72,
                right: 72,
            },
            scale: 1.33,
        };

        const pdf = await page.pdf(options);
        await closePuppeteer(browser);

        return pdf;
    } catch (error) {
        console.log(error);
    }
};
