import QRCode from 'qrcode';

async function generateDataUrl(text){
  return QRCode.toDataURL(text, { margin: 2, scale: 6 });
}

export { generateDataUrl };


//generatres QR code as data url for the given text. Used to generate QR codes for farmers, validators etc.