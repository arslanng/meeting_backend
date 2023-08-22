"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _graphqlrequest = require('graphql-request');
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config();

const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};

exports. default = new (0, _graphqlrequest.GraphQLClient)(
  "https://meeting-app-server.hasura.app/v1/graphql",
  {
    headers,
  }
);
