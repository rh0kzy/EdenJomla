"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const client = require("@prisma/client");
const fs = require("fs");
const require$$2 = require("os");
const require$$3 = require("crypto");
const uuid = require("uuid");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
var config = {};
var main = { exports: {} };
const version = "16.6.1";
const require$$4 = {
  version
};
var hasRequiredMain;
function requireMain() {
  if (hasRequiredMain) return main.exports;
  hasRequiredMain = 1;
  const fs$1 = fs;
  const path$1 = path;
  const os = require$$2;
  const crypto = require$$3;
  const packageJson = require$$4;
  const version2 = packageJson.version;
  const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function parse(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, "\n");
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, "\n");
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  }
  function _parseVault(options) {
    options = options || {};
    const vaultPath = _vaultPath(options);
    options.path = vaultPath;
    const result = DotenvModule.configDotenv(options);
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = "MISSING_DATA";
      throw err;
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0; i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  }
  function _warn(message) {
    console.log(`[dotenv@${version2}][WARN] ${message}`);
  }
  function _debug(message) {
    console.log(`[dotenv@${version2}][DEBUG] ${message}`);
  }
  function _log(message) {
    console.log(`[dotenv@${version2}] ${message}`);
  }
  function _dotenvKey(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  }
  function _instructions(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      const err = new Error("INVALID_DOTENV_KEY: Missing key part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
      throw err;
    }
    return { ciphertext, key };
  }
  function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs$1.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path$1.resolve(process.cwd(), ".env.vault");
    }
    if (fs$1.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  }
  function _resolveHome(envPath) {
    return envPath[0] === "~" ? path$1.join(os.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    const debug = Boolean(options && options.debug);
    const quiet = options && "quiet" in options ? options.quiet : true;
    if (debug || !quiet) {
      _log("Loading env from encrypted .env.vault");
    }
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  }
  function configDotenv(options) {
    const dotenvPath = path$1.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    const debug = Boolean(options && options.debug);
    const quiet = options && "quiet" in options ? options.quiet : true;
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug) {
        _debug("No encoding is specified. UTF-8 is used by default");
      }
    }
    let optionPaths = [dotenvPath];
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = [];
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }
    let lastError;
    const parsedAll = {};
    for (const path2 of optionPaths) {
      try {
        const parsed = DotenvModule.parse(fs$1.readFileSync(path2, { encoding }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${path2} ${e.message}`);
        }
        lastError = e;
      }
    }
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsedAll, options);
    if (debug || !quiet) {
      const keysCount = Object.keys(parsedAll).length;
      const shortPaths = [];
      for (const filePath of optionPaths) {
        try {
          const relative = path$1.relative(process.cwd(), filePath);
          shortPaths.push(relative);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${filePath} ${e.message}`);
          }
          lastError = e;
        }
      }
      _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
    }
    if (lastError) {
      return { parsed: parsedAll, error: lastError };
    } else {
      return { parsed: parsedAll };
    }
  }
  function config2(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      } else if (decryptionFailed) {
        const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        err.code = "DECRYPTION_FAILED";
        throw err;
      } else {
        throw error;
      }
    }
  }
  function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    if (typeof parsed !== "object") {
      const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      err.code = "OBJECT_REQUIRED";
      throw err;
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
      }
    }
  }
  const DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config: config2,
    decrypt,
    parse,
    populate
  };
  main.exports.configDotenv = DotenvModule.configDotenv;
  main.exports._configVault = DotenvModule._configVault;
  main.exports._parseVault = DotenvModule._parseVault;
  main.exports.config = DotenvModule.config;
  main.exports.decrypt = DotenvModule.decrypt;
  main.exports.parse = DotenvModule.parse;
  main.exports.populate = DotenvModule.populate;
  main.exports = DotenvModule;
  return main.exports;
}
var envOptions;
var hasRequiredEnvOptions;
function requireEnvOptions() {
  if (hasRequiredEnvOptions) return envOptions;
  hasRequiredEnvOptions = 1;
  const options = {};
  if (process.env.DOTENV_CONFIG_ENCODING != null) {
    options.encoding = process.env.DOTENV_CONFIG_ENCODING;
  }
  if (process.env.DOTENV_CONFIG_PATH != null) {
    options.path = process.env.DOTENV_CONFIG_PATH;
  }
  if (process.env.DOTENV_CONFIG_QUIET != null) {
    options.quiet = process.env.DOTENV_CONFIG_QUIET;
  }
  if (process.env.DOTENV_CONFIG_DEBUG != null) {
    options.debug = process.env.DOTENV_CONFIG_DEBUG;
  }
  if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
    options.override = process.env.DOTENV_CONFIG_OVERRIDE;
  }
  if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
    options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
  }
  envOptions = options;
  return envOptions;
}
var cliOptions;
var hasRequiredCliOptions;
function requireCliOptions() {
  if (hasRequiredCliOptions) return cliOptions;
  hasRequiredCliOptions = 1;
  const re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
  cliOptions = function optionMatcher(args) {
    const options = args.reduce(function(acc, cur) {
      const matches = cur.match(re);
      if (matches) {
        acc[matches[1]] = matches[2];
      }
      return acc;
    }, {});
    if (!("quiet" in options)) {
      options.quiet = "true";
    }
    return options;
  };
  return cliOptions;
}
var hasRequiredConfig;
function requireConfig() {
  if (hasRequiredConfig) return config;
  hasRequiredConfig = 1;
  (function() {
    requireMain().config(
      Object.assign(
        {},
        requireEnvOptions(),
        requireCliOptions()(process.argv)
      )
    );
  })();
  return config;
}
requireConfig();
const prisma = new client.PrismaClient();
class ParfumRepository {
  async getAll() {
    return prisma.parfum.findMany({
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    });
  }
  async getById(id) {
    return prisma.parfum.findUnique({
      where: { id },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    });
  }
  async create(data) {
    const parfum = await prisma.parfum.create({
      data: {
        nom: data.nom,
        marque: data.marque,
        description: data.description,
        image: data.image,
        notes: data.notes,
        barcode: data.barcode,
        categoryId: data.categoryId,
        createdBy: data.createdBy || "system",
        updatedBy: data.updatedBy || "system"
      }
    });
    await prisma.parfumHistory.create({
      data: {
        parfumId: parfum.id,
        action: "CREATE",
        newData: JSON.stringify(parfum),
        changedBy: data.createdBy || "system"
      }
    });
    return parfum;
  }
  async update(id, data) {
    const currentParfum = await prisma.parfum.findUnique({
      where: { id }
    });
    const updatedParfum = await prisma.parfum.update({
      where: { id },
      data: {
        ...data,
        updatedBy: data.updatedBy || "system"
      }
    });
    if (currentParfum && JSON.stringify(currentParfum) !== JSON.stringify(updatedParfum)) {
      await prisma.parfumHistory.create({
        data: {
          parfumId: id,
          action: "UPDATE",
          oldData: JSON.stringify(currentParfum),
          newData: JSON.stringify(updatedParfum),
          changedBy: data.updatedBy || "system"
        }
      });
    }
    return updatedParfum;
  }
  async delete(id) {
    const currentParfum = await prisma.parfum.findUnique({
      where: { id }
    });
    const deletedParfum = await prisma.parfum.delete({
      where: { id }
    });
    if (currentParfum) {
      await prisma.parfumHistory.create({
        data: {
          parfumId: id,
          action: "DELETE",
          oldData: JSON.stringify(currentParfum),
          changedBy: "system"
          // Could be passed as parameter in future
        }
      });
    }
    return deletedParfum;
  }
  async getHistory(parfumId) {
    return prisma.parfumHistory.findMany({
      where: { parfumId },
      orderBy: { createdAt: "desc" }
    });
  }
  async duplicate(id, newData) {
    const originalParfum = await prisma.parfum.findUnique({
      where: { id },
      include: { references: true }
    });
    if (!originalParfum) {
      throw new Error("Parfum not found");
    }
    const duplicateData = {
      nom: `${originalParfum.nom} (Copie)`,
      marque: originalParfum.marque,
      description: originalParfum.description,
      image: originalParfum.image,
      notes: originalParfum.notes,
      barcode: originalParfum.barcode,
      categoryId: originalParfum.categoryId,
      ...newData
    };
    return this.create(duplicateData);
  }
  async getByBarcode(barcode) {
    return prisma.parfum.findUnique({
      where: { barcode },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    });
  }
  async getByCategory(categoryId) {
    return prisma.parfum.findMany({
      where: { categoryId },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    });
  }
  async getByTag(tagId) {
    return prisma.parfum.findMany({
      where: {
        tags: {
          some: { tagId }
        }
      },
      include: {
        references: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    });
  }
}
class ParfumService {
  repo = new ParfumRepository();
  async getAllParfums() {
    try {
      const parfums = await this.repo.getAll();
      return { success: true, data: parfums };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async createParfum(data) {
    try {
      if (!data.nom || !data.marque) {
        return { success: false, error: "Nom et marque sont obligatoires" };
      }
      const parfum = await this.repo.create(data);
      return { success: true, data: parfum };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async updateParfum(id, data) {
    try {
      const parfum = await this.repo.update(id, data);
      return { success: true, data: parfum };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async deleteParfum(id) {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getParfumHistory(parfumId) {
    try {
      const history = await this.repo.getHistory(parfumId);
      return { success: true, data: history };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async duplicateParfum(id, newData) {
    try {
      const parfum = await this.repo.duplicate(id, newData);
      return { success: true, data: parfum };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getParfumByBarcode(barcode) {
    try {
      const parfum = await this.repo.getByBarcode(barcode);
      return { success: true, data: parfum };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getParfumsByCategory(categoryId) {
    try {
      const parfums = await this.repo.getByCategory(categoryId);
      return { success: true, data: parfums };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getParfumsByTag(tagId) {
    try {
      const parfums = await this.repo.getByTag(tagId);
      return { success: true, data: parfums };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class FournisseurRepository {
  async getAll() {
    return prisma.fournisseur.findMany();
  }
  async getById(id) {
    return prisma.fournisseur.findUnique({
      where: { id }
    });
  }
  async create(data) {
    return prisma.fournisseur.create({
      data
    });
  }
  async update(id, data) {
    return prisma.fournisseur.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    return prisma.fournisseur.delete({
      where: { id }
    });
  }
}
class FournisseurService {
  repo = new FournisseurRepository();
  async getAll() {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async create(data) {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async update(id, data) {
    try {
      const result = await this.repo.update(id, data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async delete(id) {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class ClientRepository {
  async getAll() {
    return prisma.client.findMany();
  }
  async getById(id) {
    return prisma.client.findUnique({
      where: { id }
    });
  }
  async create(data) {
    return prisma.client.create({
      data
    });
  }
  async update(id, data) {
    return prisma.client.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    return prisma.client.delete({
      where: { id }
    });
  }
}
class ClientService {
  repo = new ClientRepository();
  async getAll() {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async create(data) {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async update(id, data) {
    try {
      const result = await this.repo.update(id, data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async delete(id) {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class ParfumReferenceRepository {
  async getAll() {
    return prisma.parfumReference.findMany({
      include: {
        parfum: true,
        fournisseur: true,
        stock: true
      }
    });
  }
  async getById(id) {
    return prisma.parfumReference.findUnique({
      where: { id },
      include: {
        parfum: true,
        fournisseur: true,
        stock: true
      }
    });
  }
  async getByCode(referenceCode) {
    return prisma.parfumReference.findUnique({
      where: { referenceCode }
    });
  }
  async create(data) {
    return prisma.parfumReference.create({
      data: {
        referenceCode: data.referenceCode,
        unite: data.unite,
        prixUnitaire: data.prixUnitaire,
        parfumId: data.parfumId,
        fournisseurId: data.fournisseurId,
        stock: {
          create: { quantite: 0 }
        }
      }
    });
  }
  async update(id, data) {
    return prisma.parfumReference.update({
      where: { id },
      data: {
        referenceCode: data.referenceCode,
        unite: data.unite,
        prixUnitaire: data.prixUnitaire,
        parfumId: data.parfumId,
        fournisseurId: data.fournisseurId
      }
    });
  }
  async delete(id) {
    return prisma.parfumReference.delete({
      where: { id }
    });
  }
}
class ParfumReferenceService {
  repo = new ParfumReferenceRepository();
  async getAll() {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async create(data) {
    try {
      const existing = await this.repo.getByCode(data.referenceCode);
      if (existing) {
        return { success: false, error: "Ce code de référence existe déjà" };
      }
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async update(id, data) {
    try {
      if (data.referenceCode) {
        const existing = await this.repo.getByCode(data.referenceCode);
        if (existing && existing.id !== id) {
          return { success: false, error: "Ce code de référence existe déjà" };
        }
      }
      const result = await this.repo.update(id, data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async delete(id) {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class StockRepository {
  async getAll() {
    return prisma.stock.findMany({
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        },
        warehouse: true,
        movements: {
          orderBy: { createdAt: "desc" },
          take: 10
          // Last 10 movements
        }
      }
    });
  }
  async getById(id) {
    return prisma.stock.findUnique({
      where: { id },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        },
        warehouse: true,
        movements: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }
  async updateQuantity(referenceId, delta, user, reason) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });
    if (!stock) {
      const newStock = await prisma.stock.create({
        data: {
          parfumReferenceId: referenceId,
          quantite: delta
        }
      });
      await this.createMovement(newStock.id, delta > 0 ? "IN" : "OUT", delta, user, reason);
      return newStock;
    }
    const newQuantity = stock.quantite + delta;
    const updatedStock = await prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        quantite: newQuantity
      }
    });
    await this.createMovement(stock.id, delta > 0 ? "IN" : "OUT", delta, user, reason);
    return updatedStock;
  }
  async setQuantity(referenceId, quantity, user, reason) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });
    let delta = quantity;
    if (stock) {
      delta = quantity - stock.quantite;
    }
    const updatedStock = await prisma.stock.upsert({
      where: { parfumReferenceId: referenceId },
      update: { quantite: quantity },
      create: {
        parfumReferenceId: referenceId,
        quantite: quantity
      }
    });
    if (stock) {
      await this.createMovement(stock.id, "ADJUSTMENT", delta, user, reason);
    } else {
      await this.createMovement(updatedStock.id, "IN", quantity, user, reason);
    }
    return updatedStock;
  }
  async updateStockDetails(referenceId, data) {
    return prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data
    });
  }
  async reserveStock(referenceId, quantity, user) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });
    if (!stock || stock.quantite - stock.reserved < quantity) {
      throw new Error("Insufficient stock for reservation");
    }
    const updatedStock = await prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        reserved: stock.reserved + quantity
      }
    });
    await this.createMovement(stock.id, "RESERVATION", quantity, user, "Stock reservation");
    return updatedStock;
  }
  async cancelReservation(referenceId, quantity, user) {
    const stock = await prisma.stock.findUnique({
      where: { parfumReferenceId: referenceId }
    });
    if (!stock || stock.reserved < quantity) {
      throw new Error("Invalid reservation quantity");
    }
    const updatedStock = await prisma.stock.update({
      where: { parfumReferenceId: referenceId },
      data: {
        reserved: stock.reserved - quantity
      }
    });
    await this.createMovement(stock.id, "CANCEL_RESERVATION", -quantity, user, "Cancel reservation");
    return updatedStock;
  }
  async getMovements(stockId, limit) {
    return prisma.stockMovement.findMany({
      where: { stockId },
      orderBy: { createdAt: "desc" },
      take: limit || 50
    });
  }
  async getLowStockAlerts() {
    return prisma.stock.findMany({
      where: {
        AND: [
          { seuilMin: { not: null } },
          { quantite: { lte: prisma.stock.fields.seuilMin } }
        ]
      },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
  }
  async getHighStockAlerts() {
    return prisma.stock.findMany({
      where: {
        AND: [
          { seuilMax: { not: null } },
          { quantite: { gte: prisma.stock.fields.seuilMax } }
        ]
      },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
  }
  async getExpiringStock(days = 30) {
    const futureDate = /* @__PURE__ */ new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return prisma.stock.findMany({
      where: {
        AND: [
          { datePeremption: { not: null } },
          { datePeremption: { lte: futureDate } }
        ]
      },
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
  }
  async createMovement(stockId, type, quantity, user, reason) {
    return prisma.stockMovement.create({
      data: {
        stockId,
        type,
        quantity,
        user,
        reason
      }
    });
  }
}
class StockService {
  repo = new StockRepository();
  async getAll() {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getById(id) {
    try {
      const result = await this.repo.getById(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async updateQuantity(referenceId, delta, user, reason) {
    try {
      const result = await this.repo.updateQuantity(referenceId, delta, user, reason);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async setQuantity(referenceId, quantity, user, reason) {
    try {
      const result = await this.repo.setQuantity(referenceId, quantity, user, reason);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async updateStockDetails(referenceId, data) {
    try {
      const result = await this.repo.updateStockDetails(referenceId, data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async reserveStock(referenceId, quantity, user) {
    try {
      const result = await this.repo.reserveStock(referenceId, quantity, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async cancelReservation(referenceId, quantity, user) {
    try {
      const result = await this.repo.cancelReservation(referenceId, quantity, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getMovements(stockId, limit) {
    try {
      const result = await this.repo.getMovements(stockId, limit);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getLowStockAlerts() {
    try {
      const result = await this.repo.getLowStockAlerts();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getHighStockAlerts() {
    try {
      const result = await this.repo.getHighStockAlerts();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getExpiringStock(days) {
    try {
      const result = await this.repo.getExpiringStock(days);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Basic IA prediction for stock rupture (simple linear regression based on last movements)
  async predictStockRupture(referenceId) {
    try {
      const stock = await this.repo.getById(referenceId);
      if (!stock) {
        return { success: false, error: "Stock not found" };
      }
      const movements = stock.movements || [];
      if (movements.length < 2) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }
      const outMovements = movements.filter((m) => m.type === "OUT" && m.quantity < 0);
      if (outMovements.length === 0) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }
      const totalOut = outMovements.reduce((sum, m) => sum + Math.abs(m.quantity), 0);
      const daysSpan = Math.max(1, ((/* @__PURE__ */ new Date()).getTime() - new Date(movements[0].createdAt).getTime()) / (1e3 * 60 * 60 * 24));
      const dailyConsumption = totalOut / daysSpan;
      if (dailyConsumption <= 0) {
        return { success: true, data: { daysUntilRupture: -1, confidence: 0 } };
      }
      const available = stock.quantite - stock.reserved;
      const daysUntilRupture = available / dailyConsumption;
      const confidence = Math.min(0.8, outMovements.length / 10);
      return { success: true, data: { daysUntilRupture: Math.round(daysUntilRupture), confidence } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class WarehouseRepository {
  async getAll() {
    return prisma.warehouse.findMany({
      include: {
        _count: {
          select: { stocks: true }
        }
      }
    });
  }
  async getById(id) {
    return prisma.warehouse.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            reference: {
              include: {
                parfum: true,
                fournisseur: true
              }
            }
          }
        }
      }
    });
  }
  async create(data) {
    return prisma.warehouse.create({ data });
  }
  async update(id, data) {
    return prisma.warehouse.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    const stockCount = await prisma.stock.count({
      where: { warehouseId: id }
    });
    if (stockCount > 0) {
      throw new Error("Cannot delete warehouse with existing stock");
    }
    return prisma.warehouse.delete({
      where: { id }
    });
  }
}
class WarehouseService {
  repo = new WarehouseRepository();
  async getAll() {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getById(id) {
    try {
      const result = await this.repo.getById(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async create(data) {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async update(id, data) {
    try {
      const result = await this.repo.update(id, data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async delete(id) {
    try {
      await this.repo.delete(id);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class InventoryRepository {
  async getAll() {
    return prisma.inventory.findMany({
      include: {
        warehouse: true,
        lines: {
          include: {
            stock: {
              include: {
                reference: {
                  include: {
                    parfum: true,
                    fournisseur: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  async getById(id) {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        warehouse: true,
        lines: {
          include: {
            stock: {
              include: {
                reference: {
                  include: {
                    parfum: true,
                    fournisseur: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });
  }
  async create(data) {
    const whereClause = {};
    if (data.warehouseId) {
      whereClause.warehouseId = data.warehouseId;
    }
    const stocks = await prisma.stock.findMany({
      where: whereClause,
      include: {
        reference: {
          include: {
            parfum: true,
            fournisseur: true
          }
        }
      }
    });
    const inventory = await prisma.inventory.create({
      data: {
        nom: data.nom,
        description: data.description,
        warehouseId: data.warehouseId,
        user: data.user,
        lines: {
          create: stocks.map((stock) => ({
            stockId: stock.id,
            expectedQty: stock.quantite
          }))
        }
      },
      include: {
        warehouse: true,
        lines: {
          include: {
            stock: {
              include: {
                reference: {
                  include: {
                    parfum: true,
                    fournisseur: true
                  }
                }
              }
            }
          }
        }
      }
    });
    return inventory;
  }
  async startInventory(id, user) {
    return prisma.inventory.update({
      where: { id },
      data: {
        status: "IN_PROGRESS",
        startedAt: /* @__PURE__ */ new Date(),
        user
      }
    });
  }
  async completeInventory(id, user) {
    return prisma.inventory.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: /* @__PURE__ */ new Date(),
        user
      }
    });
  }
  async cancelInventory(id, user) {
    return prisma.inventory.update({
      where: { id },
      data: {
        status: "CANCELLED",
        user
      }
    });
  }
  async updateLine(inventoryId, stockId, countedQty, notes, user) {
    const line = await prisma.inventoryLine.findUnique({
      where: {
        inventoryId_stockId: {
          inventoryId,
          stockId
        }
      }
    });
    if (!line) {
      throw new Error("Inventory line not found");
    }
    const difference = countedQty - line.expectedQty;
    return prisma.inventoryLine.update({
      where: {
        inventoryId_stockId: {
          inventoryId,
          stockId
        }
      },
      data: {
        countedQty,
        difference,
        notes,
        scannedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  async getInventoryReport(id) {
    const inventory = await this.getById(id);
    if (!inventory) return null;
    const totalItems = inventory.lines.length;
    const countedItems = inventory.lines.filter((line) => line.countedQty !== null).length;
    const discrepancies = inventory.lines.filter((line) => line.difference !== 0 && line.difference !== null);
    const totalExpectedValue = inventory.lines.reduce((sum, line) => sum + line.expectedQty * line.stock.reference.prixUnitaire, 0);
    const totalCountedValue = inventory.lines.reduce((sum, line) => sum + (line.countedQty || 0) * line.stock.reference.prixUnitaire, 0);
    return {
      ...inventory,
      summary: {
        totalItems,
        countedItems,
        completionPercentage: totalItems > 0 ? countedItems / totalItems * 100 : 0,
        discrepanciesCount: discrepancies.length,
        totalExpectedValue,
        totalCountedValue,
        valueDifference: totalCountedValue - totalExpectedValue
      }
    };
  }
  async delete(id) {
    await prisma.inventoryLine.deleteMany({
      where: { inventoryId: id }
    });
    return prisma.inventory.delete({
      where: { id }
    });
  }
}
class InventoryService {
  repo = new InventoryRepository();
  async getAll() {
    try {
      const result = await this.repo.getAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getById(id) {
    try {
      const result = await this.repo.getById(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async create(data) {
    try {
      const result = await this.repo.create(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async startInventory(id, user) {
    try {
      const result = await this.repo.startInventory(id, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async completeInventory(id, user) {
    try {
      const result = await this.repo.completeInventory(id, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async cancelInventory(id, user) {
    try {
      const result = await this.repo.cancelInventory(id, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async updateLine(inventoryId, stockId, countedQty, notes, user) {
    try {
      const result = await this.repo.updateLine(inventoryId, stockId, countedQty, notes, user);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getInventoryReport(id) {
    try {
      const result = await this.repo.getInventoryReport(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async delete(id) {
    try {
      await this.repo.delete(id);
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // Barcode scanning helper - find stock by barcode
  async findStockByBarcode(barcode) {
    try {
      const stock = await prisma.stock.findFirst({
        where: {
          reference: {
            parfum: {
              barcode
            }
          }
        },
        include: {
          reference: {
            include: {
              parfum: true,
              fournisseur: true
            }
          }
        }
      });
      if (!stock) {
        return { success: false, error: "Produit non trouvé pour ce code-barres" };
      }
      return { success: true, data: stock };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class CategoryRepository {
  prisma = new client.PrismaClient();
  async getAll() {
    return await this.prisma.category.findMany({
      orderBy: { nom: "asc" }
    });
  }
  async getById(id) {
    return await this.prisma.category.findUnique({
      where: { id }
    });
  }
  async create(data) {
    return await this.prisma.category.create({
      data
    });
  }
  async update(id, data) {
    return await this.prisma.category.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    await this.prisma.category.delete({
      where: { id }
    });
  }
  async getByName(nom) {
    return await this.prisma.category.findUnique({
      where: { nom }
    });
  }
}
class CategoryService {
  repo = new CategoryRepository();
  async getAllCategories() {
    try {
      const categories = await this.repo.getAll();
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async createCategory(data) {
    try {
      if (!data.nom) {
        return { success: false, error: "Le nom de la catégorie est obligatoire" };
      }
      const existingCategory = await this.repo.getByName(data.nom);
      if (existingCategory) {
        return { success: false, error: "Une catégorie avec ce nom existe déjà" };
      }
      const category = await this.repo.create(data);
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async updateCategory(id, data) {
    try {
      const category = await this.repo.update(id, data);
      return { success: true, data: category };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async deleteCategory(id) {
    try {
      const parfumsInCategory = await this.repo.getById(id);
      if (parfumsInCategory) {
      }
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
class TagRepository {
  prisma = new client.PrismaClient();
  async getAll() {
    return await this.prisma.tag.findMany({
      orderBy: { nom: "asc" }
    });
  }
  async getById(id) {
    return await this.prisma.tag.findUnique({
      where: { id }
    });
  }
  async create(data) {
    return await this.prisma.tag.create({
      data
    });
  }
  async update(id, data) {
    return await this.prisma.tag.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    await this.prisma.tag.delete({
      where: { id }
    });
  }
  async getByName(nom) {
    return await this.prisma.tag.findUnique({
      where: { nom }
    });
  }
  async getTagsForParfum(parfumId) {
    const parfumTags = await this.prisma.parfumTag.findMany({
      where: { parfumId },
      include: { tag: true }
    });
    return parfumTags.map((pt) => pt.tag);
  }
  async setTagsForParfum(parfumId, tagIds) {
    await this.prisma.parfumTag.deleteMany({
      where: { parfumId }
    });
    if (tagIds.length > 0) {
      await this.prisma.parfumTag.createMany({
        data: tagIds.map((tagId) => ({
          parfumId,
          tagId
        }))
      });
    }
  }
}
class TagService {
  repo = new TagRepository();
  async getAllTags() {
    try {
      const tags = await this.repo.getAll();
      return { success: true, data: tags };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async createTag(data) {
    try {
      if (!data.nom) {
        return { success: false, error: "Le nom du tag est obligatoire" };
      }
      const existingTag = await this.repo.getByName(data.nom);
      if (existingTag) {
        return { success: false, error: "Un tag avec ce nom existe déjà" };
      }
      const tag = await this.repo.create(data);
      return { success: true, data: tag };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async updateTag(id, data) {
    try {
      const tag = await this.repo.update(id, data);
      return { success: true, data: tag };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async deleteTag(id) {
    try {
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async getTagsForParfum(parfumId) {
    try {
      const tags = await this.repo.getTagsForParfum(parfumId);
      return { success: true, data: tags };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  async setTagsForParfum(parfumId, tagIds) {
    try {
      await this.repo.setTagsForParfum(parfumId, tagIds);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
function registerIpcHandlers() {
  const parfumService = new ParfumService();
  const fournisseurService = new FournisseurService();
  const clientService = new ClientService();
  const referenceService = new ParfumReferenceService();
  const stockService = new StockService();
  const warehouseService = new WarehouseService();
  const inventoryService = new InventoryService();
  const categoryService = new CategoryService();
  const tagService = new TagService();
  electron.ipcMain.handle("parfum:getAll", () => parfumService.getAllParfums());
  electron.ipcMain.handle("parfum:create", (_, data) => parfumService.createParfum(data));
  electron.ipcMain.handle("parfum:update", (_, { id, data }) => parfumService.updateParfum(id, data));
  electron.ipcMain.handle("parfum:delete", (_, id) => parfumService.deleteParfum(id));
  electron.ipcMain.handle("parfum:getHistory", (_, parfumId) => parfumService.getParfumHistory(parfumId));
  electron.ipcMain.handle("parfum:duplicate", (_, { id, data }) => parfumService.duplicateParfum(id, data));
  electron.ipcMain.handle("parfum:getByBarcode", (_, barcode) => parfumService.getParfumByBarcode(barcode));
  electron.ipcMain.handle("parfum:getByCategory", (_, categoryId) => parfumService.getParfumsByCategory(categoryId));
  electron.ipcMain.handle("parfum:getByTag", (_, tagId) => parfumService.getParfumsByTag(tagId));
  electron.ipcMain.handle("category:getAll", () => categoryService.getAllCategories());
  electron.ipcMain.handle("category:create", (_, data) => categoryService.createCategory(data));
  electron.ipcMain.handle("category:update", (_, { id, data }) => categoryService.updateCategory(id, data));
  electron.ipcMain.handle("category:delete", (_, id) => categoryService.deleteCategory(id));
  electron.ipcMain.handle("tag:getAll", () => tagService.getAllTags());
  electron.ipcMain.handle("tag:create", (_, data) => tagService.createTag(data));
  electron.ipcMain.handle("tag:update", (_, { id, data }) => tagService.updateTag(id, data));
  electron.ipcMain.handle("tag:delete", (_, id) => tagService.deleteTag(id));
  electron.ipcMain.handle("tag:getForParfum", (_, parfumId) => tagService.getTagsForParfum(parfumId));
  electron.ipcMain.handle("tag:setForParfum", (_, { parfumId, tagIds }) => tagService.setTagsForParfum(parfumId, tagIds));
  electron.ipcMain.handle("fournisseur:getAll", () => fournisseurService.getAll());
  electron.ipcMain.handle("fournisseur:create", (_, data) => fournisseurService.create(data));
  electron.ipcMain.handle("fournisseur:update", (_, { id, data }) => fournisseurService.update(id, data));
  electron.ipcMain.handle("fournisseur:delete", (_, id) => fournisseurService.delete(id));
  electron.ipcMain.handle("client:getAll", () => clientService.getAll());
  electron.ipcMain.handle("client:create", (_, data) => clientService.create(data));
  electron.ipcMain.handle("client:update", (_, { id, data }) => clientService.update(id, data));
  electron.ipcMain.handle("client:delete", (_, id) => clientService.delete(id));
  electron.ipcMain.handle("reference:getAll", () => referenceService.getAll());
  electron.ipcMain.handle("reference:create", (_, data) => referenceService.create(data));
  electron.ipcMain.handle("reference:update", (_, { id, data }) => referenceService.update(id, data));
  electron.ipcMain.handle("reference:delete", (_, id) => referenceService.delete(id));
  electron.ipcMain.handle("stock:getAll", () => stockService.getAll());
  electron.ipcMain.handle("stock:getById", (_, id) => stockService.getById(id));
  electron.ipcMain.handle("stock:updateQuantity", (_, { referenceId, delta, user, reason }) => stockService.updateQuantity(referenceId, delta, user, reason));
  electron.ipcMain.handle("stock:setQuantity", (_, { referenceId, quantity, user, reason }) => stockService.setQuantity(referenceId, quantity, user, reason));
  electron.ipcMain.handle("stock:updateDetails", (_, { referenceId, data }) => stockService.updateStockDetails(referenceId, data));
  electron.ipcMain.handle("stock:reserve", (_, { referenceId, quantity, user }) => stockService.reserveStock(referenceId, quantity, user));
  electron.ipcMain.handle("stock:cancelReservation", (_, { referenceId, quantity, user }) => stockService.cancelReservation(referenceId, quantity, user));
  electron.ipcMain.handle("stock:getMovements", (_, { stockId, limit }) => stockService.getMovements(stockId, limit));
  electron.ipcMain.handle("stock:getLowAlerts", () => stockService.getLowStockAlerts());
  electron.ipcMain.handle("stock:getHighAlerts", () => stockService.getHighStockAlerts());
  electron.ipcMain.handle("stock:getExpiring", (_, days) => stockService.getExpiringStock(days));
  electron.ipcMain.handle("stock:predictRupture", (_, referenceId) => stockService.predictStockRupture(referenceId));
  electron.ipcMain.handle("warehouse:getAll", () => warehouseService.getAll());
  electron.ipcMain.handle("warehouse:getById", (_, id) => warehouseService.getById(id));
  electron.ipcMain.handle("warehouse:create", (_, data) => warehouseService.create(data));
  electron.ipcMain.handle("warehouse:update", (_, { id, data }) => warehouseService.update(id, data));
  electron.ipcMain.handle("warehouse:delete", (_, id) => warehouseService.delete(id));
  electron.ipcMain.handle("inventory:getAll", () => inventoryService.getAll());
  electron.ipcMain.handle("inventory:getById", (_, id) => inventoryService.getById(id));
  electron.ipcMain.handle("inventory:create", (_, data) => inventoryService.create(data));
  electron.ipcMain.handle("inventory:start", (_, { id, user }) => inventoryService.startInventory(id, user));
  electron.ipcMain.handle("inventory:complete", (_, { id, user }) => inventoryService.completeInventory(id, user));
  electron.ipcMain.handle("inventory:cancel", (_, { id, user }) => inventoryService.cancelInventory(id, user));
  electron.ipcMain.handle("inventory:updateLine", (_, { inventoryId, stockId, countedQty, notes, user }) => inventoryService.updateLine(inventoryId, stockId, countedQty, notes, user));
  electron.ipcMain.handle("inventory:getReport", (_, id) => inventoryService.getInventoryReport(id));
  electron.ipcMain.handle("inventory:delete", (_, id) => inventoryService.delete(id));
  electron.ipcMain.handle("inventory:findByBarcode", (_, barcode) => inventoryService.findStockByBarcode(barcode));
  electron.ipcMain.handle("upload:image", async (_, formData) => {
    try {
      const { image, type } = formData;
      if (!image || !type) {
        throw new Error("Image and type are required");
      }
      const fileExtension = path__namespace.extname(image.originalFilename || "image.jpg");
      const filename = `${uuid.v4()}${fileExtension}`;
      const uploadDir = path__namespace.join(process.cwd(), "public", "images", type);
      if (!fs__namespace.existsSync(uploadDir)) {
        fs__namespace.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path__namespace.join(uploadDir, filename);
      const buffer = Buffer.from(await image.arrayBuffer());
      fs__namespace.writeFileSync(filePath, buffer);
      return {
        success: true,
        data: {
          filename,
          path: filePath
        }
      };
    } catch (error) {
      console.error("Image upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed"
      };
    }
  });
}
let splashWindow = null;
let mainWindow = null;
function createSplashWindow() {
  splashWindow = new electron.BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const splashContent = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Parfum Depot - Chargement...</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
          }

          .splash-container {
            text-align: center;
            color: white;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeIn 0.5s ease-in-out;
          }

          .logo {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .subtitle {
            font-size: 1.2rem;
            font-weight: 400;
            margin-bottom: 30px;
            opacity: 0.9;
          }

          .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
          }

          .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #fff, #e0e0e0);
            border-radius: 2px;
            animation: loading 2s ease-in-out infinite;
            width: 100%;
          }

          .loading-text {
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.8;
            animation: pulse 1.5s ease-in-out infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div class="splash-container">
          <div class="logo">Parfum Depot</div>
          <div class="subtitle">Gestion de Stock Professionnelle</div>
          <div class="loading-bar">
            <div class="loading-progress"></div>
          </div>
          <div class="loading-text">Chargement en cours...</div>
        </div>
      </body>
    </html>
  `;
  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashContent)}`);
  splashWindow.on("ready-to-show", () => {
    splashWindow?.show();
  });
}
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    setTimeout(() => {
      mainWindow?.show();
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
        splashWindow = null;
      }
    }, 1e3);
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.edenjomla.parfumdepot");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  registerIpcHandlers();
  createSplashWindow();
  setTimeout(() => {
    createWindow();
  }, 500);
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
