import EmberObject from '@ember/object';
import { assign } from '@ember/polyfills';
import BlobUtil from 'blob-util';
import { Promise } from 'rsvp';
import randomString from '../utils/random-string';

const loadImage = src => new Promise((resolve, reject) => {
  let image = new Image();
  image.onload = () => {
    resolve(image);
  }
  image.onerror = () => {
    reject(new Error('Failed to load image'));
  }
  image.src = src;
});

const loadImageFile = async file => {
  let data = await BlobUtil.blobToDataURL(file);
  return await loadImage(data);
};

const max = 4 / 5;

export const calculateBounds = (iw, ih) => {
  let aspect = iw / ih;

  if(aspect >= max) {
    return {
      width: iw,
      height: ih,
      x: 0,
      y: 0
    };
  }

  let width  = Math.ceil(ih * max);
  let height = ih;

  let x = (width / 2) - (iw / 2);
  let y = 0;

  let r = {
    width,
    height,
    x,
    y
  };

  return r;
}

const createCanvas = (width, height) => {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

export default EmberObject.extend({

  file: null,
  filename: null,
  value: null,

  isRunning: true,
  isFinished: false,
  isError: false,
  error: null,

  init() {
    this._super(...arguments);
    this.invoke();
  },

  async perform() {
    let file = this.file;
    let image = await loadImageFile(file);
    let { width, height } = image;
    let bounds = calculateBounds(width, height);
    let { canvas, ctx } = createCanvas(bounds.width, bounds.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, bounds.x, bounds.y);
    let value = canvas.toDataURL('image/png', 1);
    let filename = `square-${randomString(8)}.png`;
    return { value, filename };
  },

  async invoke() {
    try {
      let props = await this.perform();
      this.setProperties(assign({
        isRunning: false,
        isFinished: true,
      }, props));
    } catch(err) {
      this.setProperties({
        isRunning: false,
        isError: true,
        error: err
      });
    }
  },

});
