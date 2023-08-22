export const GET_MEETING_PARTICIPANTS = `
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
`;
