import { encodeString } from '../utils/Globals';

// export const BASE_URL = 'https://api-pongopay.herokuapp.com/api/v1/';
export const MANGOPAY = {
  URL: 'https://api.mangopay.com/v2.01/pongopaymentsltdprod/',
  CLIENT_ID: 'pongopaymentsltdprod',
  API_KEY: 'K9ErenrQ5Rn3JD8Fqz882OiHEdNXwuxa4XE3U3gJhviFq3JwfX',
  AUTH: `Basic ${encodeString(
    'pongopaymentsltdprod:K9ErenrQ5Rn3JD8Fqz882OiHEdNXwuxa4XE3U3gJhviFq3JwfX',
  )}`,
};

export const BASE_URL = 'https://api-pongopay-beta.herokuapp.com/api/v1';
// export const MANGOPAY = {
//   URL: 'https://api.mangopay.com/v2.01/pongopaymentsltdprod/',
//   CLIENT_ID: 'pongopaymentsltdprod',
//   API_KEY: 'K9ErenrQ5Rn3JD8Fqz882OiHEdNXwuxa4XE3U3gJhviFq3JwfX',
//   AUTH: `Basic ${encodeString(
//     'pongopaymentsltdprod:K9ErenrQ5Rn3JD8Fqz882OiHEdNXwuxa4XE3U3gJhviFq3JwfX',
//   )}`,
// };

// export const BASE_URL = 'http://192.168.0.11:5000/api/v1';
// export const MANGOPAY = {
//   URL: 'https://api.sandbox.mangopay.com/v2.01/nimble-prachi/',
//   CLIENT_ID: 'nimble-prachi',
//   API_KEY: 'vJNVaNa579KKLFYdwMo4uKcRbQHt7qAxeiXu8OcQ3Dza1kbO3x',
//   AUTH: `Basic ${encodeString(
//     'nimble-prachi:vJNVaNa579KKLFYdwMo4uKcRbQHt7qAxeiXu8OcQ3Dza1kbO3x',
//   )}`,
// };

// export const BASE_URL = 'https://api-pongopay-beta.herokuapp.com/api/v1';
// export const MANGOPAY = {
//   URL: 'https://api.sandbox.mangopay.com/v2.01/nimble-prachi/',
//   CLIENT_ID: 'nimble-prachi',
//   API_KEY: 'vJNVaNa579KKLFYdwMo4uKcRbQHt7qAxeiXu8OcQ3Dza1kbO3x',
//   AUTH: `Basic ${encodeString(
//     'nimble-prachi:vJNVaNa579KKLFYdwMo4uKcRbQHt7qAxeiXu8OcQ3Dza1kbO3x',
//   )}`,
// };


const USER = '/user';
export const LOGIN_MOBILE = USER + '/loginWithMobile';
export const VERIFY_OTP = USER + '/verifyOtp';
export const REGISTER_USER = USER + '/registerUser';
export const BUILDER_REGISTER = USER + '/register';
export const SEEN_TUTORIAL = USER + '/seenTutorial';
export const EDIT_PROFIEL = USER + '/editProfile';
export const EDIT_PROFILE_INDIVIDUAL = USER + '/editProfileIndividual';

export const SUBMIT_REFERRAL = USER + '/referral/apply';

export const EDIT_PROFILE_BUSINESS = USER + '/editProfileBusiness';

export const GET_USER = USER + '/getUser';
export const GET_USER_PROFILE = USER + '/getUserProfile';
export const GET_SUBSCRIPTION_PLAN = USER + '/getSubscriptionPlan';
export const ADD_UBO = USER + '/addBusinessUBO';
export const GET_PROPERTY_MANAGER = USER + '/getMyPropertyManagers';
export const GET_BUILDERS = USER + '/getMyBuilders';
export const GET_CLIENTS = USER + '/getMyClients';
export const GET_ADMIN_EMPLOYEE = USER + '/getAdminAndEmployee';
export const DELETE_ACCOUNT = USER + '/deleteAccount';
export const CHECK_KYC_STATUS = USER + '/checkKYCvalidation';
export const CHECK_CLIENT = USER + '/checkRegisteredClient';
export const LOGOUT = USER + '/logout';

// Job
const JOBS = '/jobs';
export const GET_ALL_JOBS = JOBS + '/getAllJobs';
export const GET_JOB_DETAILS = JOBS + '/getJobDetails';
export const CREATE_JOB = JOBS + '/createJob';
export const EDIT_JOB = JOBS + '/editJob';

export const ACCEPT_REJECT_JOB = JOBS + '/acceptRejectJob';
export const ADD_JOB_BY_JOBCODE = JOBS + '/addJobByJobCode';
export const CANCEL_JOB = JOBS + '/cancelJob';
export const DELETE_JOB = JOBS + '/deleteJob';

//Chat
export const ADD_CHAT = JOBS + '/addChat';
export const UPLOAD_IMAGE = JOBS + '/uploadImages';

// Milestone
const MILESTONE = '/milestone';
export const GET_ALL_MILESTONE = MILESTONE + '/getAllMilestone';
export const CREATE_MILESTONE = MILESTONE + '/createMilestone';
export const SUBMIT_MILESTONE = MILESTONE + '/submitMilestone';
export const ACCEPT_MILESTONES = MILESTONE + '/acceptMilestone';
export const UPDATE_MILESTONES = MILESTONE + '/updateMilestone';
export const REVIEW_REQUEST = MILESTONE + '/milestoneReviewRequest';
export const APPROVE_MILESTONE = MILESTONE + '/milestoneCompleted';
export const ESCROW_MILESTONE = MILESTONE + '/milestoneStarted';
export const REJECT_WITHOUT_DISPUTE =
  MILESTONE + '/rejectMilestoneWithoutDispute';
export const DELETE_MILESTONES = MILESTONE + '/deleteMilestone';
export const PENDING_MILESTONES = MILESTONE + '/pending';
export const REMINDER_PAYMENT = MILESTONE + '/reminder';

// Dispute
const DISPUTE = '/disputeMilestone';
export const RAISE_DISPUTE = DISPUTE + '/raiseDispute';
export const UPDATE_CHAT = DISPUTE + '/updateDisputeChatDetail';
export const ACCEPT_REJECT_DECISION = DISPUTE + '/acceptRejectDecision';

//modification request
const MODIFICATION_REQUEST = '/modificationRequest';
export const CREATE_MODIFICATION_REQUEST =
  MODIFICATION_REQUEST + '/createModificationRequest';
export const GET_MODIFICATION_REQUESTS =
  MODIFICATION_REQUEST + '/getModificationRequest';
export const UPDATE_MODIFICATION_REQUESTS =
  MODIFICATION_REQUEST + '/updateModificationRequest';

//Work progress
const WORK_PROGRESS = '/workProgress';
export const GET_ALL_WORK_PROGRESS = WORK_PROGRESS + '/getWorkProgressIssues';
export const ADD_WORK_PROGRESS = WORK_PROGRESS + '/addWorkProgress';
export const UPDATE_IMAGES = WORK_PROGRESS + '/addWorkProgressImages';
export const CHANGE_ISSUE_STATUS = WORK_PROGRESS + '/updateIssueStatus';

//Rejection comments
const REJECTION_COMMENTS = '/rejectComments';
export const GET_REJECTION_COMMENTS =
  REJECTION_COMMENTS + '/getAllRejectCommentRequest';

// Notifications
const NOTIFICATIONS = '/allNotification';
export const GET_ALL_NOTIFICATION = NOTIFICATIONS + '/getAllNotification';
export const MARK_AS_READ = NOTIFICATIONS + '/markOneAsRead';
export const CLEAR_ALL_NOTIFICATION = NOTIFICATIONS + '/deleteNotification';
export const ADD_NOTIFICATION = NOTIFICATIONS + '/addNotification';
