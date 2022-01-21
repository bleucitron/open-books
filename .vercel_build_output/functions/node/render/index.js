var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = target => __defProp(target, '__esModule', { value: true });
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])((fn = 0))), res;
  };
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (
    (module2 && typeof module2 === 'object') ||
    typeof module2 === 'function'
  ) {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== 'default')
        __defProp(target, key, {
          get: () => module2[key],
          enumerable:
            !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
        });
  }
  return target;
};
var __toModule = module2 => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        module2 && module2.__esModule && 'default' in module2
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true },
      ),
    ),
    module2,
  );
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError(
      '`uri` does not appear to be a Data URI (must begin with "data:")',
    );
  }
  uri = uri.replace(/\r?\n/g, '');
  const firstComma = uri.indexOf(',');
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError('malformed data: URI');
  }
  const meta = uri.substring(5, firstComma).split(';');
  let charset = '';
  let base64 = false;
  const type = meta[0] || 'text/plain';
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === 'base64') {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf('charset=') === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ';charset=US-ASCII';
    charset = 'US-ASCII';
  }
  const encoding = base64 ? 'base64' : 'ascii';
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* read(parts) {
  for (const part of parts) {
    if ('stream' in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
function isFormData(object) {
  return (
    typeof object === 'object' &&
    typeof object.append === 'function' &&
    typeof object.set === 'function' &&
    typeof object.get === 'function' &&
    typeof object.getAll === 'function' &&
    typeof object.delete === 'function' &&
    typeof object.keys === 'function' &&
    typeof object.values === 'function' &&
    typeof object.entries === 'function' &&
    typeof object.constructor === 'function' &&
    object[NAME] === 'FormData'
  );
}
function getHeader(boundary, name, field) {
  let header = '';
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || 'application/octet-stream'}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(
          `content size at ${data.url} over limit: ${data.size}`,
          'max-size',
        );
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(
        `Invalid response body while trying to fetch ${data.url}: ${error2.message}`,
        'system',
        error2,
      );
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every(c => typeof c === 'string')) {
        return Buffer.from(accum.join(''));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(
        `Could not create Buffer from response body for ${data.url}: ${error2.message}`,
        'system',
        error2,
      );
    }
  } else {
    throw new FetchError(
      `Premature close of server response while trying to fetch ${data.url}`,
    );
  }
}
function fromRawHeaders(headers2 = []) {
  return new Headers(
    headers2
      .reduce((result, value, index2, array) => {
        if (index2 % 2 === 0) {
          result.push(array.slice(index2, index2 + 2));
        }
        return result;
      }, [])
      .filter(([name, value]) => {
        try {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return true;
        } catch {
          return false;
        }
      }),
  );
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(
        `node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(
          /:$/,
          '',
        )}" is not supported.`,
      );
    }
    if (options2.protocol === 'data:') {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, {
        headers: { 'Content-Type': data.typeFull },
      });
      resolve2(response2);
      return;
    }
    const send = (
      options2.protocol === 'https:'
        ? import_https.default
        : import_http.default
    ).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError('The operation was aborted.');
      reject(error2);
      if (
        request.body &&
        request.body instanceof import_stream.default.Readable
      ) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit('error', error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener('abort', abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener('abort', abortAndFinalize);
      }
    };
    request_.on('error', err => {
      reject(
        new FetchError(
          `request to ${request.url} failed, reason: ${err.message}`,
          'system',
          err,
        ),
      );
      finalize();
    });
    request_.on('response', response_ => {
      request_.setTimeout(0);
      const headers2 = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers2.get('Location');
        const locationURL =
          location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case 'error':
            reject(
              new FetchError(
                `uri requested responds with a redirect, redirect mode is set to error: ${request.url}`,
                'no-redirect',
              ),
            );
            finalize();
            return;
          case 'manual':
            if (locationURL !== null) {
              try {
                headers2.set('Location', locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case 'follow': {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(
                new FetchError(
                  `maximum redirect reached at: ${request.url}`,
                  'max-redirect',
                ),
              );
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size,
            };
            if (
              response_.statusCode !== 303 &&
              request.body &&
              options_.body instanceof import_stream.default.Readable
            ) {
              reject(
                new FetchError(
                  'Cannot follow redirect with body being a readable stream',
                  'unsupported-redirect',
                ),
              );
              finalize();
              return;
            }
            if (
              response_.statusCode === 303 ||
              ((response_.statusCode === 301 || response_.statusCode === 302) &&
                request.method === 'POST')
            ) {
              requestOptions.method = 'GET';
              requestOptions.body = void 0;
              requestOptions.headers.delete('content-length');
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once('end', () => {
        if (signal) {
          signal.removeEventListener('abort', abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(
        response_,
        new import_stream.PassThrough(),
        error2 => {
          reject(error2);
        },
      );
      if (process.version < 'v12.10') {
        response_.on('aborted', abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers: headers2,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark,
      };
      const codings = headers2.get('Content-Encoding');
      if (
        !request.compress ||
        request.method === 'HEAD' ||
        codings === null ||
        response_.statusCode === 204 ||
        response_.statusCode === 304
      ) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH,
      };
      if (codings === 'gzip' || codings === 'x-gzip') {
        body = (0, import_stream.pipeline)(
          body,
          import_zlib.default.createGunzip(zlibOptions),
          error2 => {
            reject(error2);
          },
        );
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === 'deflate' || codings === 'x-deflate') {
        const raw = (0, import_stream.pipeline)(
          response_,
          new import_stream.PassThrough(),
          error2 => {
            reject(error2);
          },
        );
        raw.once('data', chunk => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(
              body,
              import_zlib.default.createInflate(),
              error2 => {
                reject(error2);
              },
            );
          } else {
            body = (0, import_stream.pipeline)(
              body,
              import_zlib.default.createInflateRaw(),
              error2 => {
                reject(error2);
              },
            );
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === 'br') {
        body = (0, import_stream.pipeline)(
          body,
          import_zlib.default.createBrotliDecompress(),
          error2 => {
            reject(error2);
          },
        );
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
var import_http,
  import_https,
  import_zlib,
  import_stream,
  import_util,
  import_crypto,
  import_url,
  src,
  dataUriToBuffer$1,
  Readable,
  wm,
  Blob2,
  fetchBlob,
  Blob$1,
  FetchBaseError,
  FetchError,
  NAME,
  isURLSearchParameters,
  isBlob,
  isAbortSignal,
  carriage,
  dashes,
  carriageLength,
  getFooter,
  getBoundary,
  INTERNALS$2,
  Body,
  clone,
  extractContentType,
  getTotalBytes,
  writeToStream,
  validateHeaderName,
  validateHeaderValue,
  Headers,
  redirectStatus,
  isRedirect,
  INTERNALS$1,
  Response,
  getSearch,
  INTERNALS,
  isRequest,
  Request,
  getNodeRequestOptions,
  AbortError,
  supportedSchemas;
var init_install_fetch = __esm({
  'node_modules/@sveltejs/kit/dist/install-fetch.js'() {
    init_shims();
    import_http = __toModule(require('http'));
    import_https = __toModule(require('https'));
    import_zlib = __toModule(require('zlib'));
    import_stream = __toModule(require('stream'));
    import_util = __toModule(require('util'));
    import_crypto = __toModule(require('crypto'));
    import_url = __toModule(require('url'));
    src = dataUriToBuffer;
    dataUriToBuffer$1 = src;
    ({ Readable } = import_stream.default);
    wm = new WeakMap();
    Blob2 = class {
      constructor(blobParts = [], options2 = {}) {
        let size = 0;
        const parts = blobParts.map(element => {
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(
              element.buffer,
              element.byteOffset,
              element.byteLength,
            );
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob2) {
            buffer = element;
          } else {
            buffer = Buffer.from(
              typeof element === 'string' ? element : String(element),
            );
          }
          size += buffer.length || buffer.size || 0;
          return buffer;
        });
        const type =
          options2.type === void 0 ? '' : String(options2.type).toLowerCase();
        wm.set(this, {
          type: /[^\u0020-\u007E]/.test(type) ? '' : type,
          size,
          parts,
        });
      }
      get size() {
        return wm.get(this).size;
      }
      get type() {
        return wm.get(this).type;
      }
      async text() {
        return Buffer.from(await this.arrayBuffer()).toString();
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of this.stream()) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        return Readable.from(read(wm.get(this).parts));
      }
      slice(start2 = 0, end2 = this.size, type = '') {
        const { size } = this;
        let relativeStart =
          start2 < 0 ? Math.max(size + start2, 0) : Math.min(start2, size);
        let relativeEnd =
          end2 < 0 ? Math.max(size + end2, 0) : Math.min(end2, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = wm.get(this).parts.values();
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            const chunk = part.slice(
              relativeStart,
              Math.min(size2, relativeEnd),
            );
            blobParts.push(chunk);
            added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
            relativeStart = 0;
            if (added >= span) {
              break;
            }
          }
        }
        const blob = new Blob2([], { type: String(type).toLowerCase() });
        Object.assign(wm.get(blob), { size: span, parts: blobParts });
        return blob;
      }
      get [Symbol.toStringTag]() {
        return 'Blob';
      }
      static [Symbol.hasInstance](object) {
        return (
          object &&
          typeof object === 'object' &&
          typeof object.stream === 'function' &&
          object.stream.length === 0 &&
          typeof object.constructor === 'function' &&
          /^(Blob|File)$/.test(object[Symbol.toStringTag])
        );
      }
    };
    Object.defineProperties(Blob2.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true },
    });
    fetchBlob = Blob2;
    Blob$1 = fetchBlob;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = object => {
      return (
        typeof object === 'object' &&
        typeof object.append === 'function' &&
        typeof object.delete === 'function' &&
        typeof object.get === 'function' &&
        typeof object.getAll === 'function' &&
        typeof object.has === 'function' &&
        typeof object.set === 'function' &&
        typeof object.sort === 'function' &&
        object[NAME] === 'URLSearchParams'
      );
    };
    isBlob = object => {
      return (
        typeof object === 'object' &&
        typeof object.arrayBuffer === 'function' &&
        typeof object.type === 'string' &&
        typeof object.stream === 'function' &&
        typeof object.constructor === 'function' &&
        /^(Blob|File)$/.test(object[NAME])
      );
    };
    isAbortSignal = object => {
      return typeof object === 'object' && object[NAME] === 'AbortSignal';
    };
    carriage = '\r\n';
    dashes = '-'.repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = boundary =>
      `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString('hex');
    INTERNALS$2 = Symbol('Body internals');
    Body = class {
      constructor(body, { size = 0 } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body));
        else if (Buffer.isBuffer(body));
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default);
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(
            formDataIterator(body, boundary),
          );
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null,
        };
        this.size = size;
        if (body instanceof import_stream.default) {
          body.on('error', err => {
            const error2 =
              err instanceof FetchBaseError
                ? err
                : new FetchError(
                    `Invalid response body while trying to fetch ${this.url}: ${err.message}`,
                    'system',
                    err,
                  );
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct =
          (this.headers && this.headers.get('content-type')) ||
          (this[INTERNALS$2].body && this[INTERNALS$2].body.type) ||
          '';
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct,
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true },
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error('cannot clone body after it is used');
      }
      if (
        body instanceof import_stream.default &&
        typeof body.getBoundary !== 'function'
      ) {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === 'string') {
        return 'text/plain;charset=UTF-8';
      }
      if (isURLSearchParameters(body)) {
        return 'application/x-www-form-urlencoded;charset=UTF-8';
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (
        Buffer.isBuffer(body) ||
        import_util.types.isAnyArrayBuffer(body) ||
        ArrayBuffer.isView(body)
      ) {
        return null;
      }
      if (body && typeof body.getBoundary === 'function') {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return 'text/plain;charset=UTF-8';
    };
    getTotalBytes = request => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === 'function') {
        return body.hasKnownLength && body.hasKnownLength()
          ? body.getLengthSync()
          : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName =
      typeof import_http.default.validateHeaderName === 'function'
        ? import_http.default.validateHeaderName
        : name => {
            if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
              const err = new TypeError(
                `Header name must be a valid HTTP token [${name}]`,
              );
              Object.defineProperty(err, 'code', {
                value: 'ERR_INVALID_HTTP_TOKEN',
              });
              throw err;
            }
          };
    validateHeaderValue =
      typeof import_http.default.validateHeaderValue === 'function'
        ? import_http.default.validateHeaderValue
        : (name, value) => {
            if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
              const err = new TypeError(
                `Invalid character in header content ["${name}"]`,
              );
              Object.defineProperty(err, 'code', { value: 'ERR_INVALID_CHAR' });
              throw err;
            }
          };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map(value => [name, value]));
          }
        } else if (init2 == null);
        else if (
          typeof init2 === 'object' &&
          !import_util.types.isBoxedPrimitive(init2)
        ) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== 'function') {
              throw new TypeError('Header pairs must be iterable');
            }
            result = [...init2]
              .map(pair => {
                if (
                  typeof pair !== 'object' ||
                  import_util.types.isBoxedPrimitive(pair)
                ) {
                  throw new TypeError(
                    'Each header pair must be an iterable object',
                  );
                }
                return [...pair];
              })
              .map(pair => {
                if (pair.length !== 2) {
                  throw new TypeError(
                    'Each header pair must be a name/value tuple',
                  );
                }
                return [...pair];
              });
          }
        } else {
          throw new TypeError(
            "Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)",
          );
        }
        result =
          result.length > 0
            ? result.map(([name, value]) => {
                validateHeaderName(name);
                validateHeaderValue(name, String(value));
                return [String(name).toLowerCase(), String(value)];
              })
            : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case 'append':
              case 'set':
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(
                    receiver,
                    String(name).toLowerCase(),
                    String(value),
                  );
                };
              case 'delete':
              case 'has':
              case 'getAll':
                return name => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(
                    receiver,
                    String(name).toLowerCase(),
                  );
                };
              case 'keys':
                return () => {
                  target.sort();
                  return new Set(
                    URLSearchParams.prototype.keys.call(target),
                  ).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          },
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(', ');
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback) {
        for (const name of this.keys()) {
          callback(this.get(name), name);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for('nodejs.util.inspect.custom')]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === 'host') {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(
      Headers.prototype,
      ['get', 'entries', 'forEach', 'values'].reduce((result, property) => {
        result[property] = { enumerable: true };
        return result;
      }, {}),
    );
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = code2 => {
      return redirectStatus.has(code2);
    };
    INTERNALS$1 = Symbol('Response internals');
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status || 200;
        const headers2 = new Headers(options2.headers);
        if (body !== null && !headers2.has('Content-Type')) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers2.append('Content-Type', contentType);
          }
        }
        this[INTERNALS$1] = {
          url: options2.url,
          status,
          statusText: options2.statusText || '',
          headers: headers2,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark,
        };
      }
      get url() {
        return this[INTERNALS$1].url || '';
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return (
          this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300
        );
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError(
            'Failed to execute "redirect" on "response": Invalid status code',
          );
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString(),
          },
          status,
        });
      }
      get [Symbol.toStringTag]() {
        return 'Response';
      }
    };
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true },
    });
    getSearch = parsedURL => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 =
        parsedURL.hash || (parsedURL.href[lastOffset] === '#' ? '#' : '');
      return parsedURL.href[lastOffset - hash2.length] === '?' ? '?' : '';
    };
    INTERNALS = Symbol('Request internals');
    isRequest = object => {
      return (
        typeof object === 'object' && typeof object[INTERNALS] === 'object'
      );
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || 'GET';
        method = method.toUpperCase();
        if (
          (init2.body != null || isRequest(input)) &&
          input.body !== null &&
          (method === 'GET' || method === 'HEAD')
        ) {
          throw new TypeError('Request with GET/HEAD method cannot have body');
        }
        const inputBody = init2.body
          ? init2.body
          : isRequest(input) && input.body !== null
          ? clone(input)
          : null;
        super(inputBody, {
          size: init2.size || input.size || 0,
        });
        const headers2 = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers2.has('Content-Type')) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers2.append('Content-Type', contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ('signal' in init2) {
          signal = init2.signal;
        }
        if (signal !== null && !isAbortSignal(signal)) {
          throw new TypeError(
            'Expected signal to be an instanceof AbortSignal',
          );
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || 'follow',
          headers: headers2,
          parsedURL,
          signal,
        };
        this.follow =
          init2.follow === void 0
            ? input.follow === void 0
              ? 20
              : input.follow
            : init2.follow;
        this.compress =
          init2.compress === void 0
            ? input.compress === void 0
              ? true
              : input.compress
            : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark =
          init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser =
          init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return 'Request';
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
    });
    getNodeRequestOptions = request => {
      const { parsedURL } = request[INTERNALS];
      const headers2 = new Headers(request[INTERNALS].headers);
      if (!headers2.has('Accept')) {
        headers2.set('Accept', '*/*');
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = '0';
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === 'number' && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers2.set('Content-Length', contentLengthValue);
      }
      if (!headers2.has('User-Agent')) {
        headers2.set('User-Agent', 'node-fetch');
      }
      if (request.compress && !headers2.has('Accept-Encoding')) {
        headers2.set('Accept-Encoding', 'gzip,deflate,br');
      }
      let { agent } = request;
      if (typeof agent === 'function') {
        agent = agent(parsedURL);
      }
      if (!headers2.has('Connection') && !agent) {
        headers2.set('Connection', 'close');
      }
      const search = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers2[Symbol.for('nodejs.util.inspect.custom')](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent,
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = 'aborted') {
        super(message, type);
      }
    };
    supportedSchemas = new Set(['data:', 'http:', 'https:']);
  },
});

// node_modules/@sveltejs/adapter-vercel/files/shims.js
var init_shims = __esm({
  'node_modules/@sveltejs/adapter-vercel/files/shims.js'() {
    init_install_fetch();
  },
});

// node_modules/doc-path/dist/path.js
var require_path = __commonJS({
  'node_modules/doc-path/dist/path.js'(exports, module2) {
    init_shims();
    ('use strict');
    function evaluatePath(t, e) {
      if (!t) return null;
      let { dotIndex: r, key: a, remaining: n } = state(e);
      return r >= 0 && !t[e]
        ? Array.isArray(t[a])
          ? t[a].map(t2 => evaluatePath(t2, n))
          : evaluatePath(t[a], n)
        : Array.isArray(t)
        ? t.map(t2 => evaluatePath(t2, e))
        : r >= 0 && e !== a && t[a]
        ? evaluatePath(t[a], n)
        : r === -1 && t[a] && !t[e]
        ? t[a]
        : t[e];
    }
    function setPath(t, e, r) {
      if (!t) throw new Error('No object was provided.');
      if (!e) throw new Error('No keyPath was provided.');
      return _sp(t, e, r);
    }
    function _sp(t, e, r) {
      let { dotIndex: a, key: n, remaining: i } = state(e);
      if (
        e.startsWith('__proto__') ||
        e.startsWith('constructor') ||
        e.startsWith('prototype')
      )
        return t;
      if (a >= 0) {
        if (!t[n] && Array.isArray(t)) return t.forEach(t2 => _sp(t2, e, r));
        t[n] || (t[n] = {}), _sp(t[n], i, r);
      } else {
        if (Array.isArray(t)) return t.forEach(t2 => _sp(t2, i, r));
        t[n] = r;
      }
      return t;
    }
    function state(t) {
      let e = findFirstNonEscapedDotIndex(t);
      return {
        dotIndex: e,
        key: t.slice(0, e >= 0 ? e : void 0).replace(/\\./g, '.'),
        remaining: t.slice(e + 1),
      };
    }
    function findFirstNonEscapedDotIndex(t) {
      for (let e = 0; e < t.length; e++) {
        const r = e > 0 ? t[e - 1] : '';
        if (t[e] === '.' && r !== '\\') return e;
      }
      return -1;
    }
    module2.exports = { evaluatePath, setPath };
  },
});

// node_modules/deeks/lib/utils.js
var require_utils = __commonJS({
  'node_modules/deeks/lib/utils.js'(exports, module2) {
    init_shims();
    ('use strict');
    module2.exports = {
      isNull,
      isObject,
      unique,
      flatten,
    };
    function isObject(value) {
      return typeof value === 'object';
    }
    function isNull(value) {
      return value === null;
    }
    function unique(array) {
      return [...new Set(array)];
    }
    function flatten(array) {
      return [].concat(...array);
    }
  },
});

// node_modules/deeks/lib/deeks.js
var require_deeks = __commonJS({
  'node_modules/deeks/lib/deeks.js'(exports, module2) {
    init_shims();
    ('use strict');
    var utils = require_utils();
    module2.exports = {
      deepKeys,
      deepKeysFromList,
    };
    function deepKeys(object, options2) {
      options2 = mergeOptions(options2);
      if (utils.isObject(object)) {
        return generateDeepKeysList('', object, options2);
      }
      return [];
    }
    function deepKeysFromList(list, options2) {
      options2 = mergeOptions(options2);
      return list.map(document2 => {
        if (utils.isObject(document2)) {
          return deepKeys(document2, options2);
        }
        return [];
      });
    }
    function generateDeepKeysList(heading, data, options2) {
      let keys2 = Object.keys(data).map(currentKey => {
        let keyName = buildKeyName(
          heading,
          escapeNestedDotsIfSpecified(currentKey, options2),
        );
        if (isDocumentToRecurOn(data[currentKey])) {
          return generateDeepKeysList(keyName, data[currentKey], options2);
        } else if (
          options2.expandArrayObjects &&
          isArrayToRecurOn(data[currentKey])
        ) {
          return processArrayKeys(data[currentKey], keyName, options2);
        } else if (
          options2.ignoreEmptyArrays &&
          isArrayToRecurOn(data[currentKey]) &&
          !data[currentKey].length
        ) {
          return [];
        }
        return keyName;
      });
      return utils.flatten(keys2);
    }
    function processArrayKeys(subArray, currentKeyPath, options2) {
      let subArrayKeys = deepKeysFromList(subArray, options2);
      if (!subArray.length) {
        return options2.ignoreEmptyArraysWhenExpanding ? [] : [currentKeyPath];
      } else if (subArray.length && utils.flatten(subArrayKeys).length === 0) {
        return [currentKeyPath];
      } else {
        subArrayKeys = subArrayKeys.map(schemaKeys => {
          if (isEmptyArray(schemaKeys)) {
            return [currentKeyPath];
          }
          return schemaKeys.map(subKey =>
            buildKeyName(
              currentKeyPath,
              escapeNestedDotsIfSpecified(subKey, options2),
            ),
          );
        });
        return utils.unique(utils.flatten(subArrayKeys));
      }
    }
    function escapeNestedDotsIfSpecified(key, options2) {
      if (options2.escapeNestedDots) {
        return key.replace(/\./g, '\\.');
      }
      return key;
    }
    function buildKeyName(upperKeyName, currentKeyName) {
      if (upperKeyName) {
        return upperKeyName + '.' + currentKeyName;
      }
      return currentKeyName;
    }
    function isDocumentToRecurOn(val) {
      return (
        utils.isObject(val) &&
        !utils.isNull(val) &&
        !Array.isArray(val) &&
        Object.keys(val).length
      );
    }
    function isArrayToRecurOn(val) {
      return Array.isArray(val);
    }
    function isEmptyArray(val) {
      return Array.isArray(val) && !val.length;
    }
    function mergeOptions(options2) {
      return {
        expandArrayObjects: false,
        ignoreEmptyArraysWhenExpanding: false,
        escapeNestedDots: false,
        ignoreEmptyArrays: false,
        ...(options2 || {}),
      };
    }
  },
});

// node_modules/json-2-csv/lib/constants.json
var require_constants = __commonJS({
  'node_modules/json-2-csv/lib/constants.json'(exports, module2) {
    module2.exports = {
      errors: {
        callbackRequired: 'A callback is required!',
        optionsRequired: 'Options were not passed and are required.',
        json2csv: {
          cannotCallOn: 'Cannot call json2csv on ',
          dataCheckFailure: 'Data provided was not an array of documents.',
          notSameSchema: 'Not all documents have the same schema.',
        },
        csv2json: {
          cannotCallOn: 'Cannot call csv2json on ',
          dataCheckFailure: 'CSV is not a string.',
        },
      },
      defaultOptions: {
        delimiter: {
          field: ',',
          wrap: '"',
          eol: '\n',
        },
        excelBOM: false,
        prependHeader: true,
        trimHeaderFields: false,
        trimFieldValues: false,
        sortHeader: false,
        parseCsvNumbers: false,
        keys: null,
        checkSchemaDifferences: false,
        expandArrayObjects: false,
        unwindArrays: false,
        useDateIso8601Format: false,
        useLocaleFormat: false,
        parseValue: null,
        wrapBooleans: false,
      },
      values: {
        excelBOM: '\uFEFF',
      },
    };
  },
});

// node_modules/json-2-csv/lib/utils.js
var require_utils2 = __commonJS({
  'node_modules/json-2-csv/lib/utils.js'(exports, module2) {
    init_shims();
    ('use strict');
    var path = require_path();
    var constants = require_constants();
    var dateStringRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
    var MAX_ARRAY_LENGTH = 1e5;
    module2.exports = {
      isStringRepresentation,
      isDateRepresentation,
      computeSchemaDifferences,
      deepCopy,
      convert,
      isEmptyField,
      removeEmptyFields,
      getNCharacters,
      unwind,
      isInvalid,
      isString,
      isNull,
      isError,
      isDate,
      isUndefined,
      isObject,
      unique,
      flatten,
    };
    function buildOptions(opts) {
      opts = { ...constants.defaultOptions, ...(opts || {}) };
      opts.fieldTitleMap = new Map();
      opts.delimiter.field =
        opts.delimiter.field || constants.defaultOptions.delimiter.field;
      opts.delimiter.wrap =
        opts.delimiter.wrap || constants.defaultOptions.delimiter.wrap;
      opts.delimiter.eol =
        opts.delimiter.eol || constants.defaultOptions.delimiter.eol;
      return opts;
    }
    function parseArguments(arg1, arg2) {
      if (isObject(arg1) && !isFunction(arg1)) {
        return {
          options: arg1,
          callback: arg2,
        };
      }
      return {
        options: arg2,
        callback: arg1,
      };
    }
    function validateParameters(config) {
      if (!config.callback) {
        throw new Error(constants.errors.callbackRequired);
      }
      if (!config.data) {
        config.callback(
          new Error(config.errorMessages.cannotCallOn + config.data + '.'),
        );
        return false;
      }
      if (!config.dataCheckFn(config.data)) {
        config.callback(new Error(config.errorMessages.dataCheckFailure));
        return false;
      }
      return true;
    }
    function convert(params) {
      let { options: options2, callback } = parseArguments(
        params.callback,
        params.options,
      );
      options2 = buildOptions(options2);
      let converter = new params.converter(options2),
        valid = validateParameters({
          data: params.data,
          callback,
          errorMessages: converter.validationMessages,
          dataCheckFn: converter.validationFn,
        });
      if (valid) converter.convert(params.data, callback);
    }
    function deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
    function isStringRepresentation(fieldValue, options2) {
      const firstChar = fieldValue[0],
        lastIndex = fieldValue.length - 1,
        lastChar = fieldValue[lastIndex];
      return (
        firstChar === options2.delimiter.wrap &&
        lastChar === options2.delimiter.wrap
      );
    }
    function isDateRepresentation(fieldValue) {
      return dateStringRegex.test(fieldValue);
    }
    function computeSchemaDifferences(schemaA, schemaB) {
      return arrayDifference(schemaA, schemaB).concat(
        arrayDifference(schemaB, schemaA),
      );
    }
    function isEmptyField(fieldValue) {
      return isUndefined(fieldValue) || isNull(fieldValue) || fieldValue === '';
    }
    function removeEmptyFields(fields2) {
      return fields2.filter(field => !isEmptyField(field));
    }
    function getNCharacters(str, start2, n) {
      return str.substring(start2, start2 + n);
    }
    function unwindItem(accumulator, item, fieldPath) {
      const valueToUnwind = path.evaluatePath(item, fieldPath);
      let cloned = deepCopy(item);
      if (Array.isArray(valueToUnwind) && valueToUnwind.length) {
        valueToUnwind.forEach(val => {
          cloned = deepCopy(item);
          accumulator.push(path.setPath(cloned, fieldPath, val));
        });
      } else if (Array.isArray(valueToUnwind) && valueToUnwind.length === 0) {
        path.setPath(cloned, fieldPath, '');
        accumulator.push(cloned);
      } else {
        accumulator.push(cloned);
      }
    }
    function unwind(array, field) {
      const result = [];
      array.forEach(item => {
        unwindItem(result, item, field);
      });
      return result;
    }
    function isString(value) {
      return typeof value === 'string';
    }
    function isObject(value) {
      return typeof value === 'object';
    }
    function isFunction(value) {
      return typeof value === 'function';
    }
    function isNull(value) {
      return value === null;
    }
    function isDate(value) {
      return value instanceof Date;
    }
    function isUndefined(value) {
      return typeof value === 'undefined';
    }
    function isError(value) {
      return Object.prototype.toString.call(value) === '[object Error]';
    }
    function arrayDifference(a, b) {
      return a.filter(x => !b.includes(x));
    }
    function unique(array) {
      return [...new Set(array)];
    }
    function flatten(array) {
      if (array.flat) {
        return array.flat();
      }
      if (array.length > MAX_ARRAY_LENGTH) {
        let safeArray = [];
        for (let a = 0; a < array.length; a += MAX_ARRAY_LENGTH) {
          safeArray = safeArray.concat(...array.slice(a, a + MAX_ARRAY_LENGTH));
        }
        return safeArray;
      }
      return [].concat(...array);
    }
    function isInvalid(parsedJson) {
      return parsedJson === Infinity || parsedJson === -Infinity;
    }
  },
});

// node_modules/json-2-csv/lib/json2csv.js
var require_json2csv = __commonJS({
  'node_modules/json-2-csv/lib/json2csv.js'(exports, module2) {
    init_shims();
    ('use strict');
    var path = require_path();
    var deeks = require_deeks();
    var constants = require_constants();
    var utils = require_utils2();
    var Json2Csv = function (options2) {
      const wrapDelimiterCheckRegex = new RegExp(options2.delimiter.wrap, 'g'),
        crlfSearchRegex = /\r?\n|\r/,
        valueParserFn =
          options2.parseValue && typeof options2.parseValue === 'function'
            ? options2.parseValue
            : recordFieldValueToString,
        expandingWithoutUnwinding =
          options2.expandArrayObjects && !options2.unwindArrays,
        deeksOptions = {
          expandArrayObjects: expandingWithoutUnwinding,
          ignoreEmptyArraysWhenExpanding: expandingWithoutUnwinding,
          escapeNestedDots: true,
        };
      function getFieldNameList(data) {
        return Promise.resolve(deeks.deepKeysFromList(data, deeksOptions));
      }
      function processSchemas(documentSchemas) {
        if (options2.checkSchemaDifferences) {
          return checkSchemaDifferences(documentSchemas);
        } else {
          let uniqueFieldNames = utils.unique(utils.flatten(documentSchemas));
          return Promise.resolve(uniqueFieldNames);
        }
      }
      function checkSchemaDifferences(documentSchemas) {
        let firstDocSchema = documentSchemas[0],
          restOfDocumentSchemas = documentSchemas.slice(1),
          schemaDifferences = computeNumberOfSchemaDifferences(
            firstDocSchema,
            restOfDocumentSchemas,
          );
        if (schemaDifferences) {
          return Promise.reject(
            new Error(constants.errors.json2csv.notSameSchema),
          );
        }
        return Promise.resolve(firstDocSchema);
      }
      function computeNumberOfSchemaDifferences(
        firstDocSchema,
        restOfDocumentSchemas,
      ) {
        return restOfDocumentSchemas.reduce(
          (schemaDifferences, documentSchema) => {
            let numberOfDifferences = utils.computeSchemaDifferences(
              firstDocSchema,
              documentSchema,
            ).length;
            return numberOfDifferences > 0
              ? schemaDifferences + 1
              : schemaDifferences;
          },
          0,
        );
      }
      function filterExcludedKeys(keyPaths) {
        if (options2.excludeKeys) {
          return keyPaths.filter(
            keyPath => !options2.excludeKeys.includes(keyPath),
          );
        }
        return keyPaths;
      }
      function sortHeaderFields(fieldNames) {
        if (options2.sortHeader) {
          return fieldNames.sort();
        }
        return fieldNames;
      }
      function trimHeaderFields(params) {
        if (options2.trimHeaderFields) {
          params.headerFields = params.headerFields.map(field =>
            field
              .split('.')
              .map(component => component.trim())
              .join('.'),
          );
        }
        return params;
      }
      function wrapHeaderFields(params) {
        if (options2.prependHeader) {
          params.headerFields = params.headerFields.map(function (headingKey) {
            return wrapFieldValueIfNecessary(headingKey);
          });
        }
        return params;
      }
      function generateCsvHeader(params) {
        let fieldTitleMapKeys = Object.keys(options2.fieldTitleMap);
        params.header = params.headerFields
          .map(function (field) {
            const headerKey = fieldTitleMapKeys.includes(field)
              ? options2.fieldTitleMap[field]
              : field;
            return wrapFieldValueIfNecessary(headerKey);
          })
          .join(options2.delimiter.field);
        return params;
      }
      function retrieveHeaderFields(data) {
        if (options2.keys) {
          options2.keys = options2.keys.map(key => {
            if (utils.isObject(key) && key.field) {
              options2.fieldTitleMap[key.field] = key.title || key.field;
              return key.field;
            }
            return key;
          });
        }
        if (options2.keys && !options2.unwindArrays) {
          return Promise.resolve(options2.keys)
            .then(filterExcludedKeys)
            .then(sortHeaderFields);
        }
        return getFieldNameList(data)
          .then(processSchemas)
          .then(filterExcludedKeys)
          .then(sortHeaderFields);
      }
      function unwindRecordsIfNecessary(params, finalPass = false) {
        if (options2.unwindArrays) {
          const originalRecordsLength = params.records.length;
          params.headerFields.forEach(headerField => {
            params.records = utils.unwind(params.records, headerField);
          });
          return retrieveHeaderFields(params.records).then(headerFields => {
            params.headerFields = headerFields;
            if (originalRecordsLength !== params.records.length) {
              return unwindRecordsIfNecessary(params);
            }
            if (!finalPass) {
              return unwindRecordsIfNecessary(params, true);
            }
            if (options2.keys) {
              params.headerFields = filterExcludedKeys(options2.keys);
            }
            return params;
          });
        }
        return params;
      }
      function processRecords(params) {
        params.records = params.records
          .map(record => {
            let recordFieldData = retrieveRecordFieldData(
                record,
                params.headerFields,
              ),
              processedRecordData = recordFieldData.map(fieldValue => {
                fieldValue = trimRecordFieldValue(fieldValue);
                fieldValue = valueParserFn(fieldValue);
                fieldValue = wrapFieldValueIfNecessary(fieldValue);
                return fieldValue;
              });
            return generateCsvRowFromRecord(processedRecordData);
          })
          .join(options2.delimiter.eol);
        return params;
      }
      function processRecordFieldDataForExpandedArrayObject(recordFieldValue) {
        let filteredRecordFieldValue =
          utils.removeEmptyFields(recordFieldValue);
        if (!recordFieldValue.length || !filteredRecordFieldValue.length) {
          return options2.emptyFieldValue || '';
        } else if (filteredRecordFieldValue.length === 1) {
          return filteredRecordFieldValue[0];
        }
        return recordFieldValue;
      }
      function retrieveRecordFieldData(record, fields2) {
        let recordValues = [];
        fields2.forEach(field => {
          let recordFieldValue = path.evaluatePath(record, field);
          if (
            !utils.isUndefined(options2.emptyFieldValue) &&
            utils.isEmptyField(recordFieldValue)
          ) {
            recordFieldValue = options2.emptyFieldValue;
          } else if (
            options2.expandArrayObjects &&
            Array.isArray(recordFieldValue)
          ) {
            recordFieldValue =
              processRecordFieldDataForExpandedArrayObject(recordFieldValue);
          }
          recordValues.push(recordFieldValue);
        });
        return recordValues;
      }
      function recordFieldValueToString(fieldValue) {
        const isDate = utils.isDate(fieldValue);
        if (
          utils.isNull(fieldValue) ||
          Array.isArray(fieldValue) ||
          (utils.isObject(fieldValue) && !isDate)
        ) {
          return JSON.stringify(fieldValue);
        } else if (utils.isUndefined(fieldValue)) {
          return 'undefined';
        } else if (isDate && options2.useDateIso8601Format) {
          return fieldValue.toISOString();
        } else {
          return !options2.useLocaleFormat
            ? fieldValue.toString()
            : fieldValue.toLocaleString();
        }
      }
      function trimRecordFieldValue(fieldValue) {
        if (options2.trimFieldValues) {
          if (Array.isArray(fieldValue)) {
            return fieldValue.map(trimRecordFieldValue);
          } else if (utils.isString(fieldValue)) {
            return fieldValue.trim();
          }
          return fieldValue;
        }
        return fieldValue;
      }
      function wrapFieldValueIfNecessary(fieldValue) {
        const wrapDelimiter = options2.delimiter.wrap;
        if (fieldValue.includes(options2.delimiter.wrap)) {
          fieldValue = fieldValue.replace(
            wrapDelimiterCheckRegex,
            wrapDelimiter + wrapDelimiter,
          );
        }
        if (
          fieldValue.includes(options2.delimiter.field) ||
          fieldValue.includes(options2.delimiter.wrap) ||
          fieldValue.match(crlfSearchRegex) ||
          (options2.wrapBooleans &&
            (fieldValue === 'true' || fieldValue === 'false'))
        ) {
          fieldValue = wrapDelimiter + fieldValue + wrapDelimiter;
        }
        return fieldValue;
      }
      function generateCsvRowFromRecord(recordFieldValues) {
        return recordFieldValues.join(options2.delimiter.field);
      }
      function generateCsvFromComponents(params) {
        let header = params.header,
          records = params.records,
          csv =
            (options2.excelBOM ? constants.values.excelBOM : '') +
            (options2.prependHeader ? header + options2.delimiter.eol : '') +
            records;
        return params.callback(null, csv);
      }
      function convert(data, callback) {
        if (utils.isObject(data) && !data.length) {
          data = [data];
        }
        retrieveHeaderFields(data)
          .then(headerFields => ({
            headerFields,
            callback,
            records: data,
          }))
          .then(unwindRecordsIfNecessary)
          .then(processRecords)
          .then(wrapHeaderFields)
          .then(trimHeaderFields)
          .then(generateCsvHeader)
          .then(generateCsvFromComponents)
          .catch(callback);
      }
      return {
        convert,
        validationFn: utils.isObject,
        validationMessages: constants.errors.json2csv,
      };
    };
    module2.exports = { Json2Csv };
  },
});

// node_modules/json-2-csv/lib/csv2json.js
var require_csv2json = __commonJS({
  'node_modules/json-2-csv/lib/csv2json.js'(exports, module2) {
    init_shims();
    ('use strict');
    var path = require_path();
    var constants = require_constants();
    var utils = require_utils2();
    var Csv2Json = function (options2) {
      const escapedWrapDelimiterRegex = new RegExp(
          options2.delimiter.wrap + options2.delimiter.wrap,
          'g',
        ),
        excelBOMRegex = new RegExp('^' + constants.values.excelBOM),
        valueParserFn =
          options2.parseValue && typeof options2.parseValue === 'function'
            ? options2.parseValue
            : JSON.parse;
      function processHeaderKey(headerKey) {
        headerKey = removeWrapDelimitersFromValue(headerKey);
        if (options2.trimHeaderFields) {
          return headerKey
            .split('.')
            .map(component => component.trim())
            .join('.');
        }
        return headerKey;
      }
      function retrieveHeading(lines) {
        let params = { lines },
          headerRow = params.lines[0];
        params.headerFields = headerRow.map((headerKey, index2) => ({
          value: processHeaderKey(headerKey),
          index: index2,
        }));
        if (options2.keys) {
          params.headerFields = params.headerFields.filter(headerKey =>
            options2.keys.includes(headerKey.value),
          );
        }
        return params;
      }
      function splitCsvLines(csv) {
        return Promise.resolve(splitLines(csv));
      }
      function stripExcelBOM(csv) {
        if (options2.excelBOM) {
          return Promise.resolve(csv.replace(excelBOMRegex, ''));
        }
        return Promise.resolve(csv);
      }
      function splitLines(csv) {
        let lines = [],
          splitLine = [],
          character,
          charBefore,
          charAfter,
          nextNChar,
          lastCharacterIndex = csv.length - 1,
          eolDelimiterLength = options2.delimiter.eol.length,
          stateVariables = {
            insideWrapDelimiter: false,
            parsingValue: true,
            justParsedDoubleQuote: false,
            startIndex: 0,
          },
          index2 = 0;
        while (index2 < csv.length) {
          character = csv[index2];
          charBefore = index2 ? csv[index2 - 1] : '';
          charAfter = index2 < lastCharacterIndex ? csv[index2 + 1] : '';
          nextNChar = utils.getNCharacters(csv, index2, eolDelimiterLength);
          if (
            ((nextNChar === options2.delimiter.eol &&
              !stateVariables.insideWrapDelimiter) ||
              index2 === lastCharacterIndex) &&
            charBefore === options2.delimiter.field
          ) {
            if (
              nextNChar === options2.delimiter.eol &&
              stateVariables.startIndex === index2
            ) {
              splitLine.push('');
            } else if (character === options2.delimiter.field) {
              splitLine.push('');
            } else {
              splitLine.push(csv.substr(stateVariables.startIndex));
            }
            splitLine.push('');
            lines.push(splitLine);
            splitLine = [];
            stateVariables.startIndex = index2 + eolDelimiterLength;
            stateVariables.parsingValue = true;
            stateVariables.insideWrapDelimiter =
              charAfter === options2.delimiter.wrap;
          } else if (
            index2 === lastCharacterIndex &&
            character === options2.delimiter.field
          ) {
            let parsedValue = csv.substring(stateVariables.startIndex, index2);
            splitLine.push(parsedValue);
            splitLine.push('');
            lines.push(splitLine);
          } else if (
            index2 === lastCharacterIndex ||
            (nextNChar === options2.delimiter.eol &&
              (!stateVariables.insideWrapDelimiter ||
                (stateVariables.insideWrapDelimiter &&
                  charBefore === options2.delimiter.wrap &&
                  !stateVariables.justParsedDoubleQuote)))
          ) {
            let toIndex =
              index2 !== lastCharacterIndex ||
              charBefore === options2.delimiter.wrap
                ? index2
                : void 0;
            splitLine.push(csv.substring(stateVariables.startIndex, toIndex));
            lines.push(splitLine);
            splitLine = [];
            stateVariables.startIndex = index2 + eolDelimiterLength;
            stateVariables.parsingValue = true;
            stateVariables.insideWrapDelimiter =
              charAfter === options2.delimiter.wrap;
          } else if (
            (charBefore !== options2.delimiter.wrap ||
              (stateVariables.justParsedDoubleQuote &&
                charBefore === options2.delimiter.wrap)) &&
            character === options2.delimiter.wrap &&
            utils.getNCharacters(csv, index2 + 1, eolDelimiterLength) ===
              options2.delimiter.eol
          ) {
            stateVariables.insideWrapDelimiter = false;
            stateVariables.parsingValue = false;
          } else if (
            character === options2.delimiter.wrap &&
            (index2 === 0 ||
              utils.getNCharacters(
                csv,
                index2 - eolDelimiterLength,
                eolDelimiterLength,
              ) === options2.delimiter.eol)
          ) {
            stateVariables.insideWrapDelimiter = true;
            stateVariables.parsingValue = true;
            stateVariables.startIndex = index2;
          } else if (
            character === options2.delimiter.wrap &&
            charAfter === options2.delimiter.field
          ) {
            splitLine.push(
              csv.substring(stateVariables.startIndex, index2 + 1),
            );
            stateVariables.startIndex = index2 + 2;
            stateVariables.insideWrapDelimiter = false;
            stateVariables.parsingValue = false;
          } else if (
            character === options2.delimiter.wrap &&
            charBefore === options2.delimiter.field &&
            !stateVariables.insideWrapDelimiter &&
            !stateVariables.parsingValue
          ) {
            stateVariables.startIndex = index2;
            stateVariables.insideWrapDelimiter = true;
            stateVariables.parsingValue = true;
          } else if (
            character === options2.delimiter.wrap &&
            charBefore === options2.delimiter.field &&
            !stateVariables.insideWrapDelimiter &&
            stateVariables.parsingValue
          ) {
            splitLine.push(
              csv.substring(stateVariables.startIndex, index2 - 1),
            );
            stateVariables.insideWrapDelimiter = true;
            stateVariables.parsingValue = true;
            stateVariables.startIndex = index2;
          } else if (
            character === options2.delimiter.wrap &&
            charAfter === options2.delimiter.wrap
          ) {
            index2 += 2;
            stateVariables.justParsedDoubleQuote = true;
            continue;
          } else if (
            character === options2.delimiter.field &&
            charBefore !== options2.delimiter.wrap &&
            charAfter !== options2.delimiter.wrap &&
            !stateVariables.insideWrapDelimiter &&
            stateVariables.parsingValue
          ) {
            splitLine.push(csv.substring(stateVariables.startIndex, index2));
            stateVariables.startIndex = index2 + 1;
          } else if (
            character === options2.delimiter.field &&
            charBefore === options2.delimiter.wrap &&
            charAfter !== options2.delimiter.wrap &&
            !stateVariables.parsingValue
          ) {
            stateVariables.insideWrapDelimiter = false;
            stateVariables.parsingValue = true;
            stateVariables.startIndex = index2 + 1;
          }
          index2++;
          stateVariables.justParsedDoubleQuote = false;
        }
        return lines;
      }
      function retrieveRecordLines(params) {
        params.recordLines = params.lines.splice(1);
        return params;
      }
      function retrieveRecordValueFromLine(line, key) {
        let value = line[key.index];
        return processRecordValue(value);
      }
      function processRecordValue(fieldValue) {
        let parsedJson = parseValue(fieldValue);
        if (!utils.isError(parsedJson) && !utils.isInvalid(parsedJson)) {
          fieldValue = parsedJson;
        } else if (fieldValue === 'undefined') {
          fieldValue = void 0;
        }
        return fieldValue;
      }
      function trimRecordValue(fieldValue) {
        if (options2.trimFieldValues && !utils.isNull(fieldValue)) {
          return fieldValue.trim();
        }
        return fieldValue;
      }
      function createDocument(keys2, line) {
        return keys2.reduce((document2, key) => {
          let value = retrieveRecordValueFromLine(line, key);
          try {
            return path.setPath(document2, key.value, value);
          } catch (error2) {
            return document2;
          }
        }, {});
      }
      function removeWrapDelimitersFromValue(fieldValue) {
        let firstChar = fieldValue[0],
          lastIndex = fieldValue.length - 1,
          lastChar = fieldValue[lastIndex];
        if (
          firstChar === options2.delimiter.wrap &&
          lastChar === options2.delimiter.wrap
        ) {
          return fieldValue.substr(1, lastIndex - 1);
        }
        return fieldValue;
      }
      function unescapeWrapDelimiterInField(fieldValue) {
        return fieldValue.replace(
          escapedWrapDelimiterRegex,
          options2.delimiter.wrap,
        );
      }
      function transformRecordLines(params) {
        params.json = params.recordLines.reduce(
          (generatedJsonObjects, line) => {
            line = line.map(fieldValue => {
              fieldValue = removeWrapDelimitersFromValue(fieldValue);
              fieldValue = unescapeWrapDelimiterInField(fieldValue);
              fieldValue = trimRecordValue(fieldValue);
              return fieldValue;
            });
            let generatedDocument = createDocument(params.headerFields, line);
            return generatedJsonObjects.concat(generatedDocument);
          },
          [],
        );
        return params;
      }
      function parseValue(value) {
        try {
          if (
            utils.isStringRepresentation(value, options2) &&
            !utils.isDateRepresentation(value)
          ) {
            return value;
          }
          let parsedJson = valueParserFn(value);
          if (Array.isArray(parsedJson)) {
            return parsedJson.map(trimRecordValue);
          }
          return parsedJson;
        } catch (err) {
          return err;
        }
      }
      function convert(data, callback) {
        stripExcelBOM(data)
          .then(splitCsvLines)
          .then(retrieveHeading)
          .then(retrieveRecordLines)
          .then(transformRecordLines)
          .then(params => callback(null, params.json))
          .catch(callback);
      }
      return {
        convert,
        validationFn: utils.isString,
        validationMessages: constants.errors.csv2json,
      };
    };
    module2.exports = { Csv2Json };
  },
});

// node_modules/json-2-csv/lib/converter.js
var require_converter = __commonJS({
  'node_modules/json-2-csv/lib/converter.js'(exports, module2) {
    init_shims();
    ('use strict');
    var { Json2Csv } = require_json2csv();
    var { Csv2Json } = require_csv2json();
    var utils = require_utils2();
    module2.exports = {
      json2csv: (data, callback, options2) =>
        convert(Json2Csv, data, callback, options2),
      csv2json: (data, callback, options2) =>
        convert(Csv2Json, data, callback, options2),
      json2csvAsync: (json, options2) => convertAsync(Json2Csv, json, options2),
      csv2jsonAsync: (csv, options2) => convertAsync(Csv2Json, csv, options2),
      json2csvPromisified: (json, options2) =>
        deprecatedAsync(
          Json2Csv,
          'json2csvPromisified()',
          'json2csvAsync()',
          json,
          options2,
        ),
      csv2jsonPromisified: (csv, options2) =>
        deprecatedAsync(
          Csv2Json,
          'csv2jsonPromisified()',
          'csv2jsonAsync()',
          csv,
          options2,
        ),
    };
    function convert(converter, data, callback, options2) {
      return utils.convert({
        data,
        callback,
        options: options2,
        converter,
      });
    }
    function convertAsync(converter, data, options2) {
      return new Promise((resolve2, reject) =>
        convert(
          converter,
          data,
          (err, data2) => {
            if (err) {
              return reject(err);
            }
            return resolve2(data2);
          },
          options2,
        ),
      );
    }
    function deprecatedAsync(
      converter,
      deprecatedName,
      replacementName,
      data,
      options2,
    ) {
      console.warn(
        'WARNING: ' +
          deprecatedName +
          ' is deprecated and will be removed soon. Please use ' +
          replacementName +
          ' instead.',
      );
      return convertAsync(converter, data, options2);
    }
  },
});

// node_modules/marked/src/defaults.js
var require_defaults = __commonJS({
  'node_modules/marked/src/defaults.js'(exports, module2) {
    init_shims();
    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false,
      };
    }
    function changeDefaults(newDefaults) {
      module2.exports.defaults = newDefaults;
    }
    module2.exports = {
      defaults: getDefaults(),
      getDefaults,
      changeDefaults,
    };
  },
});

// node_modules/marked/src/helpers.js
var require_helpers = __commonJS({
  'node_modules/marked/src/helpers.js'(exports, module2) {
    init_shims();
    var escapeTest = /[&<>"']/;
    var escapeReplace = /[&<>"']/g;
    var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    var escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    var getEscapeReplacement = ch => escapeReplacements[ch];
    function escape2(html2, encode) {
      if (encode) {
        if (escapeTest.test(html2)) {
          return html2.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html2)) {
          return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }
      return html2;
    }
    var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
    function unescape2(html2) {
      return html2.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }
    var caret = /(^|[^\[])\^/g;
    function edit(regex, opt) {
      regex = regex.source || regex;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        },
      };
      return obj;
    }
    var nonWordAndColonTest = /[^\w:]/g;
    var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl(sanitize, base2, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape2(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (
          prot.indexOf('javascript:') === 0 ||
          prot.indexOf('vbscript:') === 0 ||
          prot.indexOf('data:') === 0
        ) {
          return null;
        }
      }
      if (base2 && !originIndependentUrl.test(href)) {
        href = resolveUrl(base2, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }
    var baseUrls = {};
    var justDomain = /^[^:]+:\/*[^/]*$/;
    var protocol = /^([^:]+:)[\s\S]*$/;
    var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
    function resolveUrl(base2, href) {
      if (!baseUrls[' ' + base2]) {
        if (justDomain.test(base2)) {
          baseUrls[' ' + base2] = base2 + '/';
        } else {
          baseUrls[' ' + base2] = rtrim(base2, '/', true);
        }
      }
      base2 = baseUrls[' ' + base2];
      const relativeBase = base2.indexOf(':') === -1;
      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base2.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base2.replace(domain, '$1') + href;
      } else {
        return base2 + href;
      }
    }
    var noopTest = { exec: function noopTest2() {} };
    function merge(obj) {
      let i = 1,
        target,
        key;
      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }
      return obj;
    }
    function splitCells(tableRow, count) {
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped2 = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped2 = !escaped2;
          if (escaped2) {
            return '|';
          } else {
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;
      if (!cells[0].trim()) {
        cells.shift();
      }
      if (!cells[cells.length - 1].trim()) {
        cells.pop();
      }
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }
      for (; i < cells.length; i++) {
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }
      let suffLen = 0;
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }
      return str.substr(0, l - suffLen);
    }
    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }
    function checkSanitizeDeprecation(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn(
          'marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options',
        );
      }
    }
    function repeatString(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }
    module2.exports = {
      escape: escape2,
      unescape: unescape2,
      edit,
      cleanUrl,
      resolveUrl,
      noopTest,
      merge,
      splitCells,
      rtrim,
      findClosingBracket,
      checkSanitizeDeprecation,
      repeatString,
    };
  },
});

// node_modules/marked/src/Tokenizer.js
var require_Tokenizer = __commonJS({
  'node_modules/marked/src/Tokenizer.js'(exports, module2) {
    init_shims();
    var { defaults } = require_defaults();
    var {
      rtrim,
      splitCells,
      escape: escape2,
      findClosingBracket,
    } = require_helpers();
    function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape2(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');
      if (cap[0].charAt(0) !== '!') {
        lexer.state.inLink = true;
        const token2 = {
          type: 'link',
          raw,
          href,
          title,
          text,
          tokens: lexer.inlineTokens(text, []),
        };
        lexer.state.inLink = false;
        return token2;
      } else {
        return {
          type: 'image',
          raw,
          href,
          title,
          text: escape2(text),
        };
      }
    }
    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
      if (matchIndentToCode === null) {
        return text;
      }
      const indentToCode = matchIndentToCode[1];
      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }
          const [indentInNode] = matchIndentInNode;
          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }
          return node;
        })
        .join('\n');
    }
    module2.exports = class Tokenizer {
      constructor(options2) {
        this.options = options2 || defaults;
      }
      space(src2) {
        const cap = this.rules.block.newline.exec(src2);
        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: 'space',
              raw: cap[0],
            };
          }
          return { raw: '\n' };
        }
      }
      code(src2) {
        const cap = this.rules.block.code.exec(src2);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic ? rtrim(text, '\n') : text,
          };
        }
      }
      fences(src2) {
        const cap = this.rules.block.fences.exec(src2);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');
          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text,
          };
        }
      }
      heading(src2) {
        const cap = this.rules.block.heading.exec(src2);
        if (cap) {
          let text = cap[2].trim();
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              text = trimmed.trim();
            }
          }
          const token2 = {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text,
            tokens: [],
          };
          this.lexer.inline(token2.text, token2.tokens);
          return token2;
        }
      }
      hr(src2) {
        const cap = this.rules.block.hr.exec(src2);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0],
          };
        }
      }
      blockquote(src2) {
        const cap = this.rules.block.blockquote.exec(src2);
        if (cap) {
          const text = cap[0].replace(/^ *> ?/gm, '');
          return {
            type: 'blockquote',
            raw: cap[0],
            tokens: this.lexer.blockTokens(text, []),
            text,
          };
        }
      }
      list(src2) {
        let cap = this.rules.block.list.exec(src2);
        if (cap) {
          let raw,
            istask,
            ischecked,
            indent,
            i,
            blankLine,
            endsWithBlankLine,
            line,
            lines,
            itemContents;
          let bull = cap[1].trim();
          const isordered = bull.length > 1;
          const list = {
            type: 'list',
            raw: '',
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: [],
          };
          bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
          if (this.options.pedantic) {
            bull = isordered ? bull : '[*+-]';
          }
          const itemRegex = new RegExp(
            `^( {0,3}${bull})((?: [^\\n]*| *)(?:\\n[^\\n]*)*(?:\\n|$))`,
          );
          while (src2) {
            if (this.rules.block.hr.test(src2)) {
              break;
            }
            if (!(cap = itemRegex.exec(src2))) {
              break;
            }
            lines = cap[2].split('\n');
            if (this.options.pedantic) {
              indent = 2;
              itemContents = lines[0].trimLeft();
            } else {
              indent = cap[2].search(/[^ ]/);
              indent = cap[1].length + (indent > 4 ? 1 : indent);
              itemContents = lines[0].slice(indent - cap[1].length);
            }
            blankLine = false;
            raw = cap[0];
            if (!lines[0] && /^ *$/.test(lines[1])) {
              raw = cap[1] + lines.slice(0, 2).join('\n') + '\n';
              list.loose = true;
              lines = [];
            }
            const nextBulletRegex = new RegExp(
              `^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])`,
            );
            for (i = 1; i < lines.length; i++) {
              line = lines[i];
              if (this.options.pedantic) {
                line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
              }
              if (nextBulletRegex.test(line)) {
                raw = cap[1] + lines.slice(0, i).join('\n') + '\n';
                break;
              }
              if (!blankLine) {
                if (!line.trim()) {
                  blankLine = true;
                }
                if (line.search(/[^ ]/) >= indent) {
                  itemContents += '\n' + line.slice(indent);
                } else {
                  itemContents += '\n' + line;
                }
                continue;
              }
              if (line.search(/[^ ]/) >= indent || !line.trim()) {
                itemContents += '\n' + line.slice(indent);
                continue;
              } else {
                raw = cap[1] + lines.slice(0, i).join('\n') + '\n';
                break;
              }
            }
            if (!list.loose) {
              if (endsWithBlankLine) {
                list.loose = true;
              } else if (/\n *\n *$/.test(raw)) {
                endsWithBlankLine = true;
              }
            }
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.exec(itemContents);
              if (istask) {
                ischecked = istask[0] !== '[ ] ';
                itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
              }
            }
            list.items.push({
              type: 'list_item',
              raw,
              task: !!istask,
              checked: ischecked,
              loose: false,
              text: itemContents,
            });
            list.raw += raw;
            src2 = src2.slice(raw.length);
          }
          list.items[list.items.length - 1].raw = raw.trimRight();
          list.items[list.items.length - 1].text = itemContents.trimRight();
          list.raw = list.raw.trimRight();
          const l = list.items.length;
          for (i = 0; i < l; i++) {
            this.lexer.state.top = false;
            list.items[i].tokens = this.lexer.blockTokens(
              list.items[i].text,
              [],
            );
            if (list.items[i].tokens.some(t => t.type === 'space')) {
              list.loose = true;
              list.items[i].loose = true;
            }
          }
          return list;
        }
      }
      html(src2) {
        const cap = this.rules.block.html.exec(src2);
        if (cap) {
          const token2 = {
            type: 'html',
            raw: cap[0],
            pre:
              !this.options.sanitizer &&
              (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: cap[0],
          };
          if (this.options.sanitize) {
            token2.type = 'paragraph';
            token2.text = this.options.sanitizer
              ? this.options.sanitizer(cap[0])
              : escape2(cap[0]);
            token2.tokens = [];
            this.lexer.inline(token2.text, token2.tokens);
          }
          return token2;
        }
      }
      def(src2) {
        const cap = this.rules.block.def.exec(src2);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3],
          };
        }
      }
      table(src2) {
        const cap = this.rules.block.table.exec(src2);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => {
              return { text: c };
            }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
          };
          if (item.header.length === item.align.length) {
            item.raw = cap[0];
            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }
            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(
                c => {
                  return { text: c };
                },
              );
            }
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = [];
              this.lexer.inlineTokens(
                item.header[j].text,
                item.header[j].tokens,
              );
            }
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = [];
                this.lexer.inlineTokens(row[k].text, row[k].tokens);
              }
            }
            return item;
          }
        }
      }
      lheading(src2) {
        const cap = this.rules.block.lheading.exec(src2);
        if (cap) {
          const token2 = {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1],
            tokens: [],
          };
          this.lexer.inline(token2.text, token2.tokens);
          return token2;
        }
      }
      paragraph(src2) {
        const cap = this.rules.block.paragraph.exec(src2);
        if (cap) {
          const token2 = {
            type: 'paragraph',
            raw: cap[0],
            text:
              cap[1].charAt(cap[1].length - 1) === '\n'
                ? cap[1].slice(0, -1)
                : cap[1],
            tokens: [],
          };
          this.lexer.inline(token2.text, token2.tokens);
          return token2;
        }
      }
      text(src2) {
        const cap = this.rules.block.text.exec(src2);
        if (cap) {
          const token2 = {
            type: 'text',
            raw: cap[0],
            text: cap[0],
            tokens: [],
          };
          this.lexer.inline(token2.text, token2.tokens);
          return token2;
        }
      }
      escape(src2) {
        const cap = this.rules.inline.escape.exec(src2);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape2(cap[1]),
          };
        }
      }
      tag(src2) {
        const cap = this.rules.inline.tag.exec(src2);
        if (cap) {
          if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
            this.lexer.state.inLink = true;
          } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
            this.lexer.state.inLink = false;
          }
          if (
            !this.lexer.state.inRawBlock &&
            /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])
          ) {
            this.lexer.state.inRawBlock = true;
          } else if (
            this.lexer.state.inRawBlock &&
            /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])
          ) {
            this.lexer.state.inRawBlock = false;
          }
          return {
            type: this.options.sanitize ? 'text' : 'html',
            raw: cap[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            text: this.options.sanitize
              ? this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape2(cap[0])
              : cap[0],
          };
        }
      }
      link(src2) {
        const cap = this.rules.inline.link.exec(src2);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            if (!/>$/.test(trimmedUrl)) {
              return;
            }
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start2 = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start2 + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }
          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(
            cap,
            {
              href: href
                ? href.replace(this.rules.inline._escapes, '$1')
                : href,
              title: title
                ? title.replace(this.rules.inline._escapes, '$1')
                : title,
            },
            cap[0],
            this.lexer,
          );
        }
      }
      reflink(src2, links) {
        let cap;
        if (
          (cap = this.rules.inline.reflink.exec(src2)) ||
          (cap = this.rules.inline.nolink.exec(src2))
        ) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text,
            };
          }
          return outputLink(cap, link, cap[0], this.lexer);
        }
      }
      emStrong(src2, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src2);
        if (!match) return;
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;
        const nextChar = match[1] || match[2] || '';
        if (
          !nextChar ||
          (nextChar &&
            (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))
        ) {
          const lLength = match[0].length - 1;
          let rDelim,
            rLength,
            delimTotal = lLength,
            midDelimTotal = 0;
          const endReg =
            match[0][0] === '*'
              ? this.rules.inline.emStrong.rDelimAst
              : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;
          maskedSrc = maskedSrc.slice(-1 * src2.length + lLength);
          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim =
              match[1] ||
              match[2] ||
              match[3] ||
              match[4] ||
              match[5] ||
              match[6];
            if (!rDelim) continue;
            rLength = rDelim.length;
            if (match[3] || match[4]) {
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) {
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue;
              }
            }
            delimTotal -= rLength;
            if (delimTotal > 0) continue;
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
            if (Math.min(lLength, rLength) % 2) {
              const text2 = src2.slice(1, lLength + match.index + rLength);
              return {
                type: 'em',
                raw: src2.slice(0, lLength + match.index + rLength + 1),
                text: text2,
                tokens: this.lexer.inlineTokens(text2, []),
              };
            }
            const text = src2.slice(2, lLength + match.index + rLength - 1);
            return {
              type: 'strong',
              raw: src2.slice(0, lLength + match.index + rLength + 1),
              text,
              tokens: this.lexer.inlineTokens(text, []),
            };
          }
        }
      }
      codespan(src2) {
        const cap = this.rules.inline.code.exec(src2);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape2(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text,
          };
        }
      }
      br(src2) {
        const cap = this.rules.inline.br.exec(src2);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0],
          };
        }
      }
      del(src2) {
        const cap = this.rules.inline.del.exec(src2);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2],
            tokens: this.lexer.inlineTokens(cap[2], []),
          };
        }
      }
      autolink(src2, mangle) {
        const cap = this.rules.inline.autolink.exec(src2);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape2(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape2(cap[1]);
            href = text;
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text,
              },
            ],
          };
        }
      }
      url(src2, mangle) {
        let cap;
        if ((cap = this.rules.inline.url.exec(src2))) {
          let text, href;
          if (cap[2] === '@') {
            text = escape2(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape2(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text,
              },
            ],
          };
        }
      }
      inlineText(src2, smartypants) {
        const cap = this.rules.inline.text.exec(src2);
        if (cap) {
          let text;
          if (this.lexer.state.inRawBlock) {
            text = this.options.sanitize
              ? this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape2(cap[0])
              : cap[0];
          } else {
            text = escape2(
              this.options.smartypants ? smartypants(cap[0]) : cap[0],
            );
          }
          return {
            type: 'text',
            raw: cap[0],
            text,
          };
        }
      }
    };
  },
});

// node_modules/marked/src/rules.js
var require_rules = __commonJS({
  'node_modules/marked/src/rules.js'(exports, module2) {
    init_shims();
    var { noopTest, edit, merge } = require_helpers();
    var block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences:
        /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
      html: '^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))',
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      _paragraph:
        /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
      text: /^[^\n]+/,
    };
    block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block._title =
      /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def)
      .replace('label', block._label)
      .replace('title', block._title)
      .getRegex();
    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block.bullet)
      .getRegex();
    block.list = edit(block.list)
      .replace(/bull/g, block.bullet)
      .replace(
        'hr',
        '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))',
      )
      .replace('def', '\\n+(?=' + block.def.source + ')')
      .getRegex();
    block._tag =
      'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul';
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, 'i')
      .replace('comment', block._comment)
      .replace('tag', block._tag)
      .replace(
        'attribute',
        / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/,
      )
      .getRegex();
    block.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '')
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
      .replace(
        'html',
        '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
      )
      .replace('tag', block._tag)
      .getRegex();
    block.blockquote = edit(block.blockquote)
      .replace('paragraph', block.paragraph)
      .getRegex();
    block.normal = merge({}, block);
    block.gfm = merge({}, block.normal, {
      table:
        '^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
    });
    block.gfm.table = edit(block.gfm.table)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
      .replace(
        'html',
        '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
      )
      .replace('tag', block._tag)
      .getRegex();
    block.pedantic = merge({}, block.normal, {
      html: edit(
        `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`,
      )
        .replace('comment', block._comment)
        .replace(
          /tag/g,
          '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b',
        )
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest,
      paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex(),
    });
    var inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        rDelimAst:
          /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd:
          /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/,
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/,
    };
    inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline.punctuation = edit(inline.punctuation)
      .replace(/punctuation/g, inline._punctuation)
      .getRegex();
    inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline.escapedEmSt = /\\\*|\\_/g;
    inline._comment = edit(block._comment)
      .replace('(?:-->|$)', '-->')
      .getRegex();
    inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
      .replace(/punct/g, inline._punctuation)
      .getRegex();
    inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();
    inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();
    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email =
      /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink)
      .replace('scheme', inline._scheme)
      .replace('email', inline._email)
      .getRegex();
    inline._attribute =
      /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
    inline.tag = edit(inline.tag)
      .replace('comment', inline._comment)
      .replace('attribute', inline._attribute)
      .getRegex();
    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title =
      /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
    inline.link = edit(inline.link)
      .replace('label', inline._label)
      .replace('href', inline._href)
      .replace('title', inline._title)
      .getRegex();
    inline.reflink = edit(inline.reflink)
      .replace('label', inline._label)
      .getRegex();
    inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
      .replace('reflink', inline.reflink)
      .replace('nolink', inline.nolink)
      .getRegex();
    inline.normal = merge({}, inline);
    inline.pedantic = merge({}, inline.normal, {
      strong: {
        start: /^__|\*\*/,
        middle:
          /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g,
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g,
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex(),
    });
    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace('])', '~|])').getRegex(),
      _extended_email:
        /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal:
        /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
    });
    inline.gfm.url = edit(inline.gfm.url, 'i')
      .replace('email', inline.gfm._extended_email)
      .getRegex();
    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace('{2,}', '*').getRegex(),
      text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex(),
    });
    module2.exports = {
      block,
      inline,
    };
  },
});

// node_modules/marked/src/Lexer.js
var require_Lexer = __commonJS({
  'node_modules/marked/src/Lexer.js'(exports, module2) {
    init_shims();
    var Tokenizer = require_Tokenizer();
    var { defaults } = require_defaults();
    var { block, inline } = require_rules();
    var { repeatString } = require_helpers();
    function smartypants(text) {
      return text
        .replace(/---/g, '\u2014')
        .replace(/--/g, '\u2013')
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        .replace(/'/g, '\u2019')
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201C')
        .replace(/"/g, '\u201D')
        .replace(/\.{3}/g, '\u2026');
    }
    function mangle(text) {
      let out = '',
        i,
        ch;
      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }
      return out;
    }
    module2.exports = class Lexer {
      constructor(options2) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options2 || defaults;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
          inLink: false,
          inRawBlock: false,
          top: true,
        };
        const rules = {
          block: block.normal,
          inline: inline.normal,
        };
        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }
      static get rules() {
        return {
          block,
          inline,
        };
      }
      static lex(src2, options2) {
        const lexer = new Lexer(options2);
        return lexer.lex(src2);
      }
      static lexInline(src2, options2) {
        const lexer = new Lexer(options2);
        return lexer.inlineTokens(src2);
      }
      lex(src2) {
        src2 = src2.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
        this.blockTokens(src2, this.tokens);
        let next;
        while ((next = this.inlineQueue.shift())) {
          this.inlineTokens(next.src, next.tokens);
        }
        return this.tokens;
      }
      blockTokens(src2, tokens = []) {
        if (this.options.pedantic) {
          src2 = src2.replace(/^ +$/gm, '');
        }
        let token2, lastToken, cutSrc, lastParagraphClipped;
        while (src2) {
          if (
            this.options.extensions &&
            this.options.extensions.block &&
            this.options.extensions.block.some(extTokenizer => {
              if ((token2 = extTokenizer.call({ lexer: this }, src2, tokens))) {
                src2 = src2.substring(token2.raw.length);
                tokens.push(token2);
                return true;
              }
              return false;
            })
          ) {
            continue;
          }
          if ((token2 = this.tokenizer.space(src2))) {
            src2 = src2.substring(token2.raw.length);
            if (token2.type) {
              tokens.push(token2);
            }
            continue;
          }
          if ((token2 = this.tokenizer.code(src2))) {
            src2 = src2.substring(token2.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (
              lastToken &&
              (lastToken.type === 'paragraph' || lastToken.type === 'text')
            ) {
              lastToken.raw += '\n' + token2.raw;
              lastToken.text += '\n' + token2.text;
              this.inlineQueue[this.inlineQueue.length - 1].src =
                lastToken.text;
            } else {
              tokens.push(token2);
            }
            continue;
          }
          if ((token2 = this.tokenizer.fences(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.heading(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.hr(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.blockquote(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.list(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.html(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.def(src2))) {
            src2 = src2.substring(token2.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (
              lastToken &&
              (lastToken.type === 'paragraph' || lastToken.type === 'text')
            ) {
              lastToken.raw += '\n' + token2.raw;
              lastToken.text += '\n' + token2.raw;
              this.inlineQueue[this.inlineQueue.length - 1].src =
                lastToken.text;
            } else if (!this.tokens.links[token2.tag]) {
              this.tokens.links[token2.tag] = {
                href: token2.href,
                title: token2.title,
              };
            }
            continue;
          }
          if ((token2 = this.tokenizer.table(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.lheading(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          cutSrc = src2;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src2.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function (
              getStartIndex,
            ) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) {
                startIndex = Math.min(startIndex, tempStart);
              }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src2.substring(0, startIndex + 1);
            }
          }
          if (this.state.top && (token2 = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token2.raw;
              lastToken.text += '\n' + token2.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src =
                lastToken.text;
            } else {
              tokens.push(token2);
            }
            lastParagraphClipped = cutSrc.length !== src2.length;
            src2 = src2.substring(token2.raw.length);
            continue;
          }
          if ((token2 = this.tokenizer.text(src2))) {
            src2 = src2.substring(token2.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token2.raw;
              lastToken.text += '\n' + token2.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src =
                lastToken.text;
            } else {
              tokens.push(token2);
            }
            continue;
          }
          if (src2) {
            const errMsg = 'Infinite loop on byte: ' + src2.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }
        this.state.top = true;
        return tokens;
      }
      inline(src2, tokens) {
        this.inlineQueue.push({ src: src2, tokens });
      }
      inlineTokens(src2, tokens = []) {
        let token2, lastToken, cutSrc;
        let maskedSrc = src2;
        let match;
        let keepPrevChar, prevChar;
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while (
              (match =
                this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) !=
              null
            ) {
              if (
                links.includes(
                  match[0].slice(match[0].lastIndexOf('[') + 1, -1),
                )
              ) {
                maskedSrc =
                  maskedSrc.slice(0, match.index) +
                  '[' +
                  repeatString('a', match[0].length - 2) +
                  ']' +
                  maskedSrc.slice(
                    this.tokenizer.rules.inline.reflinkSearch.lastIndex,
                  );
              }
            }
          }
        }
        while (
          (match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) !=
          null
        ) {
          maskedSrc =
            maskedSrc.slice(0, match.index) +
            '[' +
            repeatString('a', match[0].length - 2) +
            ']' +
            maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }
        while (
          (match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) !=
          null
        ) {
          maskedSrc =
            maskedSrc.slice(0, match.index) +
            '++' +
            maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }
        while (src2) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;
          if (
            this.options.extensions &&
            this.options.extensions.inline &&
            this.options.extensions.inline.some(extTokenizer => {
              if ((token2 = extTokenizer.call({ lexer: this }, src2, tokens))) {
                src2 = src2.substring(token2.raw.length);
                tokens.push(token2);
                return true;
              }
              return false;
            })
          ) {
            continue;
          }
          if ((token2 = this.tokenizer.escape(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.tag(src2))) {
            src2 = src2.substring(token2.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (
              lastToken &&
              token2.type === 'text' &&
              lastToken.type === 'text'
            ) {
              lastToken.raw += token2.raw;
              lastToken.text += token2.text;
            } else {
              tokens.push(token2);
            }
            continue;
          }
          if ((token2 = this.tokenizer.link(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.reflink(src2, this.tokens.links))) {
            src2 = src2.substring(token2.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (
              lastToken &&
              token2.type === 'text' &&
              lastToken.type === 'text'
            ) {
              lastToken.raw += token2.raw;
              lastToken.text += token2.text;
            } else {
              tokens.push(token2);
            }
            continue;
          }
          if ((token2 = this.tokenizer.emStrong(src2, maskedSrc, prevChar))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.codespan(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.br(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.del(src2))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if ((token2 = this.tokenizer.autolink(src2, mangle))) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          if (
            !this.state.inLink &&
            (token2 = this.tokenizer.url(src2, mangle))
          ) {
            src2 = src2.substring(token2.raw.length);
            tokens.push(token2);
            continue;
          }
          cutSrc = src2;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src2.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function (
              getStartIndex,
            ) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) {
                startIndex = Math.min(startIndex, tempStart);
              }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src2.substring(0, startIndex + 1);
            }
          }
          if ((token2 = this.tokenizer.inlineText(cutSrc, smartypants))) {
            src2 = src2.substring(token2.raw.length);
            if (token2.raw.slice(-1) !== '_') {
              prevChar = token2.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token2.raw;
              lastToken.text += token2.text;
            } else {
              tokens.push(token2);
            }
            continue;
          }
          if (src2) {
            const errMsg = 'Infinite loop on byte: ' + src2.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }
        return tokens;
      }
    };
  },
});

// node_modules/marked/src/Renderer.js
var require_Renderer = __commonJS({
  'node_modules/marked/src/Renderer.js'(exports, module2) {
    init_shims();
    var { defaults } = require_defaults();
    var { cleanUrl, escape: escape2 } = require_helpers();
    module2.exports = class Renderer {
      constructor(options2) {
        this.options = options2 || defaults;
      }
      code(code2, infostring, escaped2) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code2, lang);
          if (out != null && out !== code2) {
            escaped2 = true;
            code2 = out;
          }
        }
        code2 = code2.replace(/\n$/, '') + '\n';
        if (!lang) {
          return (
            '<pre><code>' +
            (escaped2 ? code2 : escape2(code2, true)) +
            '</code></pre>\n'
          );
        }
        return (
          '<pre><code class="' +
          this.options.langPrefix +
          escape2(lang, true) +
          '">' +
          (escaped2 ? code2 : escape2(code2, true)) +
          '</code></pre>\n'
        );
      }
      blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      }
      html(html2) {
        return html2;
      }
      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return (
            '<h' +
            level +
            ' id="' +
            this.options.headerPrefix +
            slugger.slug(raw) +
            '">' +
            text +
            '</h' +
            level +
            '>\n'
          );
        }
        return '<h' + level + '>' + text + '</h' + level + '>\n';
      }
      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }
      list(body, ordered, start2) {
        const type = ordered ? 'ol' : 'ul',
          startatt = ordered && start2 !== 1 ? ' start="' + start2 + '"' : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }
      listitem(text) {
        return '<li>' + text + '</li>\n';
      }
      checkbox(checked) {
        return (
          '<input ' +
          (checked ? 'checked="" ' : '') +
          'disabled="" type="checkbox"' +
          (this.options.xhtml ? ' /' : '') +
          '> '
        );
      }
      paragraph(text) {
        return '<p>' + text + '</p>\n';
      }
      table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';
        return (
          '<table>\n<thead>\n' + header + '</thead>\n' + body + '</table>\n'
        );
      }
      tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      }
      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? '<' + type + ' align="' + flags.align + '">'
          : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      }
      strong(text) {
        return '<strong>' + text + '</strong>';
      }
      em(text) {
        return '<em>' + text + '</em>';
      }
      codespan(text) {
        return '<code>' + text + '</code>';
      }
      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }
      del(text) {
        return '<del>' + text + '</del>';
      }
      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape2(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }
      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }
      text(text) {
        return text;
      }
    };
  },
});

// node_modules/marked/src/TextRenderer.js
var require_TextRenderer = __commonJS({
  'node_modules/marked/src/TextRenderer.js'(exports, module2) {
    init_shims();
    module2.exports = class TextRenderer {
      strong(text) {
        return text;
      }
      em(text) {
        return text;
      }
      codespan(text) {
        return text;
      }
      del(text) {
        return text;
      }
      html(text) {
        return text;
      }
      text(text) {
        return text;
      }
      link(href, title, text) {
        return '' + text;
      }
      image(href, title, text) {
        return '' + text;
      }
      br() {
        return '';
      }
    };
  },
});

// node_modules/marked/src/Slugger.js
var require_Slugger = __commonJS({
  'node_modules/marked/src/Slugger.js'(exports, module2) {
    init_shims();
    module2.exports = class Slugger {
      constructor() {
        this.seen = {};
      }
      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          .replace(/<[!\/a-z].*?>/gi, '')
          .replace(
            /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
            '',
          )
          .replace(/\s/g, '-');
      }
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }
      slug(value, options2 = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options2.dryrun);
      }
    };
  },
});

// node_modules/marked/src/Parser.js
var require_Parser = __commonJS({
  'node_modules/marked/src/Parser.js'(exports, module2) {
    init_shims();
    var Renderer = require_Renderer();
    var TextRenderer = require_TextRenderer();
    var Slugger = require_Slugger();
    var { defaults } = require_defaults();
    var { unescape: unescape2 } = require_helpers();
    module2.exports = class Parser {
      constructor(options2) {
        this.options = options2 || defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }
      static parse(tokens, options2) {
        const parser = new Parser(options2);
        return parser.parse(tokens);
      }
      static parseInline(tokens, options2) {
        const parser = new Parser(options2);
        return parser.parseInline(tokens);
      }
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token2,
          ordered,
          start2,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;
        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token2 = tokens[i];
          if (
            this.options.extensions &&
            this.options.extensions.renderers &&
            this.options.extensions.renderers[token2.type]
          ) {
            ret = this.options.extensions.renderers[token2.type].call(
              { parser: this },
              token2,
            );
            if (
              ret !== false ||
              ![
                'space',
                'hr',
                'heading',
                'code',
                'table',
                'blockquote',
                'list',
                'html',
                'paragraph',
                'text',
              ].includes(token2.type)
            ) {
              out += ret || '';
              continue;
            }
          }
          switch (token2.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token2.tokens),
                token2.depth,
                unescape2(this.parseInline(token2.tokens, this.textRenderer)),
                this.slugger,
              );
              continue;
            }
            case 'code': {
              out += this.renderer.code(
                token2.text,
                token2.lang,
                token2.escaped,
              );
              continue;
            }
            case 'table': {
              header = '';
              cell = '';
              l2 = token2.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token2.header[j].tokens),
                  { header: true, align: token2.align[j] },
                );
              }
              header += this.renderer.tablerow(cell);
              body = '';
              l2 = token2.rows.length;
              for (j = 0; j < l2; j++) {
                row = token2.rows[j];
                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k].tokens),
                    { header: false, align: token2.align[k] },
                  );
                }
                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token2.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token2.ordered;
              start2 = token2.start;
              loose = token2.loose;
              l2 = token2.items.length;
              body = '';
              for (j = 0; j < l2; j++) {
                item = token2.items[j];
                checked = item.checked;
                task = item.task;
                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (
                      item.tokens.length > 0 &&
                      item.tokens[0].type === 'paragraph'
                    ) {
                      item.tokens[0].text =
                        checkbox + ' ' + item.tokens[0].text;
                      if (
                        item.tokens[0].tokens &&
                        item.tokens[0].tokens.length > 0 &&
                        item.tokens[0].tokens[0].type === 'text'
                      ) {
                        item.tokens[0].tokens[0].text =
                          checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox,
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }
                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }
              out += this.renderer.list(body, ordered, start2);
              continue;
            }
            case 'html': {
              out += this.renderer.html(token2.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token2.tokens));
              continue;
            }
            case 'text': {
              body = token2.tokens
                ? this.parseInline(token2.tokens)
                : token2.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token2 = tokens[++i];
                body +=
                  '\n' +
                  (token2.tokens
                    ? this.parseInline(token2.tokens)
                    : token2.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }
            default: {
              const errMsg =
                'Token with "' + token2.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token2,
          ret;
        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token2 = tokens[i];
          if (
            this.options.extensions &&
            this.options.extensions.renderers &&
            this.options.extensions.renderers[token2.type]
          ) {
            ret = this.options.extensions.renderers[token2.type].call(
              { parser: this },
              token2,
            );
            if (
              ret !== false ||
              ![
                'escape',
                'html',
                'link',
                'image',
                'strong',
                'em',
                'codespan',
                'br',
                'del',
                'text',
              ].includes(token2.type)
            ) {
              out += ret || '';
              continue;
            }
          }
          switch (token2.type) {
            case 'escape': {
              out += renderer.text(token2.text);
              break;
            }
            case 'html': {
              out += renderer.html(token2.text);
              break;
            }
            case 'link': {
              out += renderer.link(
                token2.href,
                token2.title,
                this.parseInline(token2.tokens, renderer),
              );
              break;
            }
            case 'image': {
              out += renderer.image(token2.href, token2.title, token2.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token2.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token2.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token2.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token2.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token2.text);
              break;
            }
            default: {
              const errMsg =
                'Token with "' + token2.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    };
  },
});

// node_modules/marked/src/marked.js
var require_marked = __commonJS({
  'node_modules/marked/src/marked.js'(exports, module2) {
    init_shims();
    var Lexer = require_Lexer();
    var Parser = require_Parser();
    var Tokenizer = require_Tokenizer();
    var Renderer = require_Renderer();
    var TextRenderer = require_TextRenderer();
    var Slugger = require_Slugger();
    var {
      merge,
      checkSanitizeDeprecation,
      escape: escape2,
    } = require_helpers();
    var { getDefaults, changeDefaults, defaults } = require_defaults();
    function marked2(src2, opt, callback) {
      if (typeof src2 === 'undefined' || src2 === null) {
        throw new Error('marked(): input parameter is undefined or null');
      }
      if (typeof src2 !== 'string') {
        throw new Error(
          'marked(): input parameter is of type ' +
            Object.prototype.toString.call(src2) +
            ', string expected',
        );
      }
      if (typeof opt === 'function') {
        callback = opt;
        opt = null;
      }
      opt = merge({}, marked2.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      if (callback) {
        const highlight = opt.highlight;
        let tokens;
        try {
          tokens = Lexer.lex(src2, opt);
        } catch (e) {
          return callback(e);
        }
        const done = function (err) {
          let out;
          if (!err) {
            try {
              if (opt.walkTokens) {
                marked2.walkTokens(tokens, opt.walkTokens);
              }
              out = Parser.parse(tokens, opt);
            } catch (e) {
              err = e;
            }
          }
          opt.highlight = highlight;
          return err ? callback(err) : callback(null, out);
        };
        if (!highlight || highlight.length < 3) {
          return done();
        }
        delete opt.highlight;
        if (!tokens.length) return done();
        let pending = 0;
        marked2.walkTokens(tokens, function (token2) {
          if (token2.type === 'code') {
            pending++;
            setTimeout(() => {
              highlight(token2.text, token2.lang, function (err, code2) {
                if (err) {
                  return done(err);
                }
                if (code2 != null && code2 !== token2.text) {
                  token2.text = code2;
                  token2.escaped = true;
                }
                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });
        if (pending === 0) {
          done();
        }
        return;
      }
      try {
        const tokens = Lexer.lex(src2, opt);
        if (opt.walkTokens) {
          marked2.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parse(tokens, opt);
      } catch (e) {
        e.message +=
          '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return (
            '<p>An error occurred:</p><pre>' +
            escape2(e.message + '', true) +
            '</pre>'
          );
        }
        throw e;
      }
    }
    marked2.options = marked2.setOptions = function (opt) {
      merge(marked2.defaults, opt);
      changeDefaults(marked2.defaults);
      return marked2;
    };
    marked2.getDefaults = getDefaults;
    marked2.defaults = defaults;
    marked2.use = function (...args) {
      const opts = merge({}, ...args);
      const extensions = marked2.defaults.extensions || {
        renderers: {},
        childTokens: {},
      };
      let hasExtensions;
      args.forEach(pack => {
        if (pack.extensions) {
          hasExtensions = true;
          pack.extensions.forEach(ext => {
            if (!ext.name) {
              throw new Error('extension name required');
            }
            if (ext.renderer) {
              const prevRenderer = extensions.renderers
                ? extensions.renderers[ext.name]
                : null;
              if (prevRenderer) {
                extensions.renderers[ext.name] = function (...args2) {
                  let ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if (ext.tokenizer) {
              if (
                !ext.level ||
                (ext.level !== 'block' && ext.level !== 'inline')
              ) {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              if (extensions[ext.level]) {
                extensions[ext.level].unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === 'block') {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === 'inline') {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if (ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
        }
        if (pack.renderer) {
          const renderer = marked2.defaults.renderer || new Renderer();
          for (const prop in pack.renderer) {
            const prevRenderer = renderer[prop];
            renderer[prop] = (...args2) => {
              let ret = pack.renderer[prop].apply(renderer, args2);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args2);
              }
              return ret;
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = marked2.defaults.tokenizer || new Tokenizer();
          for (const prop in pack.tokenizer) {
            const prevTokenizer = tokenizer[prop];
            tokenizer[prop] = (...args2) => {
              let ret = pack.tokenizer[prop].apply(tokenizer, args2);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args2);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }
        if (pack.walkTokens) {
          const walkTokens = marked2.defaults.walkTokens;
          opts.walkTokens = token2 => {
            pack.walkTokens.call(this, token2);
            if (walkTokens) {
              walkTokens(token2);
            }
          };
        }
        if (hasExtensions) {
          opts.extensions = extensions;
        }
        marked2.setOptions(opts);
      });
    };
    marked2.walkTokens = function (tokens, callback) {
      for (const token2 of tokens) {
        callback(token2);
        switch (token2.type) {
          case 'table': {
            for (const cell of token2.header) {
              marked2.walkTokens(cell.tokens, callback);
            }
            for (const row of token2.rows) {
              for (const cell of row) {
                marked2.walkTokens(cell.tokens, callback);
              }
            }
            break;
          }
          case 'list': {
            marked2.walkTokens(token2.items, callback);
            break;
          }
          default: {
            if (
              marked2.defaults.extensions &&
              marked2.defaults.extensions.childTokens &&
              marked2.defaults.extensions.childTokens[token2.type]
            ) {
              marked2.defaults.extensions.childTokens[token2.type].forEach(
                function (childTokens) {
                  marked2.walkTokens(token2[childTokens], callback);
                },
              );
            } else if (token2.tokens) {
              marked2.walkTokens(token2.tokens, callback);
            }
          }
        }
      }
    };
    marked2.parseInline = function (src2, opt) {
      if (typeof src2 === 'undefined' || src2 === null) {
        throw new Error(
          'marked.parseInline(): input parameter is undefined or null',
        );
      }
      if (typeof src2 !== 'string') {
        throw new Error(
          'marked.parseInline(): input parameter is of type ' +
            Object.prototype.toString.call(src2) +
            ', string expected',
        );
      }
      opt = merge({}, marked2.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      try {
        const tokens = Lexer.lexInline(src2, opt);
        if (opt.walkTokens) {
          marked2.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parseInline(tokens, opt);
      } catch (e) {
        e.message +=
          '\nPlease report this to https://github.com/markedjs/marked.';
        if (opt.silent) {
          return (
            '<p>An error occurred:</p><pre>' +
            escape2(e.message + '', true) +
            '</pre>'
          );
        }
        throw e;
      }
    };
    marked2.Parser = Parser;
    marked2.parser = Parser.parse;
    marked2.Renderer = Renderer;
    marked2.TextRenderer = TextRenderer;
    marked2.Lexer = Lexer;
    marked2.lexer = Lexer.lex;
    marked2.Tokenizer = Tokenizer;
    marked2.Slugger = Slugger;
    marked2.parse = marked2;
    module2.exports = marked2;
  },
});

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default,
});
init_shims();

// node_modules/@sveltejs/kit/dist/node.js
init_shims();
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h['content-type']) {
      return fulfil(null);
    }
    req.on('error', reject);
    const length = Number(h['content-length']);
    if (isNaN(length) && h['transfer-encoding'] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on('data', chunk => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit',
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on('data', chunk => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on('end', () => {
      fulfil(data);
    });
  });
}

// .svelte-kit/output/server/app.js
init_shims();
var import_json_2_csv = __toModule(require_converter());
var import_marked = __toModule(require_marked());
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) throw TypeError('Cannot ' + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, 'read from private field');
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError('Cannot add the same private member more than once');
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, 'write to private field');
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers2, key) {
  const value = headers2[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(
        `Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`,
      );
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || (err && err.name && err.message)
    ? err
    : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {},
  };
}
function is_string(s2) {
  return typeof s2 === 'string' || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type) return true;
  const [type] = content_type.split(';');
  return (
    type === 'text/plain' ||
    type === 'application/json' ||
    type === 'application/x-www-form-urlencoded' ||
    type === 'multipart/form-data'
  );
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace('delete', 'del')];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== 'object') {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers: headers2 = {} } = response;
  headers2 = lowercase_keys(headers2);
  const type = get_single_valued_header(headers2, 'content-type');
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(
      `${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`,
    );
  }
  let normalized_body;
  if (
    (typeof body === 'object' || typeof body === 'undefined') &&
    !(body instanceof Uint8Array) &&
    (!type || type.startsWith('application/json'))
  ) {
    headers2 = {
      ...headers2,
      'content-type': 'application/json; charset=utf-8',
    };
    normalized_body = JSON.stringify(typeof body === 'undefined' ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers: headers2 };
}
var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved =
  /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '	': '\\t',
  '\0': '\\0',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype)
  .sort()
  .join('\0');
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === 'function') {
      throw new Error('Cannot stringify a function');
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case 'Number':
        case 'String':
        case 'Boolean':
        case 'Date':
        case 'RegExp':
          return;
        case 'Array':
          thing.forEach(walk);
          break;
        case 'Set':
        case 'Map':
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (
            proto !== Object.prototype &&
            proto !== null &&
            Object.getOwnPropertyNames(proto).sort().join('\0') !==
              objectProtoOwnPropertyNames
          ) {
            throw new Error('Cannot stringify arbitrary non-POJOs');
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error('Cannot stringify POJOs with symbolic keys');
          }
          Object.keys(thing).forEach(function (key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts)
    .filter(function (entry) {
      return entry[1] > 1;
    })
    .sort(function (a, b) {
      return b[1] - a[1];
    })
    .forEach(function (entry, i) {
      names.set(entry[0], getName(i));
    });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case 'Number':
      case 'String':
      case 'Boolean':
        return 'Object(' + stringify(thing.valueOf()) + ')';
      case 'RegExp':
        return (
          'new RegExp(' +
          stringifyString(thing.source) +
          ', "' +
          thing.flags +
          '")'
        );
      case 'Date':
        return 'new Date(' + thing.getTime() + ')';
      case 'Array':
        var members = thing.map(function (v, i) {
          return i in thing ? stringify(v) : '';
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? '' : ',';
        return '[' + members.join(',') + tail + ']';
      case 'Set':
      case 'Map':
        return (
          'new ' +
          type +
          '([' +
          Array.from(thing).map(stringify).join(',') +
          '])'
        );
      default:
        var obj =
          '{' +
          Object.keys(thing)
            .map(function (key) {
              return safeKey(key) + ':' + stringify(thing[key]);
            })
            .join(',') +
          '}';
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0
            ? 'Object.assign(Object.create(null),' + obj + ')'
            : 'Object.create(null)';
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function (name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case 'Number':
        case 'String':
        case 'Boolean':
          values_1.push('Object(' + stringify(thing.valueOf()) + ')');
          break;
        case 'RegExp':
          values_1.push(thing.toString());
          break;
        case 'Date':
          values_1.push('new Date(' + thing.getTime() + ')');
          break;
        case 'Array':
          values_1.push('Array(' + thing.length + ')');
          thing.forEach(function (v, i) {
            statements_1.push(name + '[' + i + ']=' + stringify(v));
          });
          break;
        case 'Set':
          values_1.push('new Set');
          statements_1.push(
            name +
              '.' +
              Array.from(thing)
                .map(function (v) {
                  return 'add(' + stringify(v) + ')';
                })
                .join('.'),
          );
          break;
        case 'Map':
          values_1.push('new Map');
          statements_1.push(
            name +
              '.' +
              Array.from(thing)
                .map(function (_a) {
                  var k = _a[0],
                    v = _a[1];
                  return 'set(' + stringify(k) + ', ' + stringify(v) + ')';
                })
                .join('.'),
          );
          break;
        default:
          values_1.push(
            Object.getPrototypeOf(thing) === null
              ? 'Object.create(null)'
              : '{}',
          );
          Object.keys(thing).forEach(function (key) {
            statements_1.push(
              '' + name + safeProp(key) + '=' + stringify(thing[key]),
            );
          });
      }
    });
    statements_1.push('return ' + str);
    return (
      '(function(' +
      params_1.join(',') +
      '){' +
      statements_1.join(';') +
      '}(' +
      values_1.join(',') +
      '))'
    );
  } else {
    return str;
  }
}
function getName(num) {
  var name = '';
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + '_' : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === 'string') return stringifyString(thing);
  if (thing === void 0) return 'void 0';
  if (thing === 0 && 1 / thing < 0) return '-0';
  var str = String(thing);
  if (typeof thing === 'number') return str.replace(/^(-)?0\./, '$1.');
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key)
    ? key
    : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key)
    ? '.' + key
    : '[' + escapeUnsafeChars(JSON.stringify(key)) + ']';
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code2 = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code2 >= 55296 && code2 <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code2 <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += '\\u' + code2.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {}
function safe_not_equal$1(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start2 = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start2(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === 'string') {
    while (i) hash2 = (hash2 * 33) ^ value.charCodeAt(--i);
  } else {
    while (i) hash2 = (hash2 * 33) ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2,
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css) node.css.forEach(url => css2.add(url));
      if (node.js) node.js.forEach(url => js.add(url));
      if (node.styles) node.styles.forEach(content => styles.add(content));
      if (fetched && page_config.hydrate) serialized_data.push(...fetched);
      if (uses_credentials) is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session,
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default),
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active) is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: '', html: '', css: { code: '', map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js) js.clear();
  const links = options2.amp
    ? styles.size > 0 || rendered.css.code.length > 0
      ? `<style amp-custom>${Array.from(styles)
          .concat(rendered.css.code)
          .join('\n')}</style>`
      : ''
    : [
        ...Array.from(js).map(
          dep => `<link rel="modulepreload" href="${dep}">`,
        ),
        ...Array.from(css2).map(dep => `<link rel="stylesheet" href="${dep}">`),
      ].join('\n		');
  let init2 = '';
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${
          options2.target
            ? `document.querySelector(${s$1(options2.target)})`
            : 'document.body'
        },
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, error3 => {
          throw new Error(
            `Failed to serialize session data: ${error3.message}`,
          );
        })},
				host: ${page2 && page2.host ? s$1(page2.host) : 'location.host'},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${
          page_config.ssr && page_config.hydrate
            ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(',\n						')}
					],
					page: {
						host: ${
              page2 && page2.host ? s$1(page2.host) : 'location.host'
            }, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ''}),
						params: ${page2 && s$1(page2.params)}
					}
				}`
            : 'null'
        }
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp
      ? `<style data-svelte>${Array.from(styles).join('\n')}</style>`
      : '',
    links,
    init2,
  ].join('\n\n		');
  const body = options2.amp
    ? rendered.html
    : `${rendered.html}

			${serialized_data
        .map(({ url, body: body2, json }) => {
          let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
          if (body2) attributes += ` data-body="${hash(body2)}"`;
          return `<script ${attributes}>${json}<\/script>`;
        })
        .join('\n\n	')}
		`;
  const headers2 = {
    'content-type': 'text/html',
  };
  if (maxage) {
    headers2['cache-control'] = `${
      is_private ? 'private' : 'public'
    }, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers2['permissions-policy'] = 'interest-cohort=()';
  }
  return {
    status,
    headers: headers2,
    body: options2.template({ head, body }),
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail) fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2) return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = '{}';
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status =
    loaded.status &&
    loaded.status >= 400 &&
    loaded.status <= 599 &&
    !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error(),
      };
    }
    const error2 =
      typeof loaded.error === 'string' ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(
          `"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`,
        ),
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn(
        '"error" returned from load() without a valid status code \u2014 defaulting to 500',
      );
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error(
          '"redirect" property returned from load() must be accompanied by a 3xx status code',
        ),
      };
    }
    if (typeof loaded.redirect !== 'string') {
      return {
        status: 500,
        error: new Error(
          '"redirect" property returned from load() must be a string',
        ),
      };
    }
  }
  if (loaded.context) {
    throw new Error(
      'You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.',
    );
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2,
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === 'query' && prerender_enabled) {
        throw new Error(
          'Cannot access query on a page with prerendering enabled',
        );
      }
      return Reflect.get(target, prop, receiver);
    },
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === 'string') {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts,
          };
        }
        const resolved = resolve(request.path, url.split('?')[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, '').slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find(
          d => d.file === filename || d.file === filename_html,
        );
        if (asset) {
          response = options2.read
            ? new Response(options2.read(asset.file), {
                headers: asset.type ? { 'content-type': asset.type } : {},
              })
            : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith('/') && !resolved.startsWith('//')) {
          const relative = resolved;
          const headers2 = {
            ...opts.headers,
          };
          if (opts.credentials !== 'omit') {
            uses_credentials = true;
            headers2.cookie = request.headers.cookie;
            if (!headers2.authorization) {
              headers2.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== 'string') {
            throw new Error('Request body must be a string');
          }
          const search = url.includes('?')
            ? url.slice(url.indexOf('?') + 1)
            : '';
          const rendered = await respond(
            {
              host: request.host,
              method: opts.method || 'GET',
              headers: headers2,
              path: relative,
              rawBody:
                opts.body == null ? null : new TextEncoder().encode(opts.body),
              query: new URLSearchParams(search),
            },
            options2,
            {
              fetched: url,
              initiator: route,
            },
          );
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers,
            });
          }
        } else {
          if (resolved.startsWith('//')) {
            throw new Error(
              `Cannot request protocol-relative URL (${url}) in server-side fetch`,
            );
          }
          if (typeof request.host !== 'undefined') {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(':');
            if (
              `.${fetch_hostname}`.endsWith(`.${server_hostname}`) &&
              opts.credentials !== 'omit'
            ) {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie,
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(
            null,
            external_request,
          );
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers2 = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === 'set-cookie') {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== 'etag') {
                    headers2[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === 'string') {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(
                      response2.statusText,
                    )},"headers":${s(headers2)},"body":${escape$1(body)}}`,
                  });
                }
                return body;
              }
              if (key === 'text') {
                return text;
              }
              if (key === 'json') {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            },
          });
          return proxy;
        }
        return (
          response ||
          new Response('Not found', {
            status: 404,
          })
        );
      },
      stuff: { ...stuff },
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error) return;
  if (!loaded) {
    throw new Error(
      `${node.entry} - load must return a value except for page fall through`,
    );
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials,
  };
}
var escaped$2 = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '	': '\\t',
  '\0': '\\0',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code2 = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code2 >= 55296 && code2 <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code2 <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code2.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match
    ? []
    : base2.slice(base_match[0].length).split('/');
  const pathparts = path_match
    ? path.slice(path_match[0].length).split('/')
    : path.split('/');
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === '.') continue;
    else if (part === '..') baseparts.pop();
    else baseparts.push(part);
  }
  const prefix =
    (path_match && path_match[0]) || (base_match && base_match[0]) || '';
  return `${prefix}${baseparts.join('/')}`;
}
async function respond_with_error({
  request,
  options: options2,
  state,
  $session,
  status,
  error: error2,
}) {
  const default_layout = await options2.load_component(
    options2.manifest.layout,
  );
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {},
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false,
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2,
    }),
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr,
      },
      status,
      error: error2,
      branch,
      page: page2,
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack,
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return (
    options2.prerender &&
    (!!node.module.prerender || (!!state.prerender && state.prerender.all))
  );
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(
      route.a.map(id => (id ? options2.load_component(id) : void 0)),
    );
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3,
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: '',
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr: if (page_config.ssr) {
    let stuff = {};
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      let loaded;
      if (node) {
        try {
          loaded = await load_node({
            ...opts,
            node,
            stuff,
            prerender_enabled: is_prerender_enabled(options2, node, state),
            is_leaf: i === nodes.length - 1,
            is_error: false,
          });
          if (!loaded) return;
          set_cookie_headers = set_cookie_headers.concat(
            loaded.set_cookie_headers,
          );
          if (loaded.loaded.redirect) {
            return with_cookies(
              {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect),
                },
              },
              set_cookie_headers,
            );
          }
          if (loaded.loaded.error) {
            ({ status, error: error2 } = loaded.loaded);
          }
        } catch (err) {
          const e = coalesce_to_error(err);
          options2.handle_error(e, request);
          status = 500;
          error2 = e;
        }
        if (loaded && !error2) {
          branch.push(loaded);
        }
        if (error2) {
          while (i--) {
            if (route.b[i]) {
              const error_node = await options2.load_component(route.b[i]);
              let node_loaded;
              let j = i;
              while (!(node_loaded = branch[j])) {
                j -= 1;
              }
              try {
                const error_loaded = await load_node({
                  ...opts,
                  node: error_node,
                  stuff: node_loaded.stuff,
                  prerender_enabled: is_prerender_enabled(
                    options2,
                    error_node,
                    state,
                  ),
                  is_leaf: false,
                  is_error: true,
                  status,
                  error: error2,
                });
                if (error_loaded.loaded.error) {
                  continue;
                }
                page_config = get_page_config(error_node.module, options2);
                branch = branch.slice(0, j + 1).concat(error_loaded);
                break ssr;
              } catch (err) {
                const e = coalesce_to_error(err);
                options2.handle_error(e, request);
                continue;
              }
            }
          }
          return with_cookies(
            await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2,
            }),
            set_cookie_headers,
          );
        }
      }
      if (loaded && loaded.loaded.stuff) {
        stuff = {
          ...stuff,
          ...loaded.loaded.stuff,
        };
      }
    }
  }
  try {
    return with_cookies(
      await render_response({
        ...opts,
        page_config,
        status,
        error: error2,
        branch: branch.filter(Boolean),
      }),
      set_cookie_headers,
    );
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(
      await respond_with_error({
        ...opts,
        status: 500,
        error: error3,
      }),
      set_cookie_headers,
    );
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: 'ssr' in leaf ? !!leaf.ssr : options2.ssr,
    router: 'router' in leaf ? !!leaf.router : options2.router,
    hydrate: 'hydrate' in leaf ? !!leaf.hydrate : options2.hydrate,
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers['set-cookie'] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`,
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params,
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2,
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`,
    };
  }
}
function read_only_form_data() {
  const map2 = new Map();
  return {
    append(key, value) {
      if (map2.has(key)) {
        (map2.get(key) || []).push(value);
      } else {
        map2.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map2),
  };
}
var ReadOnlyFormData = class {
  constructor(map2) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map2);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map)) yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers2) {
  if (!raw) return raw;
  const content_type = headers2['content-type'];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () =>
    new TextDecoder(headers2['content-encoding'] || 'utf-8').decode(raw);
  switch (type) {
    case 'text/plain':
      return text();
    case 'application/json':
      return JSON.parse(text());
    case 'application/x-www-form-urlencoded':
      return get_urlencoded(text());
    case 'multipart/form-data': {
      const boundary = directives.find(directive =>
        directive.startsWith('boundary='),
      );
      if (!boundary) throw new Error('Missing boundary');
      return get_multipart(text(), boundary.slice('boundary='.length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text
    .replace(/\+/g, ' ')
    .split('&')
    .forEach(str => {
      const [key, value] = str.split('=');
      append(decodeURIComponent(key), decodeURIComponent(value));
    });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== '' || parts[parts.length - 1].trim() !== '--') {
    throw new Error('Malformed form data');
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach(part => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error('Malformed form data');
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers2 = {};
    raw_headers.split('\r\n').forEach(str => {
      const [raw_header, ...raw_directives] = str.split('; ');
      let [name, value] = raw_header.split(': ');
      name = name.toLowerCase();
      headers2[name] = value;
      const directives = {};
      raw_directives.forEach(raw_directive => {
        const [name2, value2] = raw_directive.split('=');
        directives[name2] = JSON.parse(value2);
      });
      if (name === 'content-disposition') {
        if (value !== 'form-data') throw new Error('Malformed form data');
        if (directives.filename) {
          throw new Error('File upload is not yet implemented');
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key) throw new Error('Malformed form data');
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== '/' && options2.trailing_slash !== 'ignore') {
    const has_trailing_slash = incoming.path.endsWith('/');
    if (
      (has_trailing_slash && options2.trailing_slash === 'never') ||
      (!has_trailing_slash &&
        options2.trailing_slash === 'always' &&
        !(incoming.path.split('/').pop() || '').includes('.'))
    ) {
      const path = has_trailing_slash
        ? incoming.path.slice(0, -1)
        : incoming.path + '/';
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : ''),
        },
      };
    }
  }
  const headers2 = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers: headers2,
    body: parse_body(incoming.rawBody, headers2),
    params: {},
    locals: {},
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async request2 => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: [],
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match) continue;
          const response =
            route.type === 'endpoint'
              ? await render_endpoint(request2, route, match)
              : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(
                response.headers,
                'cache-control',
              );
              if (
                !cache_control ||
                !/(no-store|immutable)/.test(cache_control)
              ) {
                const etag = `"${hash(response.body || '')}"`;
                if (request2.headers['if-none-match'] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: '',
                  };
                }
                response.headers['etag'] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`),
        });
      },
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message,
    };
  }
}
function noop() {}
function is_promise(value) {
  return value && typeof value === 'object' && typeof value.then === 'function';
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === 'function';
}
function safe_not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error('Function called outside component initialization');
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach(fn => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var escaped = {
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};
function escape(html2) {
  return String(html2).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
  let str = '';
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => '',
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === 'svelte:component') name += ' this={...}';
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`,
    );
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(
        context || (parent_component ? parent_component.$$.context : []),
      ),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object(),
    };
    set_current_component({ $$ });
    const html2 = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html2;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: '', head: '', css: new Set() };
      const html2 = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html: html2,
        css: {
          code: Array.from(result.css)
            .map(css2 => css2.code)
            .join('\n'),
          map: null,
        },
        head: result.title + result.head,
      };
    },
    $$render,
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || (boolean && !value)) return '';
  return ` ${name}${
    value === true
      ? ''
      : `=${
          typeof value === 'string'
            ? JSON.stringify(escape(value))
            : `"${value}"`
        }`
  }`;
}
function afterUpdate() {}
var css$i = {
  code: '#svelte-announcer.svelte-9z6sc{position:absolute;left:0;top:0;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}',
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\t-webkit-clip-path: inset(50%);\\n\\t\\t        clip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}</style>"],"names":[],"mappings":"AAsDC,iBAAiB,aAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,iBAAiB,CAAE,MAAM,GAAG,CAAC,CACrB,SAAS,CAAE,MAAM,GAAG,CAAC,CAC7B,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`,
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext('__svelte__', stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if (
    $$props.components === void 0 &&
    $$bindings.components &&
    components !== void 0
  )
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$i);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(
  components[0] || missing_component,
  'svelte:component',
).$$render(
  $$result,
  Object.assign(props_0 || {}),
  {},
  {
    default: () =>
      `${
        components[1]
          ? `${validate_component(
              components[1] || missing_component,
              'svelte:component',
            ).$$render(
              $$result,
              Object.assign(props_1 || {}),
              {},
              {
                default: () =>
                  `${
                    components[2]
                      ? `${validate_component(
                          components[2] || missing_component,
                          'svelte:component',
                        ).$$render(
                          $$result,
                          Object.assign(props_2 || {}),
                          {},
                          {},
                        )}`
                      : ``
                  }`,
              },
            )}`
          : ``
      }`,
  },
)}

${``}`;
});
var base$1 = '';
var assets = '';
function set_paths(paths) {
  base$1 = paths.base;
  assets = paths.assets || base$1;
}
function set_prerendering(value) {}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
});
var template = ({ head, body }) =>
  '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <link rel="icon" href="/favicon.png" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    ' +
  head +
  `

    <link rel="stylesheet" href="./global.css" />
    <link rel="stylesheet" href="./style.css" />
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-ZPGFWYWMHX"
    ><\/script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());

      gtag('config', 'G-ZPGFWYWMHX');
    <\/script>

    <script src="https://polyfill.io/v3/polyfill.min.js" defer><\/script>
  </head>
  <body>
    <div id="svelte">` +
  body +
  '</div>\n  </body>\n</html>\n';
var options$1 = null;
var default_settings = { paths: { base: '', assets: '' } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options$1 = {
    amp: false,
    dev: false,
    entry: {
      file: assets + '/_app/start-ac85fc63.js',
      css: [
        assets + '/_app/assets/start-c446e5f0.css',
        assets + '/_app/assets/vendor-1ced044c.css',
      ],
      js: [
        assets + '/_app/start-ac85fc63.js',
        assets + '/_app/chunks/vendor-74fb33b7.js',
        assets + '/_app/chunks/singletons-12a22614.js',
      ],
    },
    fetched: void 0,
    floc: false,
    get_component_path: id => assets + '/_app/' + entry_lookup[id],
    get_stack: error2 => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options$1.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: '#svelte',
    template,
    trailing_slash: 'never',
  };
}
var empty = () => ({});
var manifest = {
  assets: [
    { file: 'favicon.png', size: 1571, type: 'image/png' },
    { file: 'feather-sprite.svg', size: 60146, type: 'image/svg+xml' },
    { file: 'global.css', size: 628, type: 'text/css' },
    { file: 'manifest.json', size: 153, type: 'application/json' },
    { file: 'style.css', size: 401, type: 'text/css' },
  ],
  layout: 'src/routes/__layout.svelte',
  error: 'src/routes/__error.svelte',
  routes: [
    {
      type: 'page',
      pattern: /^\/$/,
      params: empty,
      a: ['src/routes/__layout.svelte', 'src/routes/index.svelte'],
      b: ['src/routes/__error.svelte'],
    },
    {
      type: 'page',
      pattern: /^\/budgets\/?$/,
      params: empty,
      a: ['src/routes/__layout.svelte', 'src/routes/budgets/index.svelte'],
      b: ['src/routes/__error.svelte'],
    },
    {
      type: 'endpoint',
      pattern: /^\/budgets\/cache\/?$/,
      params: empty,
      load: () =>
        Promise.resolve().then(function () {
          return cache;
        }),
    },
    {
      type: 'page',
      pattern: /^\/about\/?$/,
      params: empty,
      a: ['src/routes/__layout.svelte', 'src/routes/about.svelte'],
      b: ['src/routes/__error.svelte'],
    },
    {
      type: 'page',
      pattern: /^\/home\/?$/,
      params: empty,
      a: ['src/routes/__layout.svelte', 'src/routes/home/index.svelte'],
      b: ['src/routes/__error.svelte'],
    },
  ],
};
var get_hooks = hooks => ({
  getSession: hooks.getSession || (() => ({})),
  handle:
    hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError:
    hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch,
});
var module_lookup = {
  'src/routes/__layout.svelte': () =>
    Promise.resolve().then(function () {
      return __layout;
    }),
  'src/routes/__error.svelte': () =>
    Promise.resolve().then(function () {
      return __error;
    }),
  'src/routes/index.svelte': () =>
    Promise.resolve().then(function () {
      return index$1;
    }),
  'src/routes/budgets/index.svelte': () =>
    Promise.resolve().then(function () {
      return index;
    }),
  'src/routes/about.svelte': () =>
    Promise.resolve().then(function () {
      return about;
    }),
  'src/routes/home/index.svelte': () =>
    Promise.resolve().then(function () {
      return index$2;
    }),
};
var metadata_lookup = {
  'src/routes/__layout.svelte': {
    entry: 'pages/__layout.svelte-927177cc.js',
    css: [
      'assets/pages/__layout.svelte-2e1039b2.css',
      'assets/vendor-1ced044c.css',
    ],
    js: [
      'pages/__layout.svelte-927177cc.js',
      'chunks/vendor-74fb33b7.js',
      'chunks/Icon-b25d6312.js',
    ],
    styles: [],
  },
  'src/routes/__error.svelte': {
    entry: 'pages/__error.svelte-ad43c8c1.js',
    css: [
      'assets/pages/__error.svelte-51aeb449.css',
      'assets/vendor-1ced044c.css',
    ],
    js: ['pages/__error.svelte-ad43c8c1.js', 'chunks/vendor-74fb33b7.js'],
    styles: [],
  },
  'src/routes/index.svelte': {
    entry: 'pages/index.svelte-8cf63b95.js',
    css: [
      'assets/vendor-1ced044c.css',
      'assets/pages/home/index.svelte-4d4d2e3d.css',
      'assets/navigation-ddc5d0e9.css',
    ],
    js: [
      'pages/index.svelte-8cf63b95.js',
      'chunks/vendor-74fb33b7.js',
      'pages/home/index.svelte-6c5a235b.js',
      'chunks/navigation-86cde1c3.js',
      'chunks/singletons-12a22614.js',
      'chunks/Icon-b25d6312.js',
    ],
    styles: [],
  },
  'src/routes/budgets/index.svelte': {
    entry: 'pages/budgets/index.svelte-e557db7c.js',
    css: [
      'assets/pages/budgets/index.svelte-88ba2f5e.css',
      'assets/vendor-1ced044c.css',
      'assets/navigation-ddc5d0e9.css',
    ],
    js: [
      'pages/budgets/index.svelte-e557db7c.js',
      'chunks/vendor-74fb33b7.js',
      'chunks/navigation-86cde1c3.js',
      'chunks/singletons-12a22614.js',
      'chunks/Icon-b25d6312.js',
    ],
    styles: [],
  },
  'src/routes/about.svelte': {
    entry: 'pages/about.svelte-82bdf6ff.js',
    css: [
      'assets/pages/about.svelte-50a1a333.css',
      'assets/vendor-1ced044c.css',
    ],
    js: ['pages/about.svelte-82bdf6ff.js', 'chunks/vendor-74fb33b7.js'],
    styles: [],
  },
  'src/routes/home/index.svelte': {
    entry: 'pages/home/index.svelte-6c5a235b.js',
    css: [
      'assets/pages/home/index.svelte-4d4d2e3d.css',
      'assets/vendor-1ced044c.css',
      'assets/navigation-ddc5d0e9.css',
    ],
    js: [
      'pages/home/index.svelte-6c5a235b.js',
      'chunks/vendor-74fb33b7.js',
      'chunks/navigation-86cde1c3.js',
      'chunks/singletons-12a22614.js',
      'chunks/Icon-b25d6312.js',
    ],
    styles: [],
  },
};
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + '/_app/' + entry,
    css: css2.map(dep => assets + '/_app/' + dep),
    js: js.map(dep => assets + '/_app/' + dep),
    styles,
  };
}
function render(request, { prerender } = {}) {
  const host = request.headers['host'];
  return respond({ ...request, host }, options$1, { prerender });
}
function get(url, options2) {
  return fetch(url, options2).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    const stream = resp.url.endsWith('.xml') ? resp.text() : resp.json();
    return stream;
  });
}
var fields = ['code', 'nom', 'departement', 'region', 'population'];
function makeGetCityEndpoint(code2) {
  if (!code2) {
    throw 'No code provided';
  }
  const base2 = 'communes';
  const fieldsString = `fields=${fields.join(',')}`;
  return `${base2}/${code2}?${fieldsString}`;
}
var baseUrl$1 = 'https://geo.api.gouv.fr';
function getCity(insee) {
  const endpoint = makeGetCityEndpoint(insee);
  return get(`${baseUrl$1}/${endpoint}`);
}
var DEFAULT_LABEL = 'commune';
function makeId(siret, year) {
  if (!siret) throw Error('Missing siret');
  if (year == null) throw Error('Missing year');
  return `${siret}_${year}`;
}
function makeBudgetUrl({ name, insee, siret, sirens, year }) {
  if (!name || !insee || !siret || !sirens || !sirens.length || year == null)
    throw Error('Missing parameter');
  const sirensAsString = sirens.join(',');
  return `/budgets?name=${name}&insee=${insee}&siret=${siret}&sirens=${sirensAsString}&year=${year}`;
}
function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function formatValue(value) {
  return new Intl.NumberFormat('fr', {
    style: 'currency',
    notation: 'compact',
    currency: 'EUR',
  }).format(value);
}
function extractSiren(siret) {
  return siret.substring(0, 9);
}
function extractEtabl(siret) {
  return siret.substring(9);
}
var toRemove = ['-', ' de'];
function formatLabel(label, name) {
  const l = normalizeText(label);
  const n = normalizeText(name.toLowerCase());
  if (l === n) return DEFAULT_LABEL;
  let formatted = label.replace(n, '').trim().toLowerCase();
  toRemove.forEach(c => {
    formatted = formatted.replace(new RegExp(`${c}$`), '');
  });
  return formatted;
}
function sumBy(list, key) {
  return list.reduce((acc, cur) => acc + cur[key], 0);
}
function stepsFromString(s2) {
  return s2.split('').map((e, i, a) => (i > 0 ? a[i - 1] + e : e));
}
var { json2csvAsync: toCSV } = import_json_2_csv.default;
var keys = [
  'EXER',
  'IDENT',
  'NDEPT',
  'LBUDG',
  'INSEE',
  'CBUDG',
  'CTYPE',
  'CSTYP',
  'NOMEN',
  'SIREN',
  'CREGI',
  'CACTI',
  'SECTEUR',
  'FINESS',
  'CODBUD1',
  'CATEG',
  'BAL',
  'FONCTION',
  'COMPTE',
  'BEDEB',
  'BECRE',
  'OBNETDEB',
  'OBNETCRE',
  'ONBDEB',
  'ONBCRE',
  'OOBDEB',
  'OOBCRE',
  'SD',
  'SC',
].map(t => t.toLowerCase());
async function makeCSV(data) {
  const { city: city2, label, records } = data;
  const years2 = [...new Set(records.map(d => d.exer))];
  const year = years2.length === 1 ? years2[0] : null;
  const sirets = [...new Set(records.map(d => d.ident))];
  const siret = sirets.length === 1 ? sirets[0] : null;
  let file = `budget_${city2.toLowerCase()}`;
  if (label) file += `_${label.split(' ').join('_')}`;
  if (siret) file += `_${siret}`;
  if (year) file += `_${year}`;
  file += '.csv';
  const csv = await toCSV(records, { keys });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  return {
    file,
    url,
  };
}
function makeBudget(data) {
  const { city: city2, siret, year, records } = data;
  const id = makeId(siret, year);
  const length = records.length;
  if (length === 0) return null;
  const siren = extractSiren(siret);
  const etabl = extractEtabl(siret);
  const obnetdeb = sumBy(records, BudgetCode.OBNETDEB);
  const obnetcre = sumBy(records, BudgetCode.OBNETCRE);
  const labels = [
    ...new Set(records.map(record => record.lbudg.toLowerCase())),
  ];
  const nomens = [...new Set(records.map(record => record.nomen))];
  if (labels.length > 1) {
    console.log('More than 1 label for', siret, year);
  }
  if (nomens.length > 1) {
    console.log('More than 1 nomen for', siret, year);
  }
  const label = labels.length > 0 ? formatLabel(labels[0], city2) : '';
  const nomen = nomens.length > 0 ? nomens[0] : '';
  return {
    id,
    siret,
    siren,
    etabl,
    city: city2,
    year,
    nomen,
    length,
    obnetdeb,
    obnetcre,
    label,
    records,
  };
}
function orderRecordsBySiret(records) {
  const sirets = [...new Set(records.map(({ ident }) => ident))];
  return sirets
    .map(siret => {
      const siretRecords = records.filter(({ ident }) => {
        return ident === siret;
      });
      return { siret, records: siretRecords };
    })
    .sort((r1, r2) => parseInt(r1.siret) - parseInt(r2.siret));
}
var BudgetCode;
(function (BudgetCode2) {
  BudgetCode2['OBNETDEB'] = 'obnetdeb';
  BudgetCode2['OBNETCRE'] = 'obnetcre';
  BudgetCode2['OOBDEB'] = 'oobdeb';
  BudgetCode2['OOBCRE'] = 'oobcre';
})(BudgetCode || (BudgetCode = {}));
var BudgetType;
(function (BudgetType2) {
  BudgetType2['DEBIT'] = 'obnetdeb';
  BudgetType2['CREDIT'] = 'obnetcre';
})(BudgetType || (BudgetType = {}));
var typeToLabel = {
  [BudgetType.DEBIT]: 'D\xE9penses',
  [BudgetType.CREDIT]: 'Recettes',
};
function fonctionFromTree(code2, tree2) {
  if (!(code2 in tree2)) {
    return fonctionFromTree(code2, tree2[code2[0]].subTree);
  }
  return tree2[code2];
}
function aggregateData(records, tree2) {
  const aggregate = Object.values(tree2).map(fonction2 => {
    const { code: code2, subTree } = fonction2;
    let obnetdeb;
    let obnetcre;
    let oobdeb;
    let oobcre;
    const output = { ...fonction2 };
    const filteredRecords = records.filter(r => {
      var _a;
      return (_a = r.fonction) == null ? void 0 : _a.startsWith(code2);
    });
    if (!subTree) {
      obnetdeb = sumBy(filteredRecords, BudgetCode.OBNETDEB);
      obnetcre = sumBy(filteredRecords, BudgetCode.OBNETCRE);
      oobdeb = sumBy(filteredRecords, BudgetCode.OOBDEB);
      oobcre = sumBy(filteredRecords, BudgetCode.OOBCRE);
    } else {
      const subAgg = aggregateData(filteredRecords, subTree);
      const values = Object.values(subAgg).map(agg => agg.value);
      obnetdeb = sumBy(values, BudgetCode.OBNETDEB);
      obnetcre = sumBy(values, BudgetCode.OBNETCRE);
      oobdeb = sumBy(values, BudgetCode.OOBDEB);
      oobcre = sumBy(values, BudgetCode.OOBCRE);
      output.subTree = subAgg;
    }
    return [
      code2,
      {
        ...output,
        value: {
          obnetdeb,
          obnetcre,
          oobdeb,
          oobcre,
        },
      },
    ];
  });
  return Object.fromEntries(aggregate);
}
function makeNomenId(code2, population) {
  let suffix = '';
  if (code2) {
    if (!population || population >= 3500) suffix = `_COM_SUP3500`;
    else if (population < 500) suffix = `_COM_INF500`;
    else suffix = `_COM_500_3500`;
  } else {
    throw Error('No code provided');
  }
  return code2 + suffix;
}
var nbResults$1 = 1e3;
var category = '7210';
function buildParamString$1(paramByKey) {
  return Object.entries(paramByKey)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const s2 = value.map(v => `${key}:${v}`).join(' OR ');
        return `(${s2})`;
      }
      return `${key}:${value}`;
    })
    .join(' AND ');
}
var codesByMain = {
  69123: {
    name: 'Lyon',
    nb: 9,
    base: 69380,
  },
  75056: {
    name: 'Paris',
    nb: 20,
    base: 75100,
  },
  13055: {
    name: 'Marseille',
    nb: 16,
    base: 13200,
  },
};
function checkCodes(code2) {
  let output = [parseInt(code2)];
  if (code2 in codesByMain) {
    const { nb, base: base2 } = codesByMain[code2];
    output = [...output, ...Array(nb).keys()].map(e => base2 + e + 1);
  }
  return output;
}
function makeSearchSiretEndpoint(text, codes) {
  const base2 = 'siret';
  const params = buildParamString$1({
    denominationUniteLegale: normalizeText(text),
    codeCommuneEtablissement: codes,
    categorieJuridiqueUniteLegale: category,
  });
  const number = `nombre=${nbResults$1}`;
  const query = `q=${params}`;
  const allParams = [query, number].join('&');
  return `${base2}?${allParams}`;
}
function extractSirens(etablissements) {
  return [...new Set(etablissements.map(({ siren }) => siren))];
}
var token = 'f72cd59e-d5a0-3a1e-a767-9002a6ae04d2';
var baseUrl = 'https://api.insee.fr/entreprises/sirene/V3';
var headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
};
var options = {
  headers,
};
function getSiretsFromInsee(text, code2) {
  const codes = checkCodes(code2);
  const endpoint = makeSearchSiretEndpoint(text, codes);
  return get(`${baseUrl}/${endpoint}`, options).then(r => r.etablissements);
}
var nbResults = 1e4;
var byYear = {
  2018: '0',
  2016: '1',
  2015: '2',
  2014: '3',
  2013: '4',
  2012: '5',
  2019: '6',
  2020: '7',
  2017: '-',
};
var base = 'api/records/1.0/search';
function buildParamString(paramByKey) {
  return Object.entries(paramByKey)
    .filter(([key]) => key !== 'year')
    .map(([key, value]) => {
      const valueString = Array.isArray(value) ? value.join(' OR ') : value;
      return `${key}:${valueString}`;
    })
    .join('&');
}
function makeBudgetCroiseEndpoint(params) {
  const { year } = params;
  const dataset = `balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec${byYear[year]}`;
  const paramString = buildParamString(params);
  const query = `q=${paramString}`;
  const rows = `rows=${nbResults}`;
  const allParams = [dataset, query, rows].join('&');
  return `${base}?dataset=${allParams}`;
}
function makeNomenEndpoint(year, code2, population) {
  const extension = 'xml';
  const codeSuffix = makeNomenId(code2, population);
  const fileName = `${codeSuffix}.${extension}`;
  return [year, code2, fileName].join('/');
}
var recordsUrl = 'https://data.economie.gouv.fr';
function getRecords(params) {
  const endpoint = makeBudgetCroiseEndpoint(params);
  return get(`${recordsUrl}/${endpoint}`).then(({ records }) =>
    records.map(record => record.fields),
  );
}
var nomenUrl =
  'https://raw.githubusercontent.com/iOiurson/plans-de-compte/main';
function getNomen(year, code2, population) {
  const endpoint = makeNomenEndpoint(year, code2, population);
  return get(`${nomenUrl}/${endpoint}`);
}
var budgetCache = {};
function fillBudgetBySiret(siret, years2, name) {
  const budgets = [];
  years2.forEach(currYear => {
    const id = makeId(siret, currYear);
    const p =
      id in budgetCache
        ? Promise.resolve(budgetCache[id])
        : getRecords({
            ident: [siret],
            year: currYear,
          })
            .catch(() => [])
            .then(records => {
              const b = makeBudget({
                city: name,
                siret,
                year: currYear,
                records,
              });
              budgetCache[id] = b;
              return b;
            });
    budgets.push(p);
  });
  return budgets;
}
function fillBudgetBySirens(sirens, years2, name) {
  const sirensToFetch = [];
  let siretsInCache = [];
  sirens.forEach(siren => {
    const sirets = Object.keys(budgetCache).filter(s2 => s2.startsWith(siren));
    if (sirets.length) {
      siretsInCache = [...siretsInCache, ...sirets];
    } else {
      sirensToFetch.push(siren);
    }
  });
  const needToFetch = sirensToFetch.length > 0;
  return [...years2].reverse().map(year => {
    const cached = siretsInCache.map(id => budgetCache[id]).filter(b => b);
    return !needToFetch
      ? Promise.resolve(cached)
      : Promise.all([
          Promise.resolve(cached),
          getRecords({ siren: sirensToFetch, year })
            .catch(() => [])
            .then(records =>
              orderRecordsBySiret(records).map(
                ({ siret, records: records2 }) => {
                  const b = makeBudget({
                    city: name,
                    siret,
                    year,
                    records: records2,
                  });
                  const id = makeId(siret, year);
                  if (!(id in budgetCache)) {
                    budgetCache[id] = b;
                  }
                  return b;
                },
              ),
            ),
        ]).then(budgets => budgets.flat());
  });
}
var cache = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  fillBudgetBySiret,
  fillBudgetBySirens,
});
var getStores = () => {
  const stores = getContext('__svelte__');
  return {
    page: {
      subscribe: stores.page.subscribe,
    },
    navigating: {
      subscribe: stores.navigating.subscribe,
    },
    get preloading() {
      console.error(
        'stores.preloading is deprecated; use stores.navigating instead',
      );
      return {
        subscribe: stores.navigating.subscribe,
      };
    },
    session: stores.session,
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  },
};
var Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id } = $$props;
  let { color = void 0 } = $$props;
  let { filled = false } = $$props;
  let { size = '1em' } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.filled === void 0 && $$bindings.filled && filled !== void 0)
    $$bindings.filled(filled);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `<svg class="${'Icon'}"${add_attribute(
    'fill',
    filled ? color : ' none',
    0,
  )}${add_attribute(
    'stroke',
    color != null ? color : 'currentColor',
    0,
  )} stroke-width="${'2'}" stroke-linecap="${'round'}" stroke-linejoin="${'round'}"${add_attribute(
    'width',
    size,
    0,
  )}${add_attribute('height', size, 0)}><use${add_attribute(
    'href',
    `feather-sprite.svg#${id}`,
    0,
  )}></use></svg>`;
});
var css$h = {
  code: 'header.svelte-xdj4w6.svelte-xdj4w6{display:flex;justify-content:space-between;height:3rem}a.svelte-xdj4w6.svelte-xdj4w6{display:flex;align-items:center;margin:0 0.5rem;cursor:pointer}.home.svelte-xdj4w6.svelte-xdj4w6{font-size:1.5rem}.home.svelte-xdj4w6 .Icon{align-self:center}.home.svelte-xdj4w6>div.svelte-xdj4w6{display:flex;align-items:baseline}.home.svelte-xdj4w6 h1.svelte-xdj4w6{color:black;margin:0 0.5rem;font-size:1.4rem}.home.svelte-xdj4w6 h2.svelte-xdj4w6{color:#bbb;font-size:1rem;display:flex;align-items:center}a.svelte-xdj4w6.svelte-xdj4w6{transition:color 0.3s ease-in-out}a.svelte-xdj4w6.svelte-xdj4w6:hover{color:coral}a.current.svelte-xdj4w6.svelte-xdj4w6{color:cornflowerblue;cursor:unset}a.current.svelte-xdj4w6.svelte-xdj4w6:hover{color:cornflowerblue;opacity:unset}nav.svelte-xdj4w6.svelte-xdj4w6{display:flex;justify-content:flex-end;align-items:stretch;padding:0.5rem;color:black;background:white;z-index:1}nav.svelte-xdj4w6 a.svelte-xdj4w6{transition:color 0.3s ease-in-out}nav.svelte-xdj4w6 a.svelte-xdj4w6:hover{color:coral}nav.svelte-xdj4w6 a.current.svelte-xdj4w6{color:cornflowerblue;cursor:unset}nav.svelte-xdj4w6 a.current.svelte-xdj4w6:hover{color:cornflowerblue;opacity:unset}',
  map: `{"version":3,"file":"Nav.svelte","sources":["Nav.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Icon from './Icon.svelte';\\nexport let path;\\n<\/script>\\n\\n<header>\\n  <a href=\\"/\\" class=\\"home\\" class:current={path === 'home'}>\\n    <div>\\n      <Icon id=\\"book-open\\" />\\n      <h1>Livres ouverts</h1>\\n      <h2>Les donn\xE9es budg\xE9taires des communes</h2>\\n    </div>\\n  </a>\\n  <nav class=\\"Nav\\">\\n    <a href=\\"/about\\" class:current={path === 'about'}>\xC0 propos</a>\\n    <a href=\\"https://github.com/iOiurson/open-books\\">\\n      <Icon id=\\"github\\" />\\n    </a>\\n  </nav>\\n</header>\\n\\n<style lang=\\"scss\\">header {\\n  display: flex;\\n  justify-content: space-between;\\n  height: 3rem;\\n}\\n\\na {\\n  display: flex;\\n  align-items: center;\\n  margin: 0 0.5rem;\\n  cursor: pointer;\\n}\\n\\n.home {\\n  font-size: 1.5rem;\\n}\\n.home :global(.Icon) {\\n  align-self: center;\\n}\\n.home > div {\\n  display: flex;\\n  align-items: baseline;\\n}\\n.home h1 {\\n  color: black;\\n  margin: 0 0.5rem;\\n  font-size: 1.4rem;\\n}\\n.home h2 {\\n  color: #bbb;\\n  font-size: 1rem;\\n  display: flex;\\n  align-items: center;\\n}\\n\\na {\\n  transition: color 0.3s ease-in-out;\\n}\\na:hover {\\n  color: coral;\\n}\\na.current {\\n  color: cornflowerblue;\\n  cursor: unset;\\n}\\na.current:hover {\\n  color: cornflowerblue;\\n  opacity: unset;\\n}\\n\\nnav {\\n  display: flex;\\n  justify-content: flex-end;\\n  align-items: stretch;\\n  padding: 0.5rem;\\n  color: black;\\n  background: white;\\n  z-index: 1;\\n}\\nnav a {\\n  transition: color 0.3s ease-in-out;\\n}\\nnav a:hover {\\n  color: coral;\\n}\\nnav a.current {\\n  color: cornflowerblue;\\n  cursor: unset;\\n}\\nnav a.current:hover {\\n  color: cornflowerblue;\\n  opacity: unset;\\n}\\nnav a i {\\n  font-size: 1.2rem;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  border-radius: 50%;\\n}</style>\\n"],"names":[],"mappings":"AAoBmB,MAAM,4BAAC,CAAC,AACzB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,MAAM,CAAE,IAAI,AACd,CAAC,AAED,CAAC,4BAAC,CAAC,AACD,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,CAAC,CAAC,MAAM,CAChB,MAAM,CAAE,OAAO,AACjB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,mBAAK,CAAC,AAAQ,KAAK,AAAE,CAAC,AACpB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,mBAAK,CAAG,GAAG,cAAC,CAAC,AACX,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,QAAQ,AACvB,CAAC,AACD,mBAAK,CAAC,EAAE,cAAC,CAAC,AACR,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,CAAC,CAAC,MAAM,CAChB,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,mBAAK,CAAC,EAAE,cAAC,CAAC,AACR,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,CAAC,4BAAC,CAAC,AACD,UAAU,CAAE,KAAK,CAAC,IAAI,CAAC,WAAW,AACpC,CAAC,AACD,6BAAC,MAAM,AAAC,CAAC,AACP,KAAK,CAAE,KAAK,AACd,CAAC,AACD,CAAC,QAAQ,4BAAC,CAAC,AACT,KAAK,CAAE,cAAc,CACrB,MAAM,CAAE,KAAK,AACf,CAAC,AACD,CAAC,oCAAQ,MAAM,AAAC,CAAC,AACf,KAAK,CAAE,cAAc,CACrB,OAAO,CAAE,KAAK,AAChB,CAAC,AAED,GAAG,4BAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,QAAQ,CACzB,WAAW,CAAE,OAAO,CACpB,OAAO,CAAE,MAAM,CACf,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,iBAAG,CAAC,CAAC,cAAC,CAAC,AACL,UAAU,CAAE,KAAK,CAAC,IAAI,CAAC,WAAW,AACpC,CAAC,AACD,iBAAG,CAAC,eAAC,MAAM,AAAC,CAAC,AACX,KAAK,CAAE,KAAK,AACd,CAAC,AACD,iBAAG,CAAC,CAAC,QAAQ,cAAC,CAAC,AACb,KAAK,CAAE,cAAc,CACrB,MAAM,CAAE,KAAK,AACf,CAAC,AACD,iBAAG,CAAC,CAAC,sBAAQ,MAAM,AAAC,CAAC,AACnB,KAAK,CAAE,cAAc,CACrB,OAAO,CAAE,KAAK,AAChB,CAAC"}`,
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  $$result.css.add(css$h);
  return `<header class="${'svelte-xdj4w6'}"><a href="${'/'}" class="${[
    'home svelte-xdj4w6',
    path === 'home' ? 'current' : '',
  ]
    .join(' ')
    .trim()}"><div class="${'svelte-xdj4w6'}">${validate_component(
    Icon,
    'Icon',
  ).$$render($$result, { id: 'book-open' }, {}, {})}
      <h1 class="${'svelte-xdj4w6'}">Livres ouverts</h1>
      <h2 class="${'svelte-xdj4w6'}">Les donn\xE9es budg\xE9taires des communes</h2></div></a>
  <nav class="${'Nav svelte-xdj4w6'}"><a href="${'/about'}" class="${[
    'svelte-xdj4w6',
    path === 'about' ? 'current' : '',
  ]
    .join(' ')
    .trim()}">\xC0 propos</a>
    <a href="${'https://github.com/iOiurson/open-books'}" class="${'svelte-xdj4w6'}">${validate_component(
    Icon,
    'Icon',
  ).$$render($$result, { id: 'github' }, {}, {})}</a></nav>
</header>`;
});
var GoogleAnalytics = create_ssr_component(
  ($$result, $$props, $$bindings, slots) => {
    let $page, $$unsubscribe_page;
    $$unsubscribe_page = subscribe(page, value => ($page = value));
    {
      {
        if (typeof gtag !== 'undefined') {
          gtag('config', 'G-ZPGFWYWMHX', { page_path: $page.path });
        }
      }
    }
    $$unsubscribe_page();
    return ``;
  },
);
var css$g = {
  code: '.page.svelte-1hseanh{flex:1 0;display:flex;flex-flow:column;overflow:hidden}.icon{width:1em;height:1em;vertical-align:-0.125em}',
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { page } from '$app/stores';\\nimport Nav from '$lib/Nav.svelte';\\nimport GoogleAnalytics from '$lib/GoogleAnalytics.svelte';\\n$: segment = $page.path.split('/')[1];\\n<\/script>\\n\\n<GoogleAnalytics />\\n<div class=\\"page\\">\\n  {#if segment !== 'budgets'}\\n    <Nav path={segment || 'home'} />\\n  {/if}\\n\\n  <slot />\\n</div>\\n\\n<style class=\\"scss\\">\\n  .page {\\n    flex: 1 0;\\n    display: flex;\\n    flex-flow: column;\\n    overflow: hidden;\\n  }\\n\\n  :global(.icon) {\\n    width: 1em;\\n    height: 1em;\\n    vertical-align: -0.125em;\\n  }</style>\\n"],"names":[],"mappings":"AAgBE,KAAK,eAAC,CAAC,AACL,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,QAAQ,CAAE,MAAM,AAClB,CAAC,AAEO,KAAK,AAAE,CAAC,AACd,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,CACX,cAAc,CAAE,QAAQ,AAC1B,CAAC"}`,
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let segment;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, value => ($page = value));
  $$result.css.add(css$g);
  segment = $page.path.split('/')[1];
  $$unsubscribe_page();
  return `${validate_component(GoogleAnalytics, 'GoogleAnalytics').$$render(
    $$result,
    {},
    {},
    {},
  )}
<div class="${'page svelte-1hseanh'}">${
    segment !== 'budgets'
      ? `${validate_component(Nav, 'Nav').$$render(
          $$result,
          { path: segment || 'home' },
          {},
          {},
        )}`
      : ``
  }

  ${slots.default ? slots.default({}) : ``}
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  default: _layout,
});
var css$f = {
  code: 'h1.svelte-q8ws67,p.svelte-q8ws67{margin:0 auto}h1.svelte-q8ws67{font-size:2.8em;font-weight:700;margin:0 0 0.5em 0}p.svelte-q8ws67{margin:1em auto}@media(min-width: 480px){h1.svelte-q8ws67{font-size:4em}}',
  map: '{"version":3,"file":"__error.svelte","sources":["__error.svelte"],"sourcesContent":["<script context=\\"module\\" lang=\\"ts\\">export function load({ error, status }) {\\n    return {\\n        props: {\\n            code: status,\\n            message: error.message,\\n        },\\n    };\\n}\\n</script>\\n\\n<script lang=\\"ts\\">export let message;\\nexport let code;\\n$: title = `${code}: ${message}`;\\n</script>\\n\\n<h1>{title}</h1>\\n\\n<svelte:head>\\n  <title>{code}</title>\\n</svelte:head>\\n\\n<h1>{code}</h1>\\n\\n<p>{message}</p>\\n\\n<style lang=\\"scss\\">h1,\\np {\\n  margin: 0 auto;\\n}\\n\\nh1 {\\n  font-size: 2.8em;\\n  font-weight: 700;\\n  margin: 0 0 0.5em 0;\\n}\\n\\np {\\n  margin: 1em auto;\\n}\\n\\n@media (min-width: 480px) {\\n  h1 {\\n    font-size: 4em;\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAyBmB,gBAAE,CACrB,CAAC,cAAC,CAAC,AACD,MAAM,CAAE,CAAC,CAAC,IAAI,AAChB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACrB,CAAC,AAED,CAAC,cAAC,CAAC,AACD,MAAM,CAAE,GAAG,CAAC,IAAI,AAClB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,EAAE,cAAC,CAAC,AACF,SAAS,CAAE,GAAG,AAChB,CAAC,AACH,CAAC"}',
};
function load$1({ error: error2, status }) {
  return {
    props: { code: status, message: error2.message },
  };
}
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let title;
  let { message } = $$props;
  let { code: code2 } = $$props;
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  if ($$props.code === void 0 && $$bindings.code && code2 !== void 0)
    $$bindings.code(code2);
  $$result.css.add(css$f);
  title = `${code2}: ${message}`;
  return `<h1 class="${'svelte-q8ws67'}">${escape(title)}</h1>

${
  (($$result.head += `${
    (($$result.title = `<title>${escape(code2)}</title>`), '')
  }`),
  '')
}

<h1 class="${'svelte-q8ws67'}">${escape(code2)}</h1>

<p class="${'svelte-q8ws67'}">${escape(message)}</p>`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  default: _error,
  load: load$1,
});
var subscriber_queue = [];
function readable(value, start2) {
  return {
    subscribe: writable(value, start2).subscribe,
  };
}
function writable(value, start2 = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start2(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, set => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map((store, i) =>
      subscribe(
        store,
        value => {
          values[i] = value;
          pending &= ~(1 << i);
          if (inited) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        },
      ),
    );
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}
var city = writable();
var css$e = {
  code: '.circle.svelte-10roc01{height:var(--size);width:var(--size);border-color:var(--color) transparent var(--color) var(--color);border-width:calc(var(--size) / 15);border-style:solid;-o-border-image:initial;border-image:initial;border-radius:50%;-webkit-animation:var(--duration) linear 0s infinite normal none running svelte-10roc01-rotate;animation:var(--duration) linear 0s infinite normal none running svelte-10roc01-rotate}@-webkit-keyframes svelte-10roc01-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes svelte-10roc01-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}',
  map: '{"version":3,"file":"Circle.svelte","sources":["Circle.svelte"],"sourcesContent":["<script>;\\r\\nexport let color = \\"#FF3E00\\";\\r\\nexport let unit = \\"px\\";\\r\\nexport let duration = \\"0.75s\\";\\r\\nexport let size = \\"60\\";\\r\\n</script>\\r\\n\\r\\n<style>\\r\\n  .circle {\\r\\n    height: var(--size);\\r\\n    width: var(--size);\\r\\n    border-color: var(--color) transparent var(--color) var(--color);\\r\\n    border-width: calc(var(--size) / 15);\\r\\n    border-style: solid;\\r\\n    -o-border-image: initial;\\r\\n       border-image: initial;\\r\\n    border-radius: 50%;\\r\\n    -webkit-animation: var(--duration) linear 0s infinite normal none running rotate;\\r\\n            animation: var(--duration) linear 0s infinite normal none running rotate;\\r\\n  }\\r\\n  @-webkit-keyframes rotate {\\r\\n    0% {\\r\\n      transform: rotate(0);\\r\\n    }\\r\\n    100% {\\r\\n      transform: rotate(360deg);\\r\\n    }\\r\\n  }\\r\\n  @keyframes rotate {\\r\\n    0% {\\r\\n      transform: rotate(0);\\r\\n    }\\r\\n    100% {\\r\\n      transform: rotate(360deg);\\r\\n    }\\r\\n  }</style>\\r\\n\\r\\n<div\\r\\n  class=\\"circle\\"\\r\\n  style=\\"--size: {size}{unit}; --color: {color}; --duration: {duration}\\" />\\r\\n"],"names":[],"mappings":"AAQE,OAAO,eAAC,CAAC,AACP,MAAM,CAAE,IAAI,MAAM,CAAC,CACnB,KAAK,CAAE,IAAI,MAAM,CAAC,CAClB,YAAY,CAAE,IAAI,OAAO,CAAC,CAAC,WAAW,CAAC,IAAI,OAAO,CAAC,CAAC,IAAI,OAAO,CAAC,CAChE,YAAY,CAAE,KAAK,IAAI,MAAM,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CACpC,YAAY,CAAE,KAAK,CACnB,eAAe,CAAE,OAAO,CACrB,YAAY,CAAE,OAAO,CACxB,aAAa,CAAE,GAAG,CAClB,iBAAiB,CAAE,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAAM,CACxE,SAAS,CAAE,IAAI,UAAU,CAAC,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,MAAM,CAAC,IAAI,CAAC,OAAO,CAAC,qBAC5E,CAAC,AACD,mBAAmB,qBAAO,CAAC,AACzB,EAAE,AAAC,CAAC,AACF,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AACD,IAAI,AAAC,CAAC,AACJ,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AACH,CAAC,AACD,WAAW,qBAAO,CAAC,AACjB,EAAE,AAAC,CAAC,AACF,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AACD,IAAI,AAAC,CAAC,AACJ,SAAS,CAAE,OAAO,MAAM,CAAC,AAC3B,CAAC,AACH,CAAC"}',
};
var Circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = '#FF3E00' } = $$props;
  let { unit = 'px' } = $$props;
  let { duration = '0.75s' } = $$props;
  let { size = '60' } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$e);
  return `<div class="${'circle svelte-10roc01'}" style="${
    '--size: ' +
    escape(size) +
    escape(unit) +
    '; --color: ' +
    escape(color) +
    '; --duration: ' +
    escape(duration)
  }"></div>`;
});
var css$d = {
  code: '.Spinner.svelte-171z6qi{display:flex;justify-content:center;align-items:center;flex:1 0}.inline.svelte-171z6qi{display:inline-flex}',
  map: `{"version":3,"file":"Spinner.svelte","sources":["Spinner.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Circle } from 'svelte-loading-spinners';\\nexport let color = '#333';\\nexport let size = 1;\\nexport let unit = 'rem';\\nexport let inline = false;\\n<\/script>\\n\\n<div class=\\"Spinner\\" class:inline>\\n  <Circle {color} {size} {unit} />\\n</div>\\n\\n<style lang=\\"scss\\">.Spinner {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  flex: 1 0;\\n}\\n\\n.inline {\\n  display: inline-flex;\\n}</style>\\n"],"names":[],"mappings":"AAWmB,QAAQ,eAAC,CAAC,AAC3B,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,IAAI,CAAE,CAAC,CAAC,CAAC,AACX,CAAC,AAED,OAAO,eAAC,CAAC,AACP,OAAO,CAAE,WAAW,AACtB,CAAC"}`,
};
var Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = '#333' } = $$props;
  let { size = 1 } = $$props;
  let { unit = 'rem' } = $$props;
  let { inline = false } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.unit === void 0 && $$bindings.unit && unit !== void 0)
    $$bindings.unit(unit);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  $$result.css.add(css$d);
  return `<div class="${['Spinner svelte-171z6qi', inline ? 'inline' : '']
    .join(' ')
    .trim()}">${validate_component(Circle, 'Circle').$$render(
    $$result,
    { color, size, unit },
    {},
    {},
  )}
</div>`;
});
var css$c = {
  code: '.svelte-9r2f5t.svelte-9r2f5t{color:white}.Search.svelte-9r2f5t.svelte-9r2f5t{border-radius:1rem;overflow:hidden;margin:2rem auto;max-width:75%;width:50rem;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content}.searchbar.svelte-9r2f5t.svelte-9r2f5t{display:flex;background:#444;color:white;align-items:center;border-color:white}.searchbar.svelte-9r2f5t .Icon{margin:0 1rem;font-size:1.3rem}.searchbar.svelte-9r2f5t.svelte-9r2f5t:focus-within{background:#333}.searchbar.svelte-9r2f5t .svelte-9r2f5t{display:flex;justify-content:center;align-items:center}.searchbar.svelte-9r2f5t .reset.svelte-9r2f5t .Icon{cursor:pointer}input.svelte-9r2f5t.svelte-9r2f5t{flex:1 0;padding:1rem;padding-left:0;outline:none;font-size:2rem;background:transparent;border:none;border-bottom:1px solid transparent}input.svelte-9r2f5t.svelte-9r2f5t::-moz-placeholder{color:#777}input.svelte-9r2f5t.svelte-9r2f5t:-ms-input-placeholder{color:#777}input.svelte-9r2f5t.svelte-9r2f5t::placeholder{color:#777}@media(max-width: 480px){input.svelte-9r2f5t.svelte-9r2f5t{font-size:1rem}}',
  map: `{"version":3,"file":"Search.svelte","sources":["Search.svelte"],"sourcesContent":["<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport city from '@stores/city';\\nimport Icon from '$lib/Icon.svelte';\\nimport Suggestions from './Suggestions.svelte';\\nimport { getCities } from '@api';\\nimport { createEventDispatcher } from 'svelte';\\nconst dispatch = createEventDispatcher();\\nlet selected = undefined;\\nlet citiesPromise = null;\\nlet previousCities;\\nlet value = '';\\n$: if (selected) {\\n    value = selected.nom;\\n}\\nfunction select(event) {\\n    dispatch('select', {\\n        city: event.detail.city || city\\n    });\\n}\\nfunction reset() {\\n    value = '';\\n    citiesPromise = null;\\n}\\nfunction handleInput(e) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        const target = e.target;\\n        const text = target.value;\\n        citiesPromise = getCities(text);\\n    });\\n}\\n<\/script>\\n\\n<div class=\\"Search\\">\\n  <div class=\\"searchbar\\">\\n    <Icon id=\\"search\\" />\\n    <input\\n      bind:value\\n      on:input={handleInput}\\n      placeholder=\\"Entrez le nom d'une commune\\"\\n    />\\n    {#if value}\\n      <span class=\\"reset\\" on:click={reset}>\\n        <Icon id=\\"x\\" />\\n      </span>\\n    {/if}\\n  </div>\\n  {#if citiesPromise}\\n    {#await citiesPromise}\\n      <Suggestions \\n        suggestions={previousCities}\\n        on:enterPress={select} \\n        on:click={select} />\\n    {:then cities}\\n      <Suggestions \\n        suggestions={cities} \\n        on:enterPress={select} \\n        on:click={select} />\\n    {/await}\\n  {/if}\\n</div>\\n\\n<style lang=\\"scss\\">* {\\n  color: white;\\n}\\n\\n.Search {\\n  border-radius: 1rem;\\n  overflow: hidden;\\n  margin: 2rem auto;\\n  max-width: 75%;\\n  width: 50rem;\\n  height: -webkit-fit-content;\\n  height: -moz-fit-content;\\n  height: fit-content;\\n}\\n\\n.searchbar {\\n  display: flex;\\n  background: #444;\\n  color: white;\\n  align-items: center;\\n  border-color: white;\\n}\\n.searchbar :global(.Icon) {\\n  margin: 0 1rem;\\n  font-size: 1.3rem;\\n}\\n.searchbar:focus-within {\\n  background: #333;\\n}\\n.searchbar * {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n}\\n.searchbar .reset :global(.Icon) {\\n  cursor: pointer;\\n}\\n\\ninput {\\n  flex: 1 0;\\n  padding: 1rem;\\n  padding-left: 0;\\n  outline: none;\\n  font-size: 2rem;\\n  background: transparent;\\n  border: none;\\n  border-bottom: 1px solid transparent;\\n}\\ninput::-moz-placeholder {\\n  color: #777;\\n}\\ninput:-ms-input-placeholder {\\n  color: #777;\\n}\\ninput::placeholder {\\n  color: #777;\\n}\\n\\n@media (max-width: 480px) {\\n  input {\\n    font-size: 1rem;\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAqEmB,4BAAE,CAAC,AACpB,KAAK,CAAE,KAAK,AACd,CAAC,AAED,OAAO,4BAAC,CAAC,AACP,aAAa,CAAE,IAAI,CACnB,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,IAAI,CAAC,IAAI,CACjB,SAAS,CAAE,GAAG,CACd,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,mBAAmB,CAC3B,MAAM,CAAE,gBAAgB,CACxB,MAAM,CAAE,WAAW,AACrB,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,KAAK,CACZ,WAAW,CAAE,MAAM,CACnB,YAAY,CAAE,KAAK,AACrB,CAAC,AACD,wBAAU,CAAC,AAAQ,KAAK,AAAE,CAAC,AACzB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,sCAAU,aAAa,AAAC,CAAC,AACvB,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,wBAAU,CAAC,cAAE,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,AACrB,CAAC,AACD,wBAAU,CAAC,oBAAM,CAAC,AAAQ,KAAK,AAAE,CAAC,AAChC,MAAM,CAAE,OAAO,AACjB,CAAC,AAED,KAAK,4BAAC,CAAC,AACL,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,YAAY,CAAE,CAAC,CACf,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,WAAW,CACvB,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,WAAW,AACtC,CAAC,AACD,iCAAK,kBAAkB,AAAC,CAAC,AACvB,KAAK,CAAE,IAAI,AACb,CAAC,AACD,iCAAK,sBAAsB,AAAC,CAAC,AAC3B,KAAK,CAAE,IAAI,AACb,CAAC,AACD,iCAAK,aAAa,AAAC,CAAC,AAClB,KAAK,CAAE,IAAI,AACb,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,KAAK,4BAAC,CAAC,AACL,SAAS,CAAE,IAAI,AACjB,CAAC,AACH,CAAC"}`,
};
var Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  (function (thisArg, _arguments, P, generator) {
    function adopt(value2) {
      return value2 instanceof P
        ? value2
        : new P(function (resolve2) {
            resolve2(value2);
          });
    }
    return new (P || (P = Promise))(function (resolve2, reject) {
      function fulfilled(value2) {
        try {
          step(generator.next(value2));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value2) {
        try {
          step(generator['throw'](value2));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve2(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  createEventDispatcher();
  let value = '';
  $$result.css.add(css$c);
  return `<div class="${'Search svelte-9r2f5t'}"><div class="${'searchbar svelte-9r2f5t'}">${validate_component(
    Icon,
    'Icon',
  ).$$render($$result, { id: 'search' }, {}, {})}
    <input placeholder="${"Entrez le nom d'une commune"}" class="${'svelte-9r2f5t'}"${add_attribute(
    'value',
    value,
    0,
  )}>
    ${``}</div>
  ${``}
</div>`;
});
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
var goto = guard('goto');
var css$b = {
  code: 'main.svelte-14ev131{flex:1 0;display:flex;padding-top:10%}',
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script lang=\\"ts\\">import 'svelte';\\nimport '@stores/city';\\nimport Search from './_components/Search.svelte';\\nimport { goto } from '$app/navigation';\\nfunction handleSearch(event) {\\n    const { nom, code } = event.detail.city;\\n    goto(\`/budgets?name=\${nom}&insee=\${code}\`);\\n}\\n<\/script>\\n\\n<svelte:head>\\n  <title>Livres ouverts</title>\\n</svelte:head>\\n\\n<main>\\n  <Search on:select={handleSearch} />\\n</main>\\n\\n<style lang=\\"scss\\">main {\\n  flex: 1 0;\\n  display: flex;\\n  padding-top: 10%;\\n}</style>\\n"],"names":[],"mappings":"AAkBmB,IAAI,eAAC,CAAC,AACvB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,GAAG,AAClB,CAAC"}`,
};
var Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$b);
  return `${
    (($$result.head += `${
      (($$result.title = `<title>Livres ouverts</title>`), '')
    }`),
    '')
  }

<main class="${'svelte-14ev131'}">${validate_component(
    Search,
    'Search',
  ).$$render($$result, {}, {}, {})}
</main>`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  default: Home,
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Home, 'Home').$$render($$result, {}, {}, {})}`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  default: Routes,
});
var css$a = {
  code: 'li.siret.selected.svelte-1ws0yk7.svelte-1ws0yk7{pointer-events:none;cursor:default}.Labels.svelte-1ws0yk7.svelte-1ws0yk7{position:relative;display:flex;flex-flow:column;width:15rem;margin:0}li.siren.svelte-1ws0yk7.svelte-1ws0yk7{border-top:1px solid rgba(255, 255, 255, 0.1);margin-bottom:0.5rem}li.siren.svelte-1ws0yk7.svelte-1ws0yk7:first-of-type{border:none}.siret.svelte-1ws0yk7.svelte-1ws0yk7{text-transform:capitalize;font-size:1rem;text-align:right;padding:0.25rem 0}.siret.svelte-1ws0yk7>div.svelte-1ws0yk7{opacity:0.2;cursor:pointer}.siret.svelte-1ws0yk7>div.svelte-1ws0yk7:hover{opacity:0.7}.siret.svelte-1ws0yk7>div:hover .info.svelte-1ws0yk7{opacity:0.4}.siret.svelte-1ws0yk7>div:hover .siren.svelte-1ws0yk7{opacity:1}.siret.selected.svelte-1ws0yk7>div.svelte-1ws0yk7{opacity:1;color:cornflowerblue}.siret.selected.svelte-1ws0yk7>div .info.svelte-1ws0yk7{opacity:0.4}.siret.selected.svelte-1ws0yk7>div .siren.svelte-1ws0yk7{opacity:1}.siret.svelte-1ws0yk7 .info.svelte-1ws0yk7{opacity:0.6;font-size:0.7rem}.siret.svelte-1ws0yk7:not(.main) .siren.svelte-1ws0yk7{opacity:0}.loading.svelte-1ws0yk7.svelte-1ws0yk7{position:absolute;top:0;left:0}',
  map: `{"version":3,"file":"Labels.svelte","sources":["Labels.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Spinner from '$lib/Spinner.svelte';\\nexport let labels;\\nexport let select;\\nexport let selected;\\nexport let loadingP;\\nconst defaultLabel = 'commune';\\n$: sirens = [...new Set(labels.map(({ siren }) => siren))];\\n<\/script>\\n\\n<ul class=\\"Labels\\">\\n  {#await loadingP}\\n    <div class=\\"loading\\">\\n      <Spinner color=\\"#999\\" />\\n    </div>\\n  {/await}\\n  {#each sirens as siren}\\n    <li class=\\"siren\\">\\n      <ul>\\n        {#each labels.filter(l => l.siren === siren) as { siret, siren, etabl, label }, i}\\n          <li\\n            class=\\"siret\\"\\n            class:selected={selected === siret}\\n            class:main={i === 0}\\n          >\\n            <div on:click={() => select(siret)}>\\n              <div class=\\"info\\">\\n                <span class=\\"siren\\">{siren}</span>\\n                <span class=\\"etabl\\">{etabl}</span>\\n              </div>\\n              <div class=\\"label\\">{label || defaultLabel}</div>\\n            </div>\\n          </li>\\n        {/each}\\n      </ul>\\n    </li>\\n  {/each}\\n</ul>\\n\\n<style lang=\\"scss\\">li.siret.selected {\\n  pointer-events: none;\\n  cursor: default;\\n}\\n\\n.Labels {\\n  position: relative;\\n  display: flex;\\n  flex-flow: column;\\n  width: 15rem;\\n  margin: 0;\\n}\\n\\nli.siren {\\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\\n  margin-bottom: 0.5rem;\\n}\\nli.siren:first-of-type {\\n  border: none;\\n}\\n\\n.siret {\\n  text-transform: capitalize;\\n  font-size: 1rem;\\n  text-align: right;\\n  padding: 0.25rem 0;\\n}\\n.siret > div {\\n  opacity: 0.2;\\n  cursor: pointer;\\n}\\n.siret > div:hover {\\n  opacity: 0.7;\\n}\\n.siret > div:hover .info {\\n  opacity: 0.4;\\n}\\n.siret > div:hover .siren {\\n  opacity: 1;\\n}\\n.siret.selected > div {\\n  opacity: 1;\\n  color: cornflowerblue;\\n}\\n.siret.selected > div .info {\\n  opacity: 0.4;\\n}\\n.siret.selected > div .siren {\\n  opacity: 1;\\n}\\n.siret .info {\\n  opacity: 0.6;\\n  font-size: 0.7rem;\\n}\\n.siret:not(.main) .siren {\\n  opacity: 0;\\n}\\n\\n.loading {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n}</style>\\n"],"names":[],"mappings":"AAsCmB,EAAE,MAAM,SAAS,8BAAC,CAAC,AACpC,cAAc,CAAE,IAAI,CACpB,MAAM,CAAE,OAAO,AACjB,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,CAAC,AACX,CAAC,AAED,EAAE,MAAM,8BAAC,CAAC,AACR,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC9C,aAAa,CAAE,MAAM,AACvB,CAAC,AACD,EAAE,oCAAM,cAAc,AAAC,CAAC,AACtB,MAAM,CAAE,IAAI,AACd,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,cAAc,CAAE,UAAU,CAC1B,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,OAAO,CAAC,CAAC,AACpB,CAAC,AACD,qBAAM,CAAG,GAAG,eAAC,CAAC,AACZ,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,qBAAM,CAAG,kBAAG,MAAM,AAAC,CAAC,AAClB,OAAO,CAAE,GAAG,AACd,CAAC,AACD,qBAAM,CAAG,GAAG,MAAM,CAAC,KAAK,eAAC,CAAC,AACxB,OAAO,CAAE,GAAG,AACd,CAAC,AACD,qBAAM,CAAG,GAAG,MAAM,CAAC,MAAM,eAAC,CAAC,AACzB,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,MAAM,wBAAS,CAAG,GAAG,eAAC,CAAC,AACrB,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,cAAc,AACvB,CAAC,AACD,MAAM,wBAAS,CAAG,GAAG,CAAC,KAAK,eAAC,CAAC,AAC3B,OAAO,CAAE,GAAG,AACd,CAAC,AACD,MAAM,wBAAS,CAAG,GAAG,CAAC,MAAM,eAAC,CAAC,AAC5B,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,qBAAM,CAAC,KAAK,eAAC,CAAC,AACZ,OAAO,CAAE,GAAG,CACZ,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,qBAAM,KAAK,KAAK,CAAC,CAAC,MAAM,eAAC,CAAC,AACxB,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,QAAQ,8BAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,AACT,CAAC"}`,
};
var defaultLabel = 'commune';
var Labels = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let sirens;
  let { labels } = $$props;
  let { select } = $$props;
  let { selected } = $$props;
  let { loadingP } = $$props;
  if ($$props.labels === void 0 && $$bindings.labels && labels !== void 0)
    $$bindings.labels(labels);
  if ($$props.select === void 0 && $$bindings.select && select !== void 0)
    $$bindings.select(select);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.loadingP === void 0 && $$bindings.loadingP && loadingP !== void 0)
    $$bindings.loadingP(loadingP);
  $$result.css.add(css$a);
  sirens = [...new Set(labels.map(({ siren }) => siren))];
  return `<ul class="${'Labels svelte-1ws0yk7'}">${(function (__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
    <div class="${'loading svelte-1ws0yk7'}">${validate_component(
        Spinner,
        'Spinner',
      ).$$render($$result, { color: '#999' }, {}, {})}</div>
  `;
    }
    return (function () {
      return ``;
    })();
  })(loadingP)}
  ${each(
    sirens,
    siren => `<li class="${'siren svelte-1ws0yk7'}"><ul>${each(
      labels.filter(l => l.siren === siren),
      ({ siret, siren: siren2, etabl, label }, i) => `<li class="${[
        'siret svelte-1ws0yk7',
        (selected === siret ? 'selected' : '') + ' ' + (i === 0 ? 'main' : ''),
      ]
        .join(' ')
        .trim()}"><div class="${'svelte-1ws0yk7'}"><div class="${'info svelte-1ws0yk7'}"><span class="${'siren svelte-1ws0yk7'}">${escape(
        siren2,
      )}</span>
                <span class="${'etabl'}">${escape(etabl)}</span></div>
              <div class="${'label'}">${escape(
        label || defaultLabel,
      )}</div></div>
          </li>`,
    )}</ul>
    </li>`,
  )}
</ul>`;
});
var css$9 = {
  code: '.Year.svelte-15dsk11.svelte-15dsk11{flex:1 0;width:5rem;display:flex;flex-flow:column;justify-content:flex-end;align-items:stretch;margin:0 0.5rem;font-size:0.8rem;color:#333;opacity:0.5;cursor:pointer}.Year.svelte-15dsk11 .Icon{font-size:2em}.Year.svelte-15dsk11:hover:not(.unavailable) h3.svelte-15dsk11{color:cornflowerblue}.Year.selected.svelte-15dsk11.svelte-15dsk11{opacity:1}.Year.selected.svelte-15dsk11 h3.svelte-15dsk11{color:cornflowerblue}.Year.svelte-15dsk11.svelte-15dsk11:first-child{margin-left:0}.Year.svelte-15dsk11.svelte-15dsk11:last-child{margin-right:0}h3.svelte-15dsk11.svelte-15dsk11{position:relative;font-size:1rem;margin-top:1rem;text-align:center}h3.svelte-15dsk11 .Spinner{position:absolute;margin-left:0.3rem}.unavailable.svelte-15dsk11.svelte-15dsk11{opacity:0.1;cursor:default}.pending.svelte-15dsk11.svelte-15dsk11{opacity:0.2}',
  map: `{"version":3,"file":"Year.svelte","sources":["Year.svelte"],"sourcesContent":["<script lang=\\"ts\\">// import { formatValue } from '@utils';\\n// import Icon from '$lib/Icon.svelte';\\nimport Spinner from '$lib/Spinner.svelte';\\nexport let year;\\nexport let valueP = undefined;\\nexport let maxP;\\nexport let select = undefined;\\nexport let selected = false;\\nlet height;\\nlet pending = true;\\nlet unavailable = false;\\n$: valueP.then(v => {\\n    pending = false;\\n    unavailable = !v;\\n});\\n$: Promise.all([valueP, maxP]).then(([v, max]) => {\\n    if (v) {\\n        setTimeout(() => (height = v / max + '%'), 50);\\n    }\\n});\\n<\/script>\\n\\n<li\\n  class=\\"Year\\"\\n  class:pending\\n  class:unavailable\\n  class:selected\\n  on:click={!unavailable ? select : undefined}\\n>\\n  <!-- <div class=\\"info\\">\\n    {#await valueP then value}\\n      {#if value}\\n        <div class=\\"value\\" style={\`height: \${height};\`}>\\n          {formatValue(value)}\\n        </div>\\n      {:else}\\n        <Icon id=\\"x\\" />\\n      {/if}\\n    {/await}\\n  </div> -->\\n  <h3>{year}{#await valueP}<Spinner inline />{/await}</h3>\\n</li>\\n\\n<style lang=\\"scss\\">.Year {\\n  flex: 1 0;\\n  width: 5rem;\\n  display: flex;\\n  flex-flow: column;\\n  justify-content: flex-end;\\n  align-items: stretch;\\n  margin: 0 0.5rem;\\n  font-size: 0.8rem;\\n  color: #333;\\n  opacity: 0.5;\\n  cursor: pointer;\\n}\\n.Year :global(.Icon) {\\n  font-size: 2em;\\n}\\n.Year:hover:not(.unavailable) .value {\\n  background: cornflowerblue;\\n}\\n.Year:hover:not(.unavailable) h3 {\\n  color: cornflowerblue;\\n}\\n.Year.selected {\\n  opacity: 1;\\n}\\n.Year.selected .value {\\n  background: cornflowerblue;\\n}\\n.Year.selected h3 {\\n  color: cornflowerblue;\\n}\\n.Year:first-child {\\n  margin-left: 0;\\n}\\n.Year:last-child {\\n  margin-right: 0;\\n}\\n\\n.value {\\n  display: flex;\\n  padding: 3px;\\n  height: 1.5rem;\\n  flex-flow: column;\\n  align-items: center;\\n  background: #666;\\n  border-radius: 8px;\\n  transition: height 0.5s ease-in-out;\\n}\\n\\nh3 {\\n  position: relative;\\n  font-size: 1rem;\\n  margin-top: 1rem;\\n  text-align: center;\\n}\\nh3 :global(.Spinner) {\\n  position: absolute;\\n  margin-left: 0.3rem;\\n}\\n\\n.info {\\n  display: flex;\\n  flex-flow: column;\\n  align-items: stretch;\\n  flex: 1 0;\\n  justify-content: flex-end;\\n}\\n\\n.unavailable {\\n  opacity: 0.1;\\n  cursor: default;\\n}\\n\\n.pending {\\n  opacity: 0.2;\\n}\\n\\n.pending div {\\n  padding: 0;\\n}\\n\\n.pending .info,\\n.unavailable .info {\\n  align-items: center;\\n  justify-content: center;\\n}</style>\\n"],"names":[],"mappings":"AA2CmB,KAAK,8BAAC,CAAC,AACxB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,eAAe,CAAE,QAAQ,CACzB,WAAW,CAAE,OAAO,CACpB,MAAM,CAAE,CAAC,CAAC,MAAM,CAChB,SAAS,CAAE,MAAM,CACjB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,oBAAK,CAAC,AAAQ,KAAK,AAAE,CAAC,AACpB,SAAS,CAAE,GAAG,AAChB,CAAC,AAID,oBAAK,MAAM,KAAK,YAAY,CAAC,CAAC,EAAE,eAAC,CAAC,AAChC,KAAK,CAAE,cAAc,AACvB,CAAC,AACD,KAAK,SAAS,8BAAC,CAAC,AACd,OAAO,CAAE,CAAC,AACZ,CAAC,AAID,KAAK,wBAAS,CAAC,EAAE,eAAC,CAAC,AACjB,KAAK,CAAE,cAAc,AACvB,CAAC,AACD,mCAAK,YAAY,AAAC,CAAC,AACjB,WAAW,CAAE,CAAC,AAChB,CAAC,AACD,mCAAK,WAAW,AAAC,CAAC,AAChB,YAAY,CAAE,CAAC,AACjB,CAAC,AAaD,EAAE,8BAAC,CAAC,AACF,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,iBAAE,CAAC,AAAQ,QAAQ,AAAE,CAAC,AACpB,QAAQ,CAAE,QAAQ,CAClB,WAAW,CAAE,MAAM,AACrB,CAAC,AAUD,YAAY,8BAAC,CAAC,AACZ,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,OAAO,AACjB,CAAC,AAED,QAAQ,8BAAC,CAAC,AACR,OAAO,CAAE,GAAG,AACd,CAAC"}`,
};
var Year = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { year } = $$props;
  let { valueP = void 0 } = $$props;
  let { maxP } = $$props;
  let { select = void 0 } = $$props;
  let { selected = false } = $$props;
  let pending = true;
  let unavailable = false;
  if ($$props.year === void 0 && $$bindings.year && year !== void 0)
    $$bindings.year(year);
  if ($$props.valueP === void 0 && $$bindings.valueP && valueP !== void 0)
    $$bindings.valueP(valueP);
  if ($$props.maxP === void 0 && $$bindings.maxP && maxP !== void 0)
    $$bindings.maxP(maxP);
  if ($$props.select === void 0 && $$bindings.select && select !== void 0)
    $$bindings.select(select);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  $$result.css.add(css$9);
  {
    valueP.then(v => {
      pending = false;
      unavailable = !v;
    });
  }
  {
    Promise.all([valueP, maxP]).then(([v, max]) => {
      if (v) {
        setTimeout(() => v / max + '%', 50);
      }
    });
  }
  return `<li class="${[
    'Year svelte-15dsk11',
    (pending ? 'pending' : '') +
      ' ' +
      (unavailable ? 'unavailable' : '') +
      ' ' +
      (selected ? 'selected' : ''),
  ]
    .join(' ')
    .trim()}">
  <h3 class="${'svelte-15dsk11'}">${escape(year)}${(function (__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `${validate_component(Spinner, 'Spinner').$$render(
        $$result,
        { inline: true },
        {},
        {},
      )}`;
    }
    return (function () {
      return ``;
    })();
  })(valueP)}</h3>
</li>`;
});
var css$8 = {
  code: '.Years.svelte-630x41{display:flex;justify-content:space-between;align-items:stretch;padding:1rem 2rem;margin:0;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content}',
  map: `{"version":3,"file":"Years.svelte","sources":["Years.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Year from './Year.svelte';\\nexport let valuePs;\\nexport let years;\\nexport let select;\\nexport let selected;\\n$: maxP = Promise.all(valuePs).then(values => {\\n    const v = values.filter(v => v);\\n    return Math.max(...v);\\n});\\n<\/script>\\n\\n<ul class=\\"Years\\">\\n  {#each years as year, i}\\n    <Year\\n      {year}\\n      valueP={valuePs[i]}\\n      {maxP}\\n      selected={year === selected}\\n      select={() => select(year)}\\n    />\\n  {/each}\\n</ul>\\n\\n<style lang=\\"scss\\">.Years {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: stretch;\\n  padding: 1rem 2rem;\\n  margin: 0;\\n  width: -webkit-fit-content;\\n  width: -moz-fit-content;\\n  width: fit-content;\\n}</style>\\n"],"names":[],"mappings":"AAuBmB,MAAM,cAAC,CAAC,AACzB,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,OAAO,CACpB,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,mBAAmB,CAC1B,KAAK,CAAE,gBAAgB,CACvB,KAAK,CAAE,WAAW,AACpB,CAAC"}`,
};
var Years = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let maxP;
  let { valuePs } = $$props;
  let { years: years2 } = $$props;
  let { select } = $$props;
  let { selected } = $$props;
  if ($$props.valuePs === void 0 && $$bindings.valuePs && valuePs !== void 0)
    $$bindings.valuePs(valuePs);
  if ($$props.years === void 0 && $$bindings.years && years2 !== void 0)
    $$bindings.years(years2);
  if ($$props.select === void 0 && $$bindings.select && select !== void 0)
    $$bindings.select(select);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  $$result.css.add(css$8);
  maxP = Promise.all(valuePs).then(values => {
    const v = values.filter(v2 => v2);
    return Math.max(...v);
  });
  return `<ul class="${'Years svelte-630x41'}">${each(
    years2,
    (year, i) =>
      `${validate_component(Year, 'Year').$$render(
        $$result,
        {
          year,
          valueP: valuePs[i],
          maxP,
          selected: year === selected,
          select: () => select(year),
        },
        {},
        {},
      )}`,
  )}
</ul>`;
});
var tree = writable();
var code = writable();
var budget = writable();
var fonction = derived([code, tree], ([$code, $tree]) => {
  if (!$code || !$tree) {
    return void 0;
  }
  return fonctionFromTree($code, $tree);
});
var css$7 = {
  code: '.Csv.svelte-rbsnk7{position:absolute;right:0;font-size:1.7rem;top:0;display:flex;align-items:center}a.svelte-rbsnk7{display:flex;justify-content:center;align-items:center;width:2.2rem;height:2.2rem;border-radius:50%;cursor:pointer}a.svelte-rbsnk7:hover{background:coral}a.svelte-rbsnk7:hover .Icon{color:white}a.svelte-rbsnk7 .Icon{color:#999}',
  map: `{"version":3,"file":"Csv.svelte","sources":["Csv.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { makeCSV } from '@utils';\\nimport Icon from '$lib/Icon.svelte';\\nexport let data;\\n$: csvP = makeCSV(data);\\n<\/script>\\n\\n<div class=\\"Csv\\">\\n  {#await csvP then csv}\\n    <a href={csv.url} download={csv.file}>\\n      <Icon id=\\"download\\" />\\n    </a>\\n  {/await}\\n</div>\\n\\n<style lang=\\"scss\\">.Csv {\\n  position: absolute;\\n  right: 0;\\n  font-size: 1.7rem;\\n  top: 0;\\n  display: flex;\\n  align-items: center;\\n}\\n\\na {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 2.2rem;\\n  height: 2.2rem;\\n  border-radius: 50%;\\n  cursor: pointer;\\n}\\na:hover {\\n  background: coral;\\n}\\na:hover :global(.Icon) {\\n  color: white;\\n}\\na :global(.Icon) {\\n  color: #999;\\n}</style>\\n"],"names":[],"mappings":"AAcmB,IAAI,cAAC,CAAC,AACvB,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,CAAC,CACR,SAAS,CAAE,MAAM,CACjB,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACrB,CAAC,AAED,CAAC,cAAC,CAAC,AACD,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,MAAM,CACb,MAAM,CAAE,MAAM,CACd,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,eAAC,MAAM,AAAC,CAAC,AACP,UAAU,CAAE,KAAK,AACnB,CAAC,AACD,eAAC,MAAM,CAAC,AAAQ,KAAK,AAAE,CAAC,AACtB,KAAK,CAAE,KAAK,AACd,CAAC,AACD,eAAC,CAAC,AAAQ,KAAK,AAAE,CAAC,AAChB,KAAK,CAAE,IAAI,AACb,CAAC"}`,
};
var Csv = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let csvP;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$7);
  csvP = makeCSV(data);
  return `<div class="${'Csv svelte-rbsnk7'}">${(function (__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ``;
    }
    return (function (csv) {
      return `
    <a${add_attribute('href', csv.url, 0)}${add_attribute(
        'download',
        csv.file,
        0,
      )} class="${'svelte-rbsnk7'}">${validate_component(Icon, 'Icon').$$render(
        $$result,
        { id: 'download' },
        {},
        {},
      )}</a>
  `;
    })(__value);
  })(csvP)}
</div>`;
});
var css$6 = {
  code: '.path.svelte-1bsfcru{flex:1 0;display:flex;flex-flow:column-reverse}.steps.svelte-1bsfcru{display:flex;font-size:0.9rem}.step.svelte-1bsfcru:hover{color:coral;cursor:pointer}.step.svelte-1bsfcru .Icon{font-size:1.2em;vertical-align:text-bottom}.current.svelte-1bsfcru{font-size:2rem;line-height:1.8rem}',
  map: `{"version":3,"file":"Path.svelte","sources":["Path.svelte"],"sourcesContent":["<script lang=\\"ts\\">var _a;\\nimport Icon from '$lib/Icon.svelte';\\nexport let steps;\\n$: current = (_a = steps.pop()) === null || _a === void 0 ? void 0 : _a.label;\\n<\/script>\\n\\n<div class=\\"path\\">\\n  {#if current}\\n    <div class=\\"current\\">{current}</div>\\n  {/if}\\n  <div class=\\"steps\\">\\n    {#each steps as { label, select }}\\n      <div class=\\"step\\" on:click={select}>\\n        {label}\\n        <Icon id=\\"chevron-right\\" />\\n      </div>\\n    {/each}\\n  </div>\\n</div>\\n\\n<style lang=\\"scss\\">.path {\\n  flex: 1 0;\\n  display: flex;\\n  flex-flow: column-reverse;\\n}\\n\\n.steps {\\n  display: flex;\\n  font-size: 0.9rem;\\n}\\n\\n.next {\\n  margin: 0 0.5rem;\\n}\\n\\n.step:hover {\\n  color: coral;\\n  cursor: pointer;\\n}\\n.step :global(.Icon) {\\n  font-size: 1.2em;\\n  vertical-align: text-bottom;\\n}\\n\\n.current {\\n  font-size: 2rem;\\n  line-height: 1.8rem;\\n}</style>\\n"],"names":[],"mappings":"AAoBmB,KAAK,eAAC,CAAC,AACxB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,cAAc,AAC3B,CAAC,AAED,MAAM,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,AACnB,CAAC,AAMD,oBAAK,MAAM,AAAC,CAAC,AACX,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,oBAAK,CAAC,AAAQ,KAAK,AAAE,CAAC,AACpB,SAAS,CAAE,KAAK,CAChB,cAAc,CAAE,WAAW,AAC7B,CAAC,AAED,QAAQ,eAAC,CAAC,AACR,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,MAAM,AACrB,CAAC"}`,
};
var Path = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let current;
  var _a;
  let { steps } = $$props;
  if ($$props.steps === void 0 && $$bindings.steps && steps !== void 0)
    $$bindings.steps(steps);
  $$result.css.add(css$6);
  current = (_a = steps.pop()) === null || _a === void 0 ? void 0 : _a.label;
  return `<div class="${'path svelte-1bsfcru'}">${
    current
      ? `<div class="${'current svelte-1bsfcru'}">${escape(current)}</div>`
      : ``
  }
  <div class="${'steps svelte-1bsfcru'}">${each(
    steps,
    ({ label, select }) => `<div class="${'step svelte-1bsfcru'}">${escape(
      label,
    )}
        ${validate_component(Icon, 'Icon').$$render(
          $$result,
          { id: 'chevron-right' },
          {},
          {},
        )}
      </div>`,
  )}</div>
</div>`;
});
var css$5 = {
  code: '.debit-credit.svelte-1505gru.svelte-1505gru{flex:1 0;display:flex;width:100%;align-items:center;justify-content:center;font-size:3rem}.debit.svelte-1505gru.svelte-1505gru,.credit.svelte-1505gru.svelte-1505gru{text-align:center;width:40%;margin:0 1rem}.debit.svelte-1505gru .value.svelte-1505gru,.credit.svelte-1505gru .value.svelte-1505gru{cursor:pointer}.debit.svelte-1505gru .value.svelte-1505gru{background:#467fa6}.credit.svelte-1505gru .value.svelte-1505gru{background:#a64672}.not-hover.svelte-1505gru.svelte-1505gru{opacity:0.4}h4.svelte-1505gru.svelte-1505gru{font-size:1.5rem;margin:1rem}.value-container.svelte-1505gru.svelte-1505gru{display:flex;align-items:center;justify-content:center;height:15rem;width:15rem;font-size:3.5rem;margin:0 auto}.value.svelte-1505gru.svelte-1505gru{display:flex;align-items:center;justify-content:center;padding:1rem;border-radius:50%;background:goldenrod;color:white}',
  map: '{"version":3,"file":"DebitOrCredit.svelte","sources":["DebitOrCredit.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { formatValue, BudgetType } from \'@utils\';\\nexport let credit;\\nexport let debit;\\nexport let select;\\nlet hover;\\n$: max = Math.max(debit, credit);\\n$: makeCustomStyle = (value) => {\\n    const size = value / max;\\n    return `\\n    width:${size * 100}%;\\n    height:${size * 100}%;\\n    font-size: ${size}em;\\n    `;\\n};\\n</script>\\n\\n<div class=\\"debit-credit\\">\\n  <div class=\\"credit\\" on:click={() => select(BudgetType.CREDIT)}>\\n    <div class=\\"value-container\\">\\n      <div\\n        class=\\"value\\"\\n        style={makeCustomStyle(credit)}\\n        class:not-hover={hover && hover !== BudgetType.CREDIT}\\n        on:mouseenter={() => (hover = BudgetType.CREDIT)}\\n        on:mouseleave={() => (hover = undefined)}\\n      >\\n        {formatValue(credit)}\\n      </div>\\n    </div>\\n    <h4>Recettes</h4>\\n  </div>\\n  <div class=\\"debit\\" on:click={() => select(BudgetType.DEBIT)}>\\n    <div class=\\"value-container\\">\\n      <div\\n        class=\\"value\\"\\n        style={makeCustomStyle(debit)}\\n        class:not-hover={hover && hover !== BudgetType.DEBIT}\\n        on:mouseenter={() => (hover = BudgetType.DEBIT)}\\n        on:mouseleave={() => (hover = undefined)}\\n      >\\n        {formatValue(debit)}\\n      </div>\\n    </div>\\n    <h4>D\xE9penses</h4>\\n  </div>\\n</div>\\n\\n<style lang=\\"scss\\">.debit-credit {\\n  flex: 1 0;\\n  display: flex;\\n  width: 100%;\\n  align-items: center;\\n  justify-content: center;\\n  font-size: 3rem;\\n}\\n\\n.debit,\\n.credit {\\n  text-align: center;\\n  width: 40%;\\n  margin: 0 1rem;\\n}\\n.debit .value,\\n.credit .value {\\n  cursor: pointer;\\n}\\n\\n.debit .value {\\n  background: #467fa6;\\n}\\n\\n.credit .value {\\n  background: #a64672;\\n}\\n\\n.not-hover {\\n  opacity: 0.4;\\n}\\n\\nh4 {\\n  font-size: 1.5rem;\\n  margin: 1rem;\\n}\\n\\n.value-container {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  height: 15rem;\\n  width: 15rem;\\n  font-size: 3.5rem;\\n  margin: 0 auto;\\n}\\n\\n.value {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  padding: 1rem;\\n  border-radius: 50%;\\n  background: goldenrod;\\n  color: white;\\n}</style>\\n"],"names":[],"mappings":"AA+CmB,aAAa,8BAAC,CAAC,AAChC,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,IAAI,AACjB,CAAC,AAED,oCAAM,CACN,OAAO,8BAAC,CAAC,AACP,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,CAAC,CAAC,IAAI,AAChB,CAAC,AACD,qBAAM,CAAC,qBAAM,CACb,sBAAO,CAAC,MAAM,eAAC,CAAC,AACd,MAAM,CAAE,OAAO,AACjB,CAAC,AAED,qBAAM,CAAC,MAAM,eAAC,CAAC,AACb,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,sBAAO,CAAC,MAAM,eAAC,CAAC,AACd,UAAU,CAAE,OAAO,AACrB,CAAC,AAED,UAAU,8BAAC,CAAC,AACV,OAAO,CAAE,GAAG,AACd,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,IAAI,AACd,CAAC,AAED,gBAAgB,8BAAC,CAAC,AAChB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,MAAM,CACjB,MAAM,CAAE,CAAC,CAAC,IAAI,AAChB,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,SAAS,CACrB,KAAK,CAAE,KAAK,AACd,CAAC"}',
};
var DebitOrCredit = create_ssr_component(
  ($$result, $$props, $$bindings, slots) => {
    let max;
    let makeCustomStyle;
    let { credit } = $$props;
    let { debit } = $$props;
    let { select } = $$props;
    if ($$props.credit === void 0 && $$bindings.credit && credit !== void 0)
      $$bindings.credit(credit);
    if ($$props.debit === void 0 && $$bindings.debit && debit !== void 0)
      $$bindings.debit(debit);
    if ($$props.select === void 0 && $$bindings.select && select !== void 0)
      $$bindings.select(select);
    $$result.css.add(css$5);
    max = Math.max(debit, credit);
    makeCustomStyle = value => {
      const size = value / max;
      return `
    width:${size * 100}%;
    height:${size * 100}%;
    font-size: ${size}em;
    `;
    };
    return `<div class="${'debit-credit svelte-1505gru'}"><div class="${'credit svelte-1505gru'}"><div class="${'value-container svelte-1505gru'}"><div class="${[
      'value svelte-1505gru',
      '',
    ]
      .join(' ')
      .trim()}"${add_attribute('style', makeCustomStyle(credit), 0)}>${escape(
      formatValue(credit),
    )}</div></div>
    <h4 class="${'svelte-1505gru'}">Recettes</h4></div>
  <div class="${'debit svelte-1505gru'}"><div class="${'value-container svelte-1505gru'}"><div class="${[
      'value svelte-1505gru',
      '',
    ]
      .join(' ')
      .trim()}"${add_attribute('style', makeCustomStyle(debit), 0)}>${escape(
      formatValue(debit),
    )}</div></div>
    <h4 class="${'svelte-1505gru'}">D\xE9penses</h4></div>
</div>`;
  },
);
function formatDecimal(x) {
  return Math.abs((x = Math.round(x))) >= 1e21
    ? x.toLocaleString('en').replace(/,/g, '')
    : x.toString(10);
}
function formatDecimalParts(x, p) {
  if (
    (i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf('e')) < 0
  )
    return null;
  var i,
    coefficient = x.slice(0, i);
  return [
    coefficient.length > 1
      ? coefficient[0] + coefficient.slice(2)
      : coefficient,
    +x.slice(i + 1),
  ];
}
function exponent(x) {
  return (x = formatDecimalParts(Math.abs(x))), x ? x[1] : NaN;
}
function formatGroup(grouping, thousands) {
  return function (value, width) {
    var i = value.length,
      t = [],
      j = 0,
      g = grouping[0],
      length = 0;
    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring((i -= g), i + g));
      if ((length += g + 1) > width) break;
      g = grouping[(j = (j + 1) % grouping.length)];
    }
    return t.reverse().join(thousands);
  };
}
function formatNumerals(numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
}
var re =
  /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error('invalid format: ' + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10],
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? ' ' : specifier.fill + '';
  this.align = specifier.align === void 0 ? '>' : specifier.align + '';
  this.sign = specifier.sign === void 0 ? '-' : specifier.sign + '';
  this.symbol = specifier.symbol === void 0 ? '' : specifier.symbol + '';
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision =
    specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? '' : specifier.type + '';
}
FormatSpecifier.prototype.toString = function () {
  return (
    this.fill +
    this.align +
    this.sign +
    this.symbol +
    (this.zero ? '0' : '') +
    (this.width === void 0 ? '' : Math.max(1, this.width | 0)) +
    (this.comma ? ',' : '') +
    (this.precision === void 0 ? '' : '.' + Math.max(0, this.precision | 0)) +
    (this.trim ? '~' : '') +
    this.type
  );
};
function formatTrim(s2) {
  out: for (var n = s2.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s2[i]) {
      case '.':
        i0 = i1 = i;
        break;
      case '0':
        if (i0 === 0) i0 = i;
        i1 = i;
        break;
      default:
        if (!+s2[i]) break out;
        if (i0 > 0) i0 = 0;
        break;
    }
  }
  return i0 > 0 ? s2.slice(0, i0) + s2.slice(i1 + 1) : s2;
}
var prefixExponent;
function formatPrefixAuto(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + '';
  var coefficient = d[0],
    exponent2 = d[1],
    i =
      exponent2 -
      (prefixExponent =
        Math.max(-8, Math.min(8, Math.floor(exponent2 / 3))) * 3) +
      1,
    n = coefficient.length;
  return i === n
    ? coefficient
    : i > n
    ? coefficient + new Array(i - n + 1).join('0')
    : i > 0
    ? coefficient.slice(0, i) + '.' + coefficient.slice(i)
    : '0.' +
      new Array(1 - i).join('0') +
      formatDecimalParts(x, Math.max(0, p + i - 1))[0];
}
function formatRounded(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d) return x + '';
  var coefficient = d[0],
    exponent2 = d[1];
  return exponent2 < 0
    ? '0.' + new Array(-exponent2).join('0') + coefficient
    : coefficient.length > exponent2 + 1
    ? coefficient.slice(0, exponent2 + 1) +
      '.' +
      coefficient.slice(exponent2 + 1)
    : coefficient + new Array(exponent2 - coefficient.length + 2).join('0');
}
var formatTypes = {
  '%': (x, p) => (x * 100).toFixed(p),
  b: x => Math.round(x).toString(2),
  c: x => x + '',
  d: formatDecimal,
  e: (x, p) => x.toExponential(p),
  f: (x, p) => x.toFixed(p),
  g: (x, p) => x.toPrecision(p),
  o: x => Math.round(x).toString(8),
  p: (x, p) => formatRounded(x * 100, p),
  r: formatRounded,
  s: formatPrefixAuto,
  X: x => Math.round(x).toString(16).toUpperCase(),
  x: x => Math.round(x).toString(16),
};
function identity(x) {
  return x;
}
var map = Array.prototype.map;
var prefixes = [
  'y',
  'z',
  'a',
  'f',
  'p',
  'n',
  '\xB5',
  'm',
  '',
  'k',
  'M',
  'G',
  'T',
  'P',
  'E',
  'Z',
  'Y',
];
function formatLocale(locale2) {
  var group =
      locale2.grouping === void 0 || locale2.thousands === void 0
        ? identity
        : formatGroup(
            map.call(locale2.grouping, Number),
            locale2.thousands + '',
          ),
    currencyPrefix =
      locale2.currency === void 0 ? '' : locale2.currency[0] + '',
    currencySuffix =
      locale2.currency === void 0 ? '' : locale2.currency[1] + '',
    decimal = locale2.decimal === void 0 ? '.' : locale2.decimal + '',
    numerals =
      locale2.numerals === void 0
        ? identity
        : formatNumerals(map.call(locale2.numerals, String)),
    percent = locale2.percent === void 0 ? '%' : locale2.percent + '',
    minus = locale2.minus === void 0 ? '\u2212' : locale2.minus + '',
    nan = locale2.nan === void 0 ? 'NaN' : locale2.nan + '';
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill,
      align = specifier.align,
      sign = specifier.sign,
      symbol = specifier.symbol,
      zero = specifier.zero,
      width = specifier.width,
      comma = specifier.comma,
      precision = specifier.precision,
      trim = specifier.trim,
      type = specifier.type;
    if (type === 'n') (comma = true), (type = 'g');
    else if (!formatTypes[type])
      precision === void 0 && (precision = 12), (trim = true), (type = 'g');
    if (zero || (fill === '0' && align === '='))
      (zero = true), (fill = '0'), (align = '=');
    var prefix =
        symbol === '$'
          ? currencyPrefix
          : symbol === '#' && /[boxX]/.test(type)
          ? '0' + type.toLowerCase()
          : '',
      suffix =
        symbol === '$' ? currencySuffix : /[%p]/.test(type) ? percent : '';
    var formatType = formatTypes[type],
      maybeSuffix = /[defgprs%]/.test(type);
    precision =
      precision === void 0
        ? 6
        : /[gprs]/.test(type)
        ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));
    function format22(value) {
      var valuePrefix = prefix,
        valueSuffix = suffix,
        i,
        n,
        c;
      if (type === 'c') {
        valueSuffix = formatType(value) + valueSuffix;
        value = '';
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim) value = formatTrim(value);
        if (valueNegative && +value === 0 && sign !== '+')
          valueNegative = false;
        valuePrefix =
          (valueNegative
            ? sign === '('
              ? sign
              : minus
            : sign === '-' || sign === '('
            ? ''
            : sign) + valuePrefix;
        valueSuffix =
          (type === 's' ? prefixes[8 + prefixExponent / 3] : '') +
          valueSuffix +
          (valueNegative && sign === '(' ? ')' : '');
        if (maybeSuffix) {
          (i = -1), (n = value.length);
          while (++i < n) {
            if (((c = value.charCodeAt(i)), 48 > c || c > 57)) {
              valueSuffix =
                (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) +
                valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }
      if (comma && !zero) value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length,
        padding =
          length < width ? new Array(width - length + 1).join(fill) : '';
      if (comma && zero)
        (value = group(
          padding + value,
          padding.length ? width - valueSuffix.length : Infinity,
        )),
          (padding = '');
      switch (align) {
        case '<':
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case '=':
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case '^':
          value =
            padding.slice(0, (length = padding.length >> 1)) +
            valuePrefix +
            value +
            valueSuffix +
            padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format22.toString = function () {
      return specifier + '';
    };
    return format22;
  }
  function formatPrefix(specifier, value) {
    var f = newFormat(
        ((specifier = formatSpecifier(specifier)),
        (specifier.type = 'f'),
        specifier),
      ),
      e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
      k = Math.pow(10, -e),
      prefix = prefixes[8 + e / 3];
    return function (value2) {
      return f(k * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix,
  };
}
var locale;
var format2;
defaultLocale({
  thousands: ',',
  grouping: [3],
  currency: ['$', ''],
});
function defaultLocale(definition) {
  locale = formatLocale(definition);
  format2 = locale.format;
  return locale;
}
var css$4 = {
  code: '.bar.svelte-1301dm9.svelte-1301dm9{position:relative;display:flex;align-items:stretch;padding:0.5rem 1rem;margin:0.5rem;height:5rem}.clickable.svelte-1301dm9.svelte-1301dm9:hover{cursor:pointer}.clickable.svelte-1301dm9:hover .background.svelte-1301dm9{background:coral}.labels.svelte-1301dm9.svelte-1301dm9{display:flex;flex-flow:column;justify-content:space-between;width:100%;z-index:1}.labels.svelte-1301dm9 .Icon{font-size:1.3rem;vertical-align:middle}h3.svelte-1301dm9.svelte-1301dm9{font-size:1.1rem}.values.svelte-1301dm9.svelte-1301dm9{display:flex;justify-content:space-between;align-items:baseline}.value.svelte-1301dm9.svelte-1301dm9{font-size:2rem;line-height:1.8rem}.background.svelte-1301dm9.svelte-1301dm9{position:absolute;top:0;left:0;height:100%;background:#ed64a3;border-radius:8px}',
  map: '{"version":3,"file":"Bar.svelte","sources":["Bar.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { format } from \'d3-format\';\\nimport { formatValue } from \'@utils\';\\nimport Icon from \'$lib/Icon.svelte\';\\nexport let value;\\nexport let percentage;\\nexport let width;\\nexport let label;\\nexport let handleClick = undefined;\\n$: clickable = !!handleClick;\\n</script>\\n\\n<div class=\\"bar\\" class:clickable on:click={() => handleClick?.()}>\\n  <div class=\\"labels\\">\\n    <h3>\\n      {label}\\n      {#if clickable}\\n        <Icon id=\\"more-horizontal\\" />\\n      {/if}\\n    </h3>\\n    <div class=\\"values\\">\\n      <span class=\\"value\\">{`${formatValue(value)}`}</span>\\n      <span class=\\"percentage\\">{`${format(\'.0%\')(percentage)}`}</span>\\n    </div>\\n  </div>\\n  <div class=\\"background\\" style={`width: ${width * 100}%`} />\\n</div>\\n\\n<style lang=\\"scss\\">.bar {\\n  position: relative;\\n  display: flex;\\n  align-items: stretch;\\n  padding: 0.5rem 1rem;\\n  margin: 0.5rem;\\n  height: 5rem;\\n}\\n\\n.clickable:hover {\\n  cursor: pointer;\\n}\\n.clickable:hover .background {\\n  background: coral;\\n}\\n\\n.labels {\\n  display: flex;\\n  flex-flow: column;\\n  justify-content: space-between;\\n  width: 100%;\\n  z-index: 1;\\n}\\n.labels :global(.Icon) {\\n  font-size: 1.3rem;\\n  vertical-align: middle;\\n}\\n\\nh3 {\\n  font-size: 1.1rem;\\n}\\n\\n.values {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: baseline;\\n}\\n\\n.value {\\n  font-size: 2rem;\\n  line-height: 1.8rem;\\n}\\n\\n/* .percentage {\\n  font-size: 1.5rem;\\n} */\\n.background {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  height: 100%;\\n  background: #ed64a3;\\n  border-radius: 8px;\\n}</style>\\n"],"names":[],"mappings":"AA2BmB,IAAI,8BAAC,CAAC,AACvB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,OAAO,CACpB,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,MAAM,CAAE,MAAM,CACd,MAAM,CAAE,IAAI,AACd,CAAC,AAED,wCAAU,MAAM,AAAC,CAAC,AAChB,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,yBAAU,MAAM,CAAC,WAAW,eAAC,CAAC,AAC5B,UAAU,CAAE,KAAK,AACnB,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,eAAe,CAAE,aAAa,CAC9B,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,sBAAO,CAAC,AAAQ,KAAK,AAAE,CAAC,AACtB,SAAS,CAAE,MAAM,CACjB,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,EAAE,8BAAC,CAAC,AACF,SAAS,CAAE,MAAM,AACnB,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,QAAQ,AACvB,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,MAAM,AACrB,CAAC,AAKD,WAAW,8BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,OAAO,CACnB,aAAa,CAAE,GAAG,AACpB,CAAC"}',
};
var Bar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let clickable;
  let { value } = $$props;
  let { percentage } = $$props;
  let { width } = $$props;
  let { label } = $$props;
  let { handleClick = void 0 } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if (
    $$props.percentage === void 0 &&
    $$bindings.percentage &&
    percentage !== void 0
  )
    $$bindings.percentage(percentage);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if (
    $$props.handleClick === void 0 &&
    $$bindings.handleClick &&
    handleClick !== void 0
  )
    $$bindings.handleClick(handleClick);
  $$result.css.add(css$4);
  clickable = !!handleClick;
  return `<div class="${['bar svelte-1301dm9', clickable ? 'clickable' : '']
    .join(' ')
    .trim()}"><div class="${'labels svelte-1301dm9'}"><h3 class="${'svelte-1301dm9'}">${escape(
    label,
  )}
      ${
        clickable
          ? `${validate_component(Icon, 'Icon').$$render(
              $$result,
              { id: 'more-horizontal' },
              {},
              {},
            )}`
          : ``
      }</h3>
    <div class="${'values svelte-1301dm9'}"><span class="${'value svelte-1301dm9'}">${escape(
    `${formatValue(value)}`,
  )}</span>
      <span class="${'percentage'}">${escape(
    `${format2('.0%')(percentage)}`,
  )}</span></div></div>
  <div class="${'background svelte-1301dm9'}"${add_attribute(
    'style',
    `width: ${width * 100}%`,
    0,
  )}></div>
</div>`;
});
var css$3 = {
  code: '.chart.svelte-1tuxdri{flex:1 0;display:flex;flex-direction:column;margin-left:2rem;width:70%;max-width:40rem;overflow-y:scroll}',
  map: `{"version":3,"file":"Chart.svelte","sources":["Chart.svelte"],"sourcesContent":["<script lang=\\"ts\\">import Bar from './Bar.svelte';\\nimport { sumBy } from '@utils';\\nexport let values;\\n$: total = sumBy(values, 'value');\\n$: max = Math.max(...values.map(({ value }) => value));\\n<\/script>\\n\\n<div class=\\"chart\\">\\n  {#each values as { label, value, handleClick }}\\n    <Bar\\n      {label}\\n      {value}\\n      percentage={value / total}\\n      width={value / max}\\n      {handleClick}\\n    />\\n  {/each}\\n</div>\\n\\n<style lang=\\"scss\\">.chart {\\n  flex: 1 0;\\n  display: flex;\\n  flex-direction: column;\\n  margin-left: 2rem;\\n  width: 70%;\\n  max-width: 40rem;\\n  overflow-y: scroll;\\n}</style>\\n"],"names":[],"mappings":"AAmBmB,MAAM,eAAC,CAAC,AACzB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,GAAG,CACV,SAAS,CAAE,KAAK,CAChB,UAAU,CAAE,MAAM,AACpB,CAAC"}`,
};
var Chart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let total;
  let max;
  let { values } = $$props;
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  $$result.css.add(css$3);
  total = sumBy(values, 'value');
  max = Math.max(...values.map(({ value }) => value));
  return `<div class="${'chart svelte-1tuxdri'}">${each(
    values,
    ({ label, value, handleClick }) =>
      `${validate_component(Bar, 'Bar').$$render(
        $$result,
        {
          label,
          value,
          percentage: value / total,
          width: value / max,
          handleClick,
        },
        {},
        {},
      )}`,
  )}
</div>`;
});
var css$2 = {
  code: '.summary.svelte-1j7i8np.svelte-1j7i8np{position:relative;flex:1 0;display:flex;flex-flow:column;justify-content:center;align-items:stretch;padding:1rem;width:100%;background:white;overflow:hidden}.summary .path{margin-left:1rem}header.svelte-1j7i8np.svelte-1j7i8np{position:relative;display:flex;align-items:baseline}header.svelte-1j7i8np h3.svelte-1j7i8np{margin-left:0.5rem;font-size:3.5rem}header.svelte-1j7i8np h3.clickable.svelte-1j7i8np:hover{cursor:pointer;color:coral}.values.svelte-1j7i8np.svelte-1j7i8np{flex:1 0;display:flex;flex-flow:column;align-items:center;width:100%;overflow-y:hidden}.values.svelte-1j7i8np .none.svelte-1j7i8np{display:flex;align-items:center;justify-content:center;font-size:1.5rem;text-align:center}.values.svelte-1j7i8np .main.svelte-1j7i8np{font-size:3rem}.values.svelte-1j7i8np .nomen.svelte-1j7i8np{position:absolute;bottom:1rem;right:1rem;font-size:0.9rem;padding:0.2rem;background:grey;color:white;border-radius:4px}',
  map: `{"version":3,"file":"Summary.svelte","sources":["Summary.svelte"],"sourcesContent":["<script lang=\\"ts\\">/*\\n  Le code se basant uniquement sur la notion de fonction,\\n  les op\xE9rations sans fonction n'apparaissent pas dans ce d\xE9tail.\\n\\n  Voir la fonction aggregateData\\n*/\\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { onMount } from 'svelte';\\nimport { city, tree, code, budget, fonction } from '@stores';\\nimport { getNomen } from '@api';\\nimport { typeToLabel, makeFonctionTree as _makeFonctionTree, stepsFromString, fonctionFromTree, aggregateData, formatValue, buildNomen as _buildNomen, nomenByDecl, } from '@utils';\\nimport Spinner from '$lib/Spinner.svelte';\\nimport Csv from './Csv.svelte';\\nimport Path from './Path.svelte';\\nimport DebitOrCredit from './DebitOrCredit.svelte';\\nimport Chart from './Chart.svelte';\\nexport let budgetP;\\nexport let year;\\nlet type = undefined;\\nlet steps;\\nlet makeFonctionTree;\\nlet buildNomen;\\nconst fonctionTreeByNomen = {};\\nonMount(() => {\\n    makeFonctionTree = _makeFonctionTree; // to make sure _makeFonctionTree is not called for ssr\\n    buildNomen = _buildNomen; // to make sure _buildNomen is not called for ssr\\n});\\nfunction selectType(t) {\\n    type = t;\\n    code.set(undefined);\\n}\\nfunction selectCode(c) {\\n    code.set(c);\\n}\\nfunction reset() {\\n    type = undefined;\\n    code.set(undefined);\\n}\\nfunction getFonctionTree(year, code, population) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        let tree = fonctionTreeByNomen[code];\\n        if (!tree) {\\n            const nomenString = yield getNomen(year, code, population);\\n            const nomen = buildNomen === null || buildNomen === void 0 ? void 0 : buildNomen(nomenString);\\n            if (nomen) {\\n                nomenByDecl.set(nomen.declinaison, nomen);\\n            }\\n            tree = makeFonctionTree === null || makeFonctionTree === void 0 ? void 0 : makeFonctionTree(nomenString);\\n            fonctionTreeByNomen[code] = tree;\\n        }\\n        return tree;\\n    });\\n}\\n$: budgetP === null || budgetP === void 0 ? void 0 : budgetP.then((b) => __awaiter(void 0, void 0, void 0, function* () {\\n    if (b) {\\n        const { year, nomen: code } = b;\\n        budget.set(b);\\n        const _tree = yield getFonctionTree(year, code, $city === null || $city === void 0 ? void 0 : $city.population);\\n        const aggTree = _tree && aggregateData(b.records, _tree);\\n        tree.set(aggTree);\\n    }\\n}));\\n$: steps =\\n    $code && $tree\\n        ? stepsFromString($code).map(code => {\\n            const fonction = fonctionFromTree(code, $tree);\\n            const { short, label } = fonction;\\n            return {\\n                label: short || label,\\n                select: () => selectCode(code),\\n            };\\n        })\\n        : [];\\n$: steps = type\\n    ? [{ label: typeToLabel[type], select: () => selectType(type) }, ...steps]\\n    : [];\\n$: fonctions =\\n    $tree &&\\n        Object.values($fonction ? $fonction.subTree : $tree);\\n$: values = fonctions === null || fonctions === void 0 ? void 0 : fonctions.map((f) => ({\\n    label: f.label,\\n    value: f.value[type],\\n    handleClick: f.subTree && (() => selectCode(f.code)),\\n})).sort((a, b) => b.value - a.value);\\n$: infosP = budgetP === null || budgetP === void 0 ? void 0 : budgetP.then(budget => {\\n    if (budget) {\\n        const main = type && ($fonction ? $fonction.value[type] : budget[type]);\\n        return {\\n            debit: budget.obnetdeb,\\n            credit: budget.obnetcre,\\n            nomen: budget.nomen,\\n            main,\\n        };\\n    }\\n});\\n<\/script>\\n\\n<div class=\\"summary\\">\\n  <header>\\n    <h3 class:clickable={steps.length > 0} on:click={reset}>{year}</h3>\\n    {#if $tree}\\n      <Path {steps} />\\n    {/if}\\n    {#await budgetP then budget}\\n      {#if budget}\\n        <Csv data={budget} />\\n      {/if}\\n    {/await}\\n  </header>\\n  <div class=\\"values\\">\\n    {#await infosP}\\n      <Spinner color=\\"#333\\" size={3} />\\n    {:then infos}\\n      {#if !infos}\\n        <div class=\\"none\\">Aucun budget</div>\\n      {:else if !type}\\n        <DebitOrCredit\\n          credit={infos.credit}\\n          debit={infos.debit}\\n          select={selectType}\\n        />\\n      {:else if values}\\n        <div class=\\"main\\">{formatValue(infos.main)}</div>\\n        <Chart {values} />\\n      {/if}\\n      {#if infos}\\n        <div class=\\"nomen\\">{infos.nomen}</div>\\n      {/if}\\n    {/await}\\n  </div>\\n</div>\\n\\n<style lang=\\"scss\\">.summary {\\n  position: relative;\\n  flex: 1 0;\\n  display: flex;\\n  flex-flow: column;\\n  justify-content: center;\\n  align-items: stretch;\\n  padding: 1rem;\\n  width: 100%;\\n  background: white;\\n  overflow: hidden;\\n}\\n\\n:global(.summary .path) {\\n  margin-left: 1rem;\\n}\\n\\nheader {\\n  position: relative;\\n  display: flex;\\n  align-items: baseline;\\n}\\nheader h3 {\\n  margin-left: 0.5rem;\\n  font-size: 3.5rem;\\n}\\nheader h3.clickable:hover {\\n  cursor: pointer;\\n  color: coral;\\n}\\n\\n.values {\\n  flex: 1 0;\\n  display: flex;\\n  flex-flow: column;\\n  align-items: center;\\n  width: 100%;\\n  overflow-y: hidden;\\n}\\n.values .none {\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  font-size: 1.5rem;\\n  text-align: center;\\n}\\n.values .main {\\n  font-size: 3rem;\\n}\\n.values .nomen {\\n  position: absolute;\\n  bottom: 1rem;\\n  right: 1rem;\\n  font-size: 0.9rem;\\n  padding: 0.2rem;\\n  background: grey;\\n  color: white;\\n  border-radius: 4px;\\n}</style>\\n"],"names":[],"mappings":"AA4ImB,QAAQ,8BAAC,CAAC,AAC3B,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,OAAO,CACpB,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CACjB,QAAQ,CAAE,MAAM,AAClB,CAAC,AAEO,cAAc,AAAE,CAAC,AACvB,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,MAAM,8BAAC,CAAC,AACN,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,QAAQ,AACvB,CAAC,AACD,qBAAM,CAAC,EAAE,eAAC,CAAC,AACT,WAAW,CAAE,MAAM,CACnB,SAAS,CAAE,MAAM,AACnB,CAAC,AACD,qBAAM,CAAC,EAAE,yBAAU,MAAM,AAAC,CAAC,AACzB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,KAAK,AACd,CAAC,AAED,OAAO,8BAAC,CAAC,AACP,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,sBAAO,CAAC,KAAK,eAAC,CAAC,AACb,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,SAAS,CAAE,MAAM,CACjB,UAAU,CAAE,MAAM,AACpB,CAAC,AACD,sBAAO,CAAC,KAAK,eAAC,CAAC,AACb,SAAS,CAAE,IAAI,AACjB,CAAC,AACD,sBAAO,CAAC,MAAM,eAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,MAAM,CACf,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,KAAK,CACZ,aAAa,CAAE,GAAG,AACpB,CAAC"}`,
};
var Summary = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let fonctions;
  let values;
  let infosP;
  let $fonction, $$unsubscribe_fonction;
  let $tree, $$unsubscribe_tree;
  let $code, $$unsubscribe_code;
  let $city, $$unsubscribe_city;
  $$unsubscribe_fonction = subscribe(fonction, value => ($fonction = value));
  $$unsubscribe_tree = subscribe(tree, value => ($tree = value));
  $$unsubscribe_code = subscribe(code, value => ($code = value));
  $$unsubscribe_city = subscribe(city, value => ($city = value));
  var __awaiter2 = function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve2) {
            resolve2(value);
          });
    }
    return new (P || (P = Promise))(function (resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve2(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let { budgetP } = $$props;
  let { year } = $$props;
  let type = void 0;
  let steps;
  const fonctionTreeByNomen = {};
  function selectType(t) {
    type = t;
    code.set(void 0);
  }
  function selectCode(c) {
    code.set(c);
  }
  function getFonctionTree(year2, code2, population) {
    return __awaiter2(this, void 0, void 0, function* () {
      let tree2 = fonctionTreeByNomen[code2];
      if (!tree2) {
        yield getNomen(year2, code2, population);
        tree2 = void 0;
        fonctionTreeByNomen[code2] = tree2;
      }
      return tree2;
    });
  }
  if ($$props.budgetP === void 0 && $$bindings.budgetP && budgetP !== void 0)
    $$bindings.budgetP(budgetP);
  if ($$props.year === void 0 && $$bindings.year && year !== void 0)
    $$bindings.year(year);
  $$result.css.add(css$2);
  {
    budgetP === null || budgetP === void 0
      ? void 0
      : budgetP.then(b =>
          __awaiter2(void 0, void 0, void 0, function* () {
            if (b) {
              const { year: year2, nomen: code2 } = b;
              budget.set(b);
              const _tree = yield getFonctionTree(
                year2,
                code2,
                $city === null || $city === void 0 ? void 0 : $city.population,
              );
              const aggTree = _tree && aggregateData(b.records, _tree);
              tree.set(aggTree);
            }
          }),
        );
  }
  steps =
    $code && $tree
      ? stepsFromString($code).map(code2 => {
          const fonction2 = fonctionFromTree(code2, $tree);
          const { short, label } = fonction2;
          return {
            label: short || label,
            select: () => selectCode(code2),
          };
        })
      : [];
  steps = type
    ? [
        {
          label: typeToLabel[type],
          select: () => selectType(type),
        },
        ...steps,
      ]
    : [];
  fonctions = $tree && Object.values($fonction ? $fonction.subTree : $tree);
  values =
    fonctions === null || fonctions === void 0
      ? void 0
      : fonctions
          .map(f => ({
            label: f.label,
            value: f.value[type],
            handleClick: f.subTree && (() => selectCode(f.code)),
          }))
          .sort((a, b) => b.value - a.value);
  infosP =
    budgetP === null || budgetP === void 0
      ? void 0
      : budgetP.then(budget2 => {
          if (budget2) {
            const main =
              type && ($fonction ? $fonction.value[type] : budget2[type]);
            return {
              debit: budget2.obnetdeb,
              credit: budget2.obnetcre,
              nomen: budget2.nomen,
              main,
            };
          }
        });
  $$unsubscribe_fonction();
  $$unsubscribe_tree();
  $$unsubscribe_code();
  $$unsubscribe_city();
  return `<div class="${'summary svelte-1j7i8np'}"><header class="${'svelte-1j7i8np'}"><h3 class="${[
    'svelte-1j7i8np',
    steps.length > 0 ? 'clickable' : '',
  ]
    .join(' ')
    .trim()}">${escape(year)}</h3>
    ${
      $tree
        ? `${validate_component(Path, 'Path').$$render(
            $$result,
            { steps },
            {},
            {},
          )}`
        : ``
    }
    ${(function (__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ``;
      }
      return (function (budget2) {
        return `
      ${
        budget2
          ? `${validate_component(Csv, 'Csv').$$render(
              $$result,
              { data: budget2 },
              {},
              {},
            )}`
          : ``
      }
    `;
      })(__value);
    })(budgetP)}</header>
  <div class="${'values svelte-1j7i8np'}">${(function (__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
      ${validate_component(Spinner, 'Spinner').$$render(
        $$result,
        { color: '#333', size: 3 },
        {},
        {},
      )}
    `;
    }
    return (function (infos) {
      return `
      ${
        !infos
          ? `<div class="${'none svelte-1j7i8np'}">Aucun budget</div>`
          : `${
              !type
                ? `${validate_component(
                    DebitOrCredit,
                    'DebitOrCredit',
                  ).$$render(
                    $$result,
                    {
                      credit: infos.credit,
                      debit: infos.debit,
                      select: selectType,
                    },
                    {},
                    {},
                  )}`
                : `${
                    values
                      ? `<div class="${'main svelte-1j7i8np'}">${escape(
                          formatValue(infos.main),
                        )}</div>
        ${validate_component(Chart, 'Chart').$$render(
          $$result,
          { values },
          {},
          {},
        )}`
                      : ``
                  }`
            }`
      }
      ${
        infos
          ? `<div class="${'nomen svelte-1j7i8np'}">${escape(
              infos.nomen,
            )}</div>`
          : ``
      }
    `;
    })(__value);
  })(infosP)}</div>
</div>`;
});
var css$1 = {
  code: 'header.svelte-1br52vy.svelte-1br52vy{padding:0 0.5rem;min-height:3rem;background:#151515;color:white;position:relative;display:flex;align-items:center;justify-content:space-between}header.svelte-1br52vy .info-container.svelte-1br52vy{flex:1 0;display:flex;flex-direction:column}header.svelte-1br52vy .home.svelte-1br52vy{display:flex;align-items:center;height:100%;font-size:1.5rem;margin-right:1.5rem;color:#444;transition:color 0.3s ease-in-out}header.svelte-1br52vy .home.svelte-1br52vy:hover{color:coral}header.svelte-1br52vy .titles.svelte-1br52vy{display:flex;align-items:baseline}header.svelte-1br52vy h1.svelte-1br52vy{font-size:2rem}header.svelte-1br52vy h2.svelte-1br52vy{font-size:1.2rem;margin-left:1rem;text-transform:capitalize}header.svelte-1br52vy .info.svelte-1br52vy{margin:0;display:flex;align-items:flex-end;opacity:0.3}header.svelte-1br52vy .info span.svelte-1br52vy:first-child{margin-right:3px}header.svelte-1br52vy .info span.svelte-1br52vy:last-child{margin-left:3px}menu.svelte-1br52vy.svelte-1br52vy{margin:0;color:white;background:#333;display:flex;padding:1rem;padding-right:1.5rem}.content.svelte-1br52vy.svelte-1br52vy{flex:1 0;display:flex;flex-flow:row;overflow:hidden}.dataviz.svelte-1br52vy.svelte-1br52vy{flex:1 0;display:flex;flex-flow:column;align-items:center}',
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { fillBudgetBySiret, fillBudgetBySirens } from './cache';\\nimport { getSiretsFromInsee, getCity } from '@api';\\nimport { extractSirens } from '@api/utils/siren';\\nimport { extractSiren } from '@utils/misc';\\nconst start = 2012;\\nconst end = new Date().getFullYear();\\nconst defaultYear = end - 1;\\nconst years = [...Array(end - start + 1).keys()].map(x => x + start);\\nexport function load({ page: { query }, }) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        const name = query.get('name');\\n        const insee = query.get('insee');\\n        const y = query.get('year');\\n        const sirenString = query.get('sirens');\\n        let siret = query.get('siret');\\n        let sirens = sirenString === null || sirenString === void 0 ? void 0 : sirenString.split(',');\\n        const year = parseInt(y) || defaultYear;\\n        if (!siret || !sirens) {\\n            const siretsFromInsee = yield getSiretsFromInsee(name, insee);\\n            sirens = extractSirens(siretsFromInsee);\\n            const sirets = siretsFromInsee\\n                .filter(e => e.etablissementSiege)\\n                .map(e => e.siret)\\n                .sort();\\n            siret = sirets[0];\\n            return {\\n                redirect: makeBudgetUrl({\\n                    name,\\n                    insee,\\n                    siret,\\n                    sirens,\\n                    year,\\n                }),\\n                status: 301,\\n            };\\n        }\\n        const mainSiren = extractSiren(siret);\\n        yield Promise.all(fillBudgetBySirens([mainSiren], [year], name));\\n        return {\\n            props: {\\n                sirens,\\n                currentSiret: siret,\\n                currentYear: year,\\n                insee,\\n                name,\\n            },\\n        };\\n    });\\n}\\n<\/script>\\n\\n<script lang=\\"ts\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nimport { goto } from '$app/navigation';\\nimport city from '@stores/city';\\nimport { makeId, makeBudgetUrl } from '@utils';\\nimport Icon from '$lib/Icon.svelte';\\nimport Spinner from '$lib/Spinner.svelte';\\nimport Labels from './_components/Labels.svelte';\\nimport Years from './_components/Years.svelte';\\nimport Summary from './_components/Summary.svelte';\\nexport let sirens;\\nexport let currentSiret;\\nexport let currentYear;\\nexport let insee;\\nexport let name;\\n// let type: string;\\n// let fonction: string;\\nlet budgetById = {};\\n$: if (name) {\\n    budgetById = {};\\n}\\nfunction selectSiret(s) {\\n    const url = makeBudgetUrl({\\n        name,\\n        insee,\\n        siret: s,\\n        sirens,\\n        year: currentYear,\\n    });\\n    goto(url);\\n}\\nfunction selectYear(y) {\\n    const url = makeBudgetUrl({\\n        name,\\n        insee,\\n        siret: currentSiret,\\n        sirens,\\n        year: y,\\n    });\\n    goto(url);\\n}\\n$: findSimilarBudget = function (siret) {\\n    return Object.values(budgetById).find(budget => budget && budget.siret === siret);\\n};\\n$: findSimilarLabel = function () {\\n    const id = makeId(currentSiret, currentYear);\\n    const budget = budgetById[id] || findSimilarBudget(currentSiret);\\n    return budget === null || budget === void 0 ? void 0 : budget.label;\\n};\\n$: cityP = $city\\n    ? Promise.resolve($city)\\n    : getCity(insee).then((result) => {\\n        city.set(result);\\n        return result;\\n    });\\n$: budgetPs = fillBudgetBySiret(currentSiret, years, name).map(p => p.then(b => b && (budgetById[b.id] = b)));\\n$: otherBudgetPs = fillBudgetBySirens(sirens, [...years].reverse(), name).map(p => p.then(budgets => budgets.map(b => b && (budgetById[b.id] = b))));\\n$: allPs = [...budgetPs, ...otherBudgetPs];\\n$: loadingP = Promise.all(allPs);\\n$: sirets = [\\n    ...new Set(Object.values(budgetById)\\n        .filter(b => b)\\n        .map((b) => b.siret)),\\n].sort();\\n$: labels = sirets\\n    .map(s => {\\n    const id = makeId(s, currentYear);\\n    const budget = budgetById[id];\\n    return budget || findSimilarBudget(s);\\n})\\n    .filter(l => l);\\n$: valuePs = budgetPs.map(budgetP => budgetP.then(budget => budget && budget.obnetcre));\\n$: yearIndex = years.findIndex(y => y === currentYear);\\n$: budgetP = budgetPs[yearIndex];\\n$: label = findSimilarLabel();\\n<\/script>\\n\\n<svelte:head>\\n  {#await cityP}\\n    <title>{\`Budgets pour \${name}\`}</title>\\n  {:then city}\\n    {#if city}\\n      <title>{\`Budgets pour \${name} (\${city.departement.code})\`}</title>\\n    {/if}\\n  {:catch}\\n    <title>{\`Budgets pour \${name}\`}</title>\\n  {/await}\\n</svelte:head>\\n\\n<header>\\n  <a class=\\"home\\" href=\\"/\\">\\n    <Icon id=\\"book-open\\" />\\n  </a>\\n  <div class=\\"info-container\\">\\n    <div class=\\"titles\\">\\n      <h1>{name}</h1>\\n\\n      {#if label}\\n        <h2>{label}</h2>\\n      {/if}\\n    </div>\\n    <div class=\\"info\\">\\n      {#await cityP}\\n        <Spinner />\\n      {:then city}\\n        {#if city}\\n          <span>{\`Population : \${city.population}\`}</span>\\n          |\\n          <span>{\`\${city.departement.code} - \${city.departement.nom}\`}</span>\\n        {/if}\\n      {:catch error}\\n        <div style=\\"color: red\\">{error}</div>\\n      {/await}\\n    </div>\\n  </div>\\n</header>\\n\\n<div class=\\"content\\">\\n  <menu>\\n    <Labels {labels} {loadingP} selected={currentSiret} select={selectSiret} />\\n  </menu>\\n  <div class=\\"dataviz\\">\\n    <Summary year={currentYear} {budgetP} />\\n    <Years {years} {valuePs} selected={currentYear} select={selectYear} />\\n  </div>\\n</div>\\n\\n<style lang=\\"scss\\">header {\\n  padding: 0 0.5rem;\\n  min-height: 3rem;\\n  background: #151515;\\n  color: white;\\n  position: relative;\\n  display: flex;\\n  align-items: center;\\n  justify-content: space-between;\\n}\\nheader .info-container {\\n  flex: 1 0;\\n  display: flex;\\n  flex-direction: column;\\n}\\nheader .home {\\n  display: flex;\\n  align-items: center;\\n  height: 100%;\\n  font-size: 1.5rem;\\n  margin-right: 1.5rem;\\n  color: #444;\\n  transition: color 0.3s ease-in-out;\\n}\\nheader .home:hover {\\n  color: coral;\\n}\\nheader .titles {\\n  display: flex;\\n  align-items: baseline;\\n}\\nheader h1 {\\n  font-size: 2rem;\\n}\\nheader h2 {\\n  font-size: 1.2rem;\\n  margin-left: 1rem;\\n  text-transform: capitalize;\\n}\\nheader .info {\\n  margin: 0;\\n  display: flex;\\n  align-items: flex-end;\\n  opacity: 0.3;\\n}\\nheader .info span:first-child {\\n  margin-right: 3px;\\n}\\nheader .info span:last-child {\\n  margin-left: 3px;\\n}\\n\\nmenu {\\n  margin: 0;\\n  color: white;\\n  background: #333;\\n  display: flex;\\n  padding: 1rem;\\n  padding-right: 1.5rem;\\n}\\n\\n.content {\\n  flex: 1 0;\\n  display: flex;\\n  flex-flow: row;\\n  overflow: hidden;\\n}\\n\\n.dataviz {\\n  flex: 1 0;\\n  display: flex;\\n  flex-flow: column;\\n  align-items: center;\\n}</style>\\n"],"names":[],"mappings":"AAkMmB,MAAM,8BAAC,CAAC,AACzB,OAAO,CAAE,CAAC,CAAC,MAAM,CACjB,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,OAAO,CACnB,KAAK,CAAE,KAAK,CACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,aAAa,AAChC,CAAC,AACD,qBAAM,CAAC,eAAe,eAAC,CAAC,AACtB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AACD,qBAAM,CAAC,KAAK,eAAC,CAAC,AACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,IAAI,CACZ,SAAS,CAAE,MAAM,CACjB,YAAY,CAAE,MAAM,CACpB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CAAC,IAAI,CAAC,WAAW,AACpC,CAAC,AACD,qBAAM,CAAC,oBAAK,MAAM,AAAC,CAAC,AAClB,KAAK,CAAE,KAAK,AACd,CAAC,AACD,qBAAM,CAAC,OAAO,eAAC,CAAC,AACd,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,QAAQ,AACvB,CAAC,AACD,qBAAM,CAAC,EAAE,eAAC,CAAC,AACT,SAAS,CAAE,IAAI,AACjB,CAAC,AACD,qBAAM,CAAC,EAAE,eAAC,CAAC,AACT,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,IAAI,CACjB,cAAc,CAAE,UAAU,AAC5B,CAAC,AACD,qBAAM,CAAC,KAAK,eAAC,CAAC,AACZ,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,QAAQ,CACrB,OAAO,CAAE,GAAG,AACd,CAAC,AACD,qBAAM,CAAC,KAAK,CAAC,mBAAI,YAAY,AAAC,CAAC,AAC7B,YAAY,CAAE,GAAG,AACnB,CAAC,AACD,qBAAM,CAAC,KAAK,CAAC,mBAAI,WAAW,AAAC,CAAC,AAC5B,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,IAAI,8BAAC,CAAC,AACJ,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,IAAI,CACb,OAAO,CAAE,IAAI,CACb,aAAa,CAAE,MAAM,AACvB,CAAC,AAED,QAAQ,8BAAC,CAAC,AACR,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,GAAG,CACd,QAAQ,CAAE,MAAM,AAClB,CAAC,AAED,QAAQ,8BAAC,CAAC,AACR,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,MAAM,AACrB,CAAC"}`,
};
var __awaiter = function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve2) {
          resolve2(value);
        });
  }
  return new (P || (P = Promise))(function (resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator['throw'](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done
        ? resolve2(result.value)
        : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var start = 2012;
var end = new Date().getFullYear();
var defaultYear = end - 1;
var years = [...Array(end - start + 1).keys()].map(x => x + start);
function load({ page: { query } }) {
  return __awaiter(this, void 0, void 0, function* () {
    const name = query.get('name');
    const insee = query.get('insee');
    const y = query.get('year');
    const sirenString = query.get('sirens');
    let siret = query.get('siret');
    let sirens =
      sirenString === null || sirenString === void 0
        ? void 0
        : sirenString.split(',');
    const year = parseInt(y) || defaultYear;
    if (!siret || !sirens) {
      const siretsFromInsee = yield getSiretsFromInsee(name, insee);
      sirens = extractSirens(siretsFromInsee);
      const sirets = siretsFromInsee
        .filter(e => e.etablissementSiege)
        .map(e => e.siret)
        .sort();
      siret = sirets[0];
      return {
        redirect: makeBudgetUrl({ name, insee, siret, sirens, year }),
        status: 301,
      };
    }
    const mainSiren = extractSiren(siret);
    yield Promise.all(fillBudgetBySirens([mainSiren], [year], name));
    return {
      props: {
        sirens,
        currentSiret: siret,
        currentYear: year,
        insee,
        name,
      },
    };
  });
}
var Budgets = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let findSimilarBudget;
  let findSimilarLabel;
  let cityP;
  let budgetPs;
  let otherBudgetPs;
  let allPs;
  let loadingP;
  let sirets;
  let labels;
  let valuePs;
  let yearIndex;
  let budgetP;
  let label;
  let $city, $$unsubscribe_city;
  $$unsubscribe_city = subscribe(city, value => ($city = value));
  (function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve2) {
            resolve2(value);
          });
    }
    return new (P || (P = Promise))(function (resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve2(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { sirens } = $$props;
  let { currentSiret } = $$props;
  let { currentYear } = $$props;
  let { insee } = $$props;
  let { name } = $$props;
  let budgetById = {};
  function selectSiret(s2) {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: s2,
      sirens,
      year: currentYear,
    });
    goto(url);
  }
  function selectYear(y) {
    const url = makeBudgetUrl({
      name,
      insee,
      siret: currentSiret,
      sirens,
      year: y,
    });
    goto(url);
  }
  if ($$props.sirens === void 0 && $$bindings.sirens && sirens !== void 0)
    $$bindings.sirens(sirens);
  if (
    $$props.currentSiret === void 0 &&
    $$bindings.currentSiret &&
    currentSiret !== void 0
  )
    $$bindings.currentSiret(currentSiret);
  if (
    $$props.currentYear === void 0 &&
    $$bindings.currentYear &&
    currentYear !== void 0
  )
    $$bindings.currentYear(currentYear);
  if ($$props.insee === void 0 && $$bindings.insee && insee !== void 0)
    $$bindings.insee(insee);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$result.css.add(css$1);
  {
    if (name) {
      budgetById = {};
    }
  }
  budgetPs = fillBudgetBySiret(currentSiret, years, name).map(p =>
    p.then(b => b && (budgetById[b.id] = b)),
  );
  otherBudgetPs = fillBudgetBySirens(sirens, [...years].reverse(), name).map(
    p => p.then(budgets => budgets.map(b => b && (budgetById[b.id] = b))),
  );
  findSimilarBudget = function (siret) {
    return Object.values(budgetById).find(
      budget2 => budget2 && budget2.siret === siret,
    );
  };
  findSimilarLabel = function () {
    const id = makeId(currentSiret, currentYear);
    const budget2 = budgetById[id] || findSimilarBudget(currentSiret);
    return budget2 === null || budget2 === void 0 ? void 0 : budget2.label;
  };
  cityP = $city
    ? Promise.resolve($city)
    : getCity(insee).then(result => {
        city.set(result);
        return result;
      });
  allPs = [...budgetPs, ...otherBudgetPs];
  loadingP = Promise.all(allPs);
  sirets = [
    ...new Set(
      Object.values(budgetById)
        .filter(b => b)
        .map(b => b.siret),
    ),
  ].sort();
  labels = sirets
    .map(s2 => {
      const id = makeId(s2, currentYear);
      const budget2 = budgetById[id];
      return budget2 || findSimilarBudget(s2);
    })
    .filter(l => l);
  valuePs = budgetPs.map(budgetP2 =>
    budgetP2.then(budget2 => budget2 && budget2.obnetcre),
  );
  yearIndex = years.findIndex(y => y === currentYear);
  budgetP = budgetPs[yearIndex];
  label = findSimilarLabel();
  $$unsubscribe_city();
  return `${
    (($$result.head += `${(function (__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return `
    ${
      (($$result.title = `<title>${escape(`Budgets pour ${name}`)}</title>`),
      '')
    }
  `;
      }
      return (function (city2) {
        return `
    ${
      city2
        ? `${
            (($$result.title = `<title>${escape(
              `Budgets pour ${name} (${city2.departement.code})`,
            )}</title>`),
            '')
          }`
        : ``
    }
  `;
      })(__value);
    })(cityP)}`),
    '')
  }

<header class="${'svelte-1br52vy'}"><a class="${'home svelte-1br52vy'}" href="${'/'}">${validate_component(
    Icon,
    'Icon',
  ).$$render($$result, { id: 'book-open' }, {}, {})}</a>
  <div class="${'info-container svelte-1br52vy'}"><div class="${'titles svelte-1br52vy'}"><h1 class="${'svelte-1br52vy'}">${escape(
    name,
  )}</h1>

      ${
        label ? `<h2 class="${'svelte-1br52vy'}">${escape(label)}</h2>` : ``
      }</div>
    <div class="${'info svelte-1br52vy'}">${(function (__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
        ${validate_component(Spinner, 'Spinner').$$render($$result, {}, {}, {})}
      `;
    }
    return (function (city2) {
      return `
        ${
          city2
            ? `<span class="${'svelte-1br52vy'}">${escape(
                `Population : ${city2.population}`,
              )}</span>
          |
          <span class="${'svelte-1br52vy'}">${escape(
                `${city2.departement.code} - ${city2.departement.nom}`,
              )}</span>`
            : ``
        }
      `;
    })(__value);
  })(cityP)}</div></div></header>

<div class="${'content svelte-1br52vy'}"><menu class="${'svelte-1br52vy'}">${validate_component(
    Labels,
    'Labels',
  ).$$render(
    $$result,
    {
      labels,
      loadingP,
      selected: currentSiret,
      select: selectSiret,
    },
    {},
    {},
  )}</menu>
  <div class="${'dataviz svelte-1br52vy'}">${validate_component(
    Summary,
    'Summary',
  ).$$render($$result, { year: currentYear, budgetP }, {}, {})}
    ${validate_component(Years, 'Years').$$render(
      $$result,
      {
        years,
        valuePs,
        selected: currentYear,
        select: selectYear,
      },
      {},
      {},
    )}</div>
</div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  default: Budgets,
  load,
});
var html = `<h2>Livres ouverts, c'est quoi ?</h2>
<p>Livres ouverts est un <strong>moteur de recherche open-source</strong> permettant de parcourir <strong>les budgets des diff\xE9rentes communes fran\xE7aises</strong>.</p>
<h2>C'est payant ?</h2>
<p><strong>Non.</strong></p>
<p>Ce projet est port\xE9 avec une ambition citoyenne. Il ne sera jamais payant.</p>
<h2>Pourquoi ce projet ?</h2>
<p>Depuis plusieurs ann\xE9es, le gouvernement fran\xE7ais a une politique promouvant l'ouverture des donn\xE9es publiques.</p>
<p>N\xE9anmoins, malgr\xE9 la disponibilit\xE9 de nombreuses donn\xE9es, notamment <a href="https://www.data.gouv.fr/fr/">sur le portail Data.gouv.fr</a>, la plupart sont brutes, obscures et difficiles d'acc\xE8s, ce qui dessert l'objectif de transparence de ces donn\xE9es.</p>
<p>Les donn\xE9es budg\xE9taires des \xE9tablissements publics ne font pas exception.</p>
<p>Livres ouverts a pour ambition d'<strong>offrir une interface simple permettant \xE0 tout le monde d'acc\xE9der aux diff\xE9rents budgets des communes fran\xE7aises</strong>.</p>
<h2>Qui est concern\xE9.e ?</h2>
<p><strong>Tout le monde.</strong></p>
<p>Les budgets des collectivit\xE9s locales sont financ\xE9s par les imp\xF4ts locaux de tout un chacun.e.
Ils permettent de payer les salaires des fonctionnaires locaux, de construire des \xE9coles, des h\xF4pitaux, de financer des projets d'int\xE9r\xEAt public...</p>
<p>Ils concernent donc tout le monde, et chacun.e est invit\xE9.e \xE0 parcourir le budget de sa commune avec cet outil.</p>
<p>Toutefois, <strong>ce projet s'adresse plus particuli\xE8rement aux personnes dont l'expertise peut permettre une analyse pertinente de ce type de donn\xE9es</strong>: journalistes, \xE9conomistes, ou autres.</p>
<h2>Qu'est-ce que vous ne trouverez pas ici ?</h2>
<p>Livres ouverts ne fournit <strong>aucune analyse</strong> des donn\xE9es budg\xE9taires qu'il pr\xE9sente.</p>
<p>Son r\xF4le n'est pas de critiquer ou d'encenser une politique budg\xE9taire, mais de rendre disponible des donn\xE9es au plus grand nombre, afin que certain.e.s puissent s'en saisir et les analyser.</p>
<p>De plus, <strong>aucune manipulation n'est effectu\xE9e sur les donn\xE9es</strong>. D'\xE9ventuelles simplifications de labels peuvent \xEAtre effectu\xE9es au niveau de l'interface dans un souci de concision, mais les fichiers CSV que vous pouvez t\xE9l\xE9charger sont tels qu'ils sont fournis par le Minist\xE8re de l'\xC9conomie et des Finances.</p>
<h2>D'o\xF9 viennent les donn\xE9es ?</h2>
<p>Ce projet utilise les donn\xE9es ouvertes:</p>
<ul>
<li>du <a href="https://data.economie.gouv.fr/explore/dataset/balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec0/table/">Minist\xE8re de l'\xC9conomie et des Finances</a></li>
<li>de <a href="https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&amp;version=V3&amp;provider=insee#!/Etablissement/findBySiret">la base SIREN</a></li>
<li>de <a href="https://geo.api.gouv.fr/decoupage-administratif/communes">la Base d'Adresse Nationale</a></li>
</ul>
<h2>Pourquoi ma commune n'a pas de budget ?</h2>
<p>Les donn\xE9es actuellement utilis\xE9es sont celles d\xE9finies comme:</p>
<blockquote>
<p><a href="https://data.economie.gouv.fr/explore/?sort=modified&amp;q=balances+crois%C3%A9e"><em>Balances comptables des collectivit\xE9s et des \xE9tablissements publics locaux avec la pr\xE9sentation crois\xE9e nature-fonction</em></a></p>
</blockquote>
<p>Il est probable que certaines communes n'aient pas fourni au Minist\xE8re leurs donn\xE9es budg\xE9taires sous ce format.</p>
<p>Celles-ci ne seront donc pas r\xE9f\xE9renc\xE9es ici.</p>
<p>D'autres donn\xE9es concernant les donn\xE9es des communes sont fournies par le Minist\xE8re de l'\xC9conomie et des Finances:</p>
<blockquote>
<p><a href="https://data.economie.gouv.fr/explore/?sort=modified&amp;q=balances+communes"><em>Balances comptables des communes</em></a></p>
</blockquote>
<p><strong>Il est pr\xE9vu d'int\xE9grer ces donn\xE9es</strong> dans Livres ouverts, ce qui devrait rendre accessibles les donn\xE9es de plus de communes.</p>
<h2>C'est tout ?</h2>
<p>Actuellement, Livres ouverts ne propose que la navigation par Siret et par ann\xE9e.</p>
<p>Bien que pr\xE9sents dans les fichiers CSV \xE0 t\xE9l\xE9charger, aucun d\xE9tail n'est accessible via l'interface.</p>
<p>Dans une version future, <strong>il est pr\xE9vu d'int\xE9grer une navigation crois\xE9e nature/fonction</strong> similaire \xE0 <a href="https://www.gironde.fr/un-budget-au-service-des-solidarites-humaine-et-territoriale#!/explorer">celle propos\xE9e par le D\xE9partement de la Gironde pour son budget 2018</a>.</p>
<p>Une telle navigation permettra d'explorer chaque budget plus en d\xE9tail.</p>
<p>De plus, <strong>il est envisag\xE9 d'int\xE9grer les donn\xE9es d'autres types de collectivit\xE9s locales</strong>: r\xE9gions, d\xE9partements, ...</p>
<h2>\xC7a ne marche pas \u{1F92C}!</h2>
<p>Livres ouverts est <strong>en phase active de d\xE9veloppement</strong>, et est certainement sujet \xE0 diff\xE9rents bugs. Ceux-ci seront corrig\xE9s au fur et \xE0 mesure.</p>
<p><strong>Si vous trouvez un bug, <a href="https://twitter.com/r_ourson">n'h\xE9sitez pas \xE0 le remonter</a>.</strong></p>
<h2>Comment puis-je aider ?</h2>
<p>Livres ouverts un projet <strong>open-source</strong>, auquel tout le monde peut contribuer.</p>
<p>Vous pouvez contribuer <a href="https://github.com/iOiurson/open-books">ici</a>, mais il est n\xE9cessaire d'\xEAtre \xE0 l'aise avec <a href="https://github.com/">Github</a>.</p>
<h2>Qui puis-je contacter ?</h2>
<p>Pour toute question, <strong>n'h\xE9sitez pas</strong> \xE0 contacter le mainteneur du projet <a href="https://twitter.com/r_ourson">sur Twitter</a>.</p>
`;
var css = {
  code: 'main.svelte-jtbs2k{padding:2rem 20%;padding-bottom:5rem;flex:1 0;overflow-y:scroll}@media(max-width: 480px){main.svelte-jtbs2k{padding:2rem}}',
  map: `{"version":3,"file":"about.svelte","sources":["about.svelte"],"sourcesContent":["<script lang=\\"ts\\">import marked from 'marked';\\nimport { html } from '@docs/about.md';\\nconst content = marked(html);\\n<\/script>\\n\\n<svelte:head>\\n  <title>\xC0 propos de Livres ouverts</title>\\n</svelte:head>\\n\\n<main class=\\"md\\">\\n  {@html content}\\n</main>\\n\\n<style lang=\\"scss\\">main {\\n  padding: 2rem 20%;\\n  padding-bottom: 5rem;\\n  flex: 1 0;\\n  overflow-y: scroll;\\n}\\n\\n@media (max-width: 480px) {\\n  main {\\n    padding: 2rem;\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAamB,IAAI,cAAC,CAAC,AACvB,OAAO,CAAE,IAAI,CAAC,GAAG,CACjB,cAAc,CAAE,IAAI,CACpB,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,IAAI,cAAC,CAAC,AACJ,OAAO,CAAE,IAAI,AACf,CAAC,AACH,CAAC"}`,
};
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const content = (0, import_marked.default)(html);
  $$result.css.add(css);
  return `${
    (($$result.head += `${
      (($$result.title = `<title>\xC0 propos de Livres ouverts</title>`), '')
    }`),
    '')
  }

<main class="${'md svelte-jtbs2k'}"><!-- HTML_TAG_START -->${content}<!-- HTML_TAG_END -->
</main>`;
});
var about = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: 'Module',
  default: About,
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || '', 'http://localhost');
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || 'Invalid request body');
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body,
  });
  if (rendered) {
    const { status, headers: headers2, body: body2 } = rendered;
    return res.writeHead(status, headers2).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/**
 * @license MIT
 * doc-path <https://github.com/mrodrig/doc-path>
 * Copyright (c) 2015-present, Michael Rodrigues.
 */
