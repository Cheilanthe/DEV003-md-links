import {
  expect, test, jest, it, describe,
} from '@jest/globals';
import {
  getLinks, petitionHTTP, evaluatePath,
// eslint-disable-next-line import/extensions
} from '../src/functions.js';
// eslint-disable-next-line import/extensions
import { mdLinks } from '../src/index.js';


const resultExpect = [{
  href: 'https://social-network-a6b7f.web.app/',
  host: 'social-network-a6b7f.web.app',
  pathText: 'C:/Users/D_Elizabeth/Laboratoria/proyecto3/DEV003-social-network/README.md',
  Status: 200,
  ok: 'ok',
}];

const resultExpect2 = [{
  href: 'https://social-network-a6b7f.web.app/',
  host: 'social-network-a6b7f.web.app',
  pathText: 'C:/Users/D_Elizabeth/Laboratoria/proyecto3/DEV003-social-network/README.md',
}];

// ----------------------- ---test de mdLinks ----------------------------------
test('describe mdLinks', () => {
  mdLinks()
    .then(() => {
      expect(mdLinks).toBe(typeof 'promise');
    })
    .catch((error) => { error });
});

// test para promesa con validate true ---------------------------
test('test that proves mdLinks with option true', () => {
  mdLinks('C:/Users/D_Elizabeth/Laboratoria/proyecto3/DEV003-social-network/README.md', { validate: true })
    .then((result) => {
      expect(result).toEqual(resultExpect);
    })
    .catch((error) => { error });
});
// test para validate false --------------------------------------
test('test that proves mdLinks with option false', () => {
  mdLinks('C:/Users/D_Elizabeth/Laboratoria/proyecto3/DEV003-social-network/README.md', { validate: false })
    .then((result) => {
      expect(result).toEqual(resultExpect2);
    })
    .catch((error) => { error });
});

// test cuando la función rechaza la promesa ---------------------
test('this proves mdLinks when the promise is reject', () => {
  mdLinks('C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/pruebas/prueba1.txt', { validate: true })
    .catch((error) => expect(error.message).toMatch('El archivo no tiene terminación .md'));
});
test('this proves mdLinks when the promise is reject', () => {
  mdLinks('C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/pruebas/prueba.txt', { validate: true })
    .catch((error) => expect(error.message).toMatch('El path no es válido'));
});

test('this proves mdLinks when the promise is reject', () => {
  mdLinks('C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/pruebas/PRUEBA2.md', { validate: true })
    .catch((error) => expect(error.message).toMatch('No hay links para validar'));
});
// --------------------- peticiones HTTP ----------------------------------
test('return the petition HTTP', () => {
  const resp = { Status: 404, ok: 'fail' };
  const link = 'https://css-tricks.com/oohcrap/';
  global.fetch = jest.fn().mockImplementation(() => Promise.resolve(
    {
      status: 404,
      ok: 'fail',
    // json: () => Promise.resolve(resp),
    },
  ));
  return petitionHTTP(link).then((data) => {
    expect(data).toEqual(resp);
  });
});
// ----------------- función que obtiene los links de un md--------------------

const getLinksMock = jest.fn().mockImplementationOnce(getLinks);
test('getLinks from a data', () => {
  const dataFake = '[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero muy popular entre developers';
  const pathFake = 'C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/pruebas/PRUEBA1.md';
  const arrayExpect = [{
    href: 'https://es.wikipedia.org/wiki/Markdown',
    host: 'es.wikipedia.org',
    pathText: 'C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/pruebas/PRUEBA1.md',
  }];
  expect(getLinksMock(dataFake, pathFake)).toEqual(arrayExpect);
});
// ----------- Nonmaliza los paths ------------------------
test('evaluate the path', () => {
  const pathe = '.\\pruebas\\prueba1.txt';
  const pathexpect = 'C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/pruebas/prueba1.txt';
  // const pathRelativ = './Laboratoria/proyecto4/DEV003-md-links';
  expect(evaluatePath(pathe)).toEqual(pathexpect);
});
