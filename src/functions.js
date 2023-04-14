/* eslint-disable no-unused-vars */
import fs from 'fs';
// import readline from 'readline';
import path, { resolve } from 'path';
import { readdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import url from 'node:url';

// ---------Evalua que el path sea abs y hace la lectura del abs-------
export const evaluatePath = (pathUser) => {
  let pathNormalize = pathUser;
  if (path.isAbsolute(pathUser)) {
    return pathUser;
  }
  pathNormalize = path.resolve(pathNormalize).replace(/\\/g, '/');
  return pathNormalize;
};
// ----------Evalua si existe el path-------------
export const isPathTrue = (pathUser) => fs.existsSync(pathUser);

// -------------retorna el contenido de un dir ---------------
export const contentDir = (pathUser) => fs.readdirSync(pathUser);

// ------------- función para conocer la extensión---------------
export const filextname = (pathUser) => path.extname(pathUser);

// ----------- función para unir path y el archivo ------------
export const joinPath = (pathAbs, file) => path.join(pathAbs, file);

// ------------ leer de forma asincrona ----------------------
// eslint-disable-next-line no-shadow
export const readFileUser = (pathUser) => new Promise((resolve, reject) => {
  fs.readFile(pathUser, 'utf8', (error, data) => {
    // eslint-disable-next-line no-unused-expressions
    error ? reject(error) : resolve(data);
  });
});
// ----------- Obtiene los links de un md -------------------
export const getLinks = (data, pathUser) => {
  const arrayLinks = [];
  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  const dataLinks = data.match(regex);
  for (let i = 0; i < dataLinks.length; i++) {
    const hostLink = new URL(dataLinks[i]);
    arrayLinks.push({
      href: dataLinks[i].replace(')', ''),
      host: hostLink.host,
      pathText: pathUser,
    });
  }
  return arrayLinks;
};
// eslint-disable-next-line no-shadow
export const petitionHTTP = (link) => new Promise((resolve, reject) => {
  fetch(link, { method: 'HEAD' })
    .then((response) => {
      const petition = {};
      if (response.status >= 200 && response.status < 400) {
        // eslint-disable-next-line no-unused-expressions
        petition.Status = response.status;
        petition.ok = 'ok';
      } else {
        // eslint-disable-next-line no-unused-expressions
        petition.Status = response.status;
        petition.ok = 'fail';
      }
      resolve(petition);
    })
    .catch((error) => {
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      reject(error);
    });
});
export const validateLinks = (arrayLinks) => {
  const promises = arrayLinks.map((link) => {
    const linkHref = link.href;
    return petitionHTTP(linkHref);
  });
  return Promise.all(promises);
};
export const joinArrays = (arr1, arr2) => arr1.map((obj, i) => ({ ...obj, ...arr2[i] }));
