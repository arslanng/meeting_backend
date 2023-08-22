"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _joi = require('joi'); var _joi2 = _interopRequireDefault(_joi);

 const registerSchema = _joi2.default.object({
  email: _joi2.default.string().email().required(),
  name: _joi2.default.string().min(1).max(60).required(),
  surname: _joi2.default.string().min(1).max(60).required(),
  password: _joi2.default.string().min(6).max(60).required(),
}); exports.registerSchema = registerSchema;

 const loginSchema = _joi2.default.object({
  email: _joi2.default.string().email().required(),
  password: _joi2.default.string().min(6).max(60).required(),
}); exports.loginSchema = loginSchema;
