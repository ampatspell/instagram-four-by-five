module.exports = function(app) {

  const { file: withTemporaryFile } = require('../util/tmp');
  const randomString = require('../util/random-string');

  const sharp = require('sharp');
  const uuid = require('uuid/v4');

  const TOKENS = 'firebaseStorageDownloadTokens';

  const composeURL = (filename, token) => {
    let bucket = app.bucket.name;
    let encodedName = encodeURIComponent(filename);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedName}?alt=media&token=${token}`;
  };

  const createURL = async file => {
    let [ root ] = await file.getMetadata();
    root.metadata = root.metadata || {};
    let tokens = root.metadata[TOKENS];
    if(!tokens) {
      tokens = [];
    } else {
      tokens = tokens.split(',');
    }

    if(tokens.length > 0) {
      return composeURL(file.name, tokens[0]);
    }

    let token = uuid();
    tokens.push(token);

    await file.setMetadata({
      metadata: {
        [TOKENS]: tokens.join(',')
      }
    });

    return composeURL(file.name, token);
  };

  const getSizeMetadata = async filename => {
    let metadata = await sharp(filename).metadata();
    let { width: w, height: h, orientation } = metadata;
    if(orientation < 5) {
      return {
        width: w,
        heigt: h
      };
    }
    return {
      width: h,
      height: w
    };
  };

  const calculateFrame = image => {
    const max = 4 / 5;
    const aspect = image.width / image.height;

    if(aspect >= max) {
      return {
        width: image.width,
        height: image.height,
        x: 0,
        y: 0
      };
    }

    let width = Math.ceil(image.height * max);
    let height = image.height;

    let x = Math.floor((width / 2) - (image.width / 2));
    let y = 0;

    return {
      width,
      height,
      x,
      y
    };
  };

  const processImage = (original, frame, destination) => withTemporaryFile(async tmp => {
    original = await sharp(original).rotate().toBuffer();
    await sharp({
      create: {
        width: frame.width,
        height: frame.height,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
    .overlayWith(original, {
      top: frame.y,
      left: frame.x
    })
    .jpeg({
      quality: 80
    })
    .toFile(tmp);

    let token = uuid();
    let filename = `four-by-five-${randomString(8)}.jpeg`;
    await app.bucket.upload(tmp, {
      destination,
      resumable: false,
      metadata: {
        contentType: 'image/jpeg',
        contentDisposition: `attachment; filename="${filename}"`,
        metadata: {
          [TOKENS]: token
        }
      }
    });

    return composeURL(destination, token);
  });

  // req: { directory, original, processed }
  // res: { original: { url }, processed: { url } }
  return async opts => withTemporaryFile(async tmp => {

    let originalFile = app.bucket.file(`${opts.directory}/${opts.original}`);
    await originalFile.download({ destination: tmp });

    let original = {
      url: await createURL(originalFile),
      size: await getSizeMetadata(tmp)
    };

    let frame = calculateFrame(original.size);

    let processed = {
      url: await processImage(tmp, frame, `${opts.directory}/${opts.processed}`),
      size: {
        width: frame.width,
        height: frame.height
      }
    };

    return {
      original,
      processed
    };
  });
}
