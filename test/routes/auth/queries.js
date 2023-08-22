"use strict";Object.defineProperty(exports, "__esModule", {value: true});// Kullanıcının varlığını sorgulayan query
 const IS_EXIST_USER = `
  query isExist($email: String!) {
    users(where: {email: {_eq: $email}}) {
      id
    }
  }
`; exports.IS_EXIST_USER = IS_EXIST_USER;

// Kullanıcı ekleyen mutation
 const INSERT_USER_MUTATION = `
  mutation insertUser ($input: users_insert_input!){
    insert_users_one(object: $input) {
      id
      email
    }
  }
`; exports.INSERT_USER_MUTATION = INSERT_USER_MUTATION;

 const LOGIN_QUERY = `
  query login($email: String!) {
    users(
      where: {
        email: {
          _eq: $email
        }
      }
      limit: 1
    ){
      id
      email
      password
    }
  }
`; exports.LOGIN_QUERY = LOGIN_QUERY;
