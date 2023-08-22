"use strict";Object.defineProperty(exports, "__esModule", {value: true}); const GET_MEETING_PARTICIPANTS = `
query meeting_participant($id: Int!) {
    meetings_by_pk(id: $id) {
      title
      user {
        fullName
      }
      participants {
        user {
          email
        }
      }
    }
  }
`; exports.GET_MEETING_PARTICIPANTS = GET_MEETING_PARTICIPANTS;
