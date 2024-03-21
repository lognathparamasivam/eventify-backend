export default Object.freeze({
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  ERROR_MESSAGES: {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "RESOURCE_NOT_FOUND",
    500: "INTERNAL_SERVER_ERROR",
  },
  EVENT_VALID_PARAMS: ['title','startDate'],
  DEFAULT_QUERY_PARAMS: ["limit", "offset", "sortby"],
  INVITATION_VALID_PARAMS: ['eventId','userId'],
  FEEDBACKS_VALID_PARAMS: ['eventId','userId'],


});
