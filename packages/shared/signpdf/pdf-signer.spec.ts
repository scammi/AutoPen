import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PDFSigner } from './pdf-signer';
import { P12Signer } from '@/crypto/signers/p12.signer';

describe('PDFSigner', () => {
  let pdfSigner: PDFSigner;
  let p12Signer: P12Signer;
  let pdfBuffer: Buffer;
  let p12Buffer: Buffer;

  // Helper function to create test PDF
  async function createTestPDF(): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage([595, 842]); // A4 size

    page.setFont(timesRoman);

    // Add some test content
    page.drawText('Test PDF Document', {
      x: 50,
      y: 800,
      size: 20,
      color: rgb(0, 0, 0),
    });

    page.drawText('This is a test document created for digital signing.', {
      x: 50,
      y: 770,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(new Date().toISOString(), {
      x: 50,
      y: 750,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  beforeAll(() => {
    // Load test certificate
    p12Buffer = fs.readFileSync(
      path.join(__dirname, '..', '__fixtures__', 'test.p12'),
    );
  });

  beforeEach(async () => {
    pdfSigner = new PDFSigner();
    p12Signer = new P12Signer(p12Buffer, { passphrase: 'firmasoftware' });
    await p12Signer.initialize();

    // Create fresh test PDF for each test
    pdfBuffer = await createTestPDF();

    // Save unsigned test PDF to fixtures for manual inspection
    const fixturesDir = path.join(__dirname, '..', '__fixtures__');
    fs.writeFileSync(path.join(fixturesDir, 'test-unsigned.pdf'), pdfBuffer);
  });

  it('should sign a PDF with default options', async () => {
    const signedPdf = await pdfSigner.sign(pdfBuffer, p12Signer);

    expect(signedPdf).toBeDefined();
    expect(signedPdf instanceof Uint8Array).toBeTruthy();
    expect(signedPdf.length).toBeGreaterThan(pdfBuffer.length);

    // Save signed PDF for manual inspection
    const fixturesDir = path.join(__dirname, '..', '__fixtures__');
    fs.writeFileSync(
      path.join(fixturesDir, 'test-signed-default.pdf'),
      Buffer.from(signedPdf),
    );
  });

  it('should sign a PDF with custom options', async () => {
    const options = {
      reason: 'Testing signature',
      contactInfo: 'test@example.com',
      name: 'Test Signer',
      location: 'Test Location',
      signingTime: new Date('2024-01-01T00:00:00Z'),
    };

    const signedPdf = await pdfSigner.sign(pdfBuffer, p12Signer, options);

    expect(signedPdf).toBeDefined();
    expect(signedPdf instanceof Uint8Array).toBeTruthy();
    expect(signedPdf.length).toBeGreaterThan(pdfBuffer.length);

    // Save signed PDF for manual inspection
    const fixturesDir = path.join(__dirname, '..', '__fixtures__');
    fs.writeFileSync(
      path.join(fixturesDir, 'test-signed-custom.pdf'),
      Buffer.from(signedPdf),
    );
  });

  it('should accept both Buffer and Uint8Array inputs', async () => {
    const uint8ArrayPdf = new Uint8Array(pdfBuffer);

    const signedFromBuffer = await pdfSigner.sign(pdfBuffer, p12Signer);
    const signedFromUint8Array = await pdfSigner.sign(uint8ArrayPdf, p12Signer);

    // Save both versions for comparison
    const fixturesDir = path.join(__dirname, '..', '__fixtures__');
    fs.writeFileSync(
      path.join(fixturesDir, 'test-signed-buffer.pdf'),
      Buffer.from(signedFromBuffer),
    );
    fs.writeFileSync(
      path.join(fixturesDir, 'test-signed-uint8array.pdf'),
      Buffer.from(signedFromUint8Array),
    );

    expect(Buffer.from(signedFromBuffer)).toEqual(
      Buffer.from(signedFromUint8Array),
    );
  });

  it('should throw error with uninitialized signer', async () => {
    const uninitializedSigner = new P12Signer(Buffer.from('test'));
    await expect(
      pdfSigner.sign(pdfBuffer, uninitializedSigner),
    ).rejects.toThrow('Signer not initialized');
  });

  it.skip('should handle large PDFs', async () => {
    // Create a larger PDF with multiple pages
    const pdfDoc = await PDFDocument.create();
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Add 10 pages with content
    for (let i = 0; i < 10; i++) {
      const page = pdfDoc.addPage([595, 842]);
      page.setFont(timesRoman);
      page.drawText(`Page ${i + 1}`, {
        x: 50,
        y: 800,
        size: 20,
      });
      page.drawText('This is a test page with some content.'.repeat(20), {
        x: 50,
        y: 750,
        size: 12,
        maxWidth: 500,
      });
    }

    const largePdfBuffer = Buffer.from(await pdfDoc.save());

    // Save unsigned large PDF
    const fixturesDir = path.join(__dirname, '..', '__fixtures__');
    fs.writeFileSync(
      path.join(fixturesDir, 'test-large-unsigned.pdf'),
      largePdfBuffer,
    );

    const signedLargePdf = await pdfSigner.sign(largePdfBuffer, p12Signer);

    // Save signed large PDF
    fs.writeFileSync(
      path.join(fixturesDir, 'test-large-signed.pdf'),
      Buffer.from(signedLargePdf),
    );

    expect(signedLargePdf.length).toBeGreaterThan(largePdfBuffer.length);
  });
});