import axios from 'axios';
import qs from 'qs';

import {
  // User
  LOGIN_MOBILE,
  VERIFY_OTP,
  REGISTER_USER,
  SEEN_TUTORIAL,
  EDIT_PROFIEL,
  EDIT_PROFILE_INDIVIDUAL,
  EDIT_PROFILE_BUSINESS,
  GET_USER,
  GET_USER_PROFILE,
  GET_SUBSCRIPTION_PLAN,
  ADD_UBO,
  GET_PROPERTY_MANAGER,
  GET_BUILDERS,
  GET_CLIENTS,
  CHECK_KYC_STATUS,
  CHECK_CLIENT,
  DELETE_ACCOUNT,
  LOGOUT,
  BUILDER_REGISTER,
  SUBMIT_REFERRAL,
  // Jobs
  GET_ALL_JOBS,
  GET_JOB_DETAILS,
  CREATE_JOB,
  ACCEPT_REJECT_JOB,
  ADD_JOB_BY_JOBCODE,
  CANCEL_JOB,
  DELETE_JOB,

  //CHAT
  ADD_CHAT,
  UPLOAD_IMAGE,
  GET_ADMIN_EMPLOYEE,

  // Milestone
  GET_ALL_MILESTONE,
  CREATE_MILESTONE,
  SUBMIT_MILESTONE,
  ACCEPT_MILESTONES,
  UPDATE_MILESTONES,
  REVIEW_REQUEST,
  APPROVE_MILESTONE,
  ESCROW_MILESTONE,
  REJECT_WITHOUT_DISPUTE,
  GET_REJECTION_COMMENTS,
  RAISE_DISPUTE,
  UPDATE_CHAT,
  ACCEPT_REJECT_DECISION,
  DELETE_MILESTONES,

  //modification request
  CREATE_MODIFICATION_REQUEST,
  GET_MODIFICATION_REQUESTS,
  UPDATE_MODIFICATION_REQUESTS,
  BASE_URL,
  //work Progress
  GET_ALL_WORK_PROGRESS,
  ADD_WORK_PROGRESS,
  CHANGE_ISSUE_STATUS,
  UPDATE_IMAGES,

  //notifications
  GET_ALL_NOTIFICATION,
  MARK_AS_READ,
  CLEAR_ALL_NOTIFICATION,
  ADD_NOTIFICATION,
  EDIT_JOB,
  MANGOPAY,
  PENDING_MILESTONES,
  REMINDER_PAYMENT,
} from './urls';

export default class API {
  // User
  static async login(requestData) {
    console.log('base Url', BASE_URL);
    console.log('login Url', LOGIN_MOBILE);
    console.log('login Request', requestData);
    return await axios.post(LOGIN_MOBILE, requestData);
  }

  static async verifyOtp(requestData) {
    console.log('verifyOtp Url', VERIFY_OTP);
    console.log('verifyOtp Request', requestData);
    return await axios.post(VERIFY_OTP, requestData);
  }

  static async userRegister(requestData) {
    console.log('Send OTP', BUILDER_REGISTER);
    console.log('SEND OTP REQUEST', requestData);
    return await axios.post(BUILDER_REGISTER, requestData);
  }

  static async submitReferral(requestData) {
    console.log('SUBMIT_REFERRAL REQUEST', requestData);
    return await axios.post(SUBMIT_REFERRAL, requestData);
  }

  static async seenTutorial() {
    return await axios.put(SEEN_TUTORIAL);
  }

  static async registerUser(requestData) {
    console.log('registerUser Url', REGISTER_USER);
    console.log('registerUser Request', requestData);
    return await axios.post(REGISTER_USER, requestData);
  }

  static async editProfile(requestData) {
    console.log('editProfile Url', EDIT_PROFIEL);
    console.log('editProfile Request', requestData);
    return await axios.post(EDIT_PROFIEL, requestData);
  }
  static async editProfileIndividual(requestData) {
    console.log('editProfile Url', EDIT_PROFILE_INDIVIDUAL);
    console.log('editProfile Request', requestData);
    return await axios.post(EDIT_PROFILE_INDIVIDUAL, requestData);
  }
  static async editProfileBusiness(requestData) {
    console.log('editProfile Url', EDIT_PROFILE_BUSINESS);
    console.log('editProfile Request', requestData);
    return await axios.post(EDIT_PROFILE_BUSINESS, requestData);
  }
  static async getUser(requestData) {
    console.log('getUser Url', GET_USER);
    console.log('getUser Request', requestData);
    return await axios.post(GET_USER, requestData);
  }

  static async getUserProfile() {
    console.log('getUserProfile Url', GET_USER_PROFILE);
    return await axios.get(GET_USER_PROFILE);
  }

  static async getSubscriptionPlans() {
    console.log('getUserProfile Url', GET_SUBSCRIPTION_PLAN);
    return await axios.get(GET_SUBSCRIPTION_PLAN);
  }

  static async getPropertyManager(requestData) {
    console.log('getUserProfile Url', requestData);
    return await axios.post(GET_PROPERTY_MANAGER, requestData);
  }
  static async getBuilders(requestData) {
    console.log('getUserProfile Url', GET_BUILDERS, requestData);
    return await axios.post(GET_BUILDERS, requestData);
  }
  static async getClients(requestData) {
    console.log('getUserProfile Url', GET_CLIENTS, requestData);
    return await axios.post(GET_CLIENTS, requestData);
  }
  static async addUBO(requestData) {
    console.log('addUBO Url', ADD_UBO);
    return await axios.post(ADD_UBO, requestData);
  }
  static async deleteAccount(requestData) {
    console.log('getUserProfile Url', DELETE_ACCOUNT);
    return await axios.post(DELETE_ACCOUNT, requestData);
  }
  static async checkKYCvalidation() {
    return await axios.post(CHECK_KYC_STATUS);
  }
  static async checkRegisteredClient(requestData) {
    return await axios.post(CHECK_CLIENT, requestData);
  }
  static async logout(requestData) {
    console.log('logout Url', LOGOUT);
    return await axios.post(LOGOUT, requestData);
  }

  // Job
  static async getAllJobs(requestData) {
    console.log('getAllJobs Url', BASE_URL, GET_ALL_JOBS);
    console.log('getAllJobs Request', requestData);
    return await axios.post(GET_ALL_JOBS, requestData);
  }

  static async getJobDetails(requestData) {
    console.log('getJobDetails Url', GET_JOB_DETAILS);
    console.log('getJobDetails Request', requestData);
    return await axios.post(GET_JOB_DETAILS, requestData);
  }

  static async createJob(requestData) {
    console.log('createJob Url', CREATE_JOB);
    console.log('createJob Request', requestData);
    return await axios.post(CREATE_JOB, requestData);
  }
  static async editJob(requestData) {
    console.log('createJob Url', EDIT_JOB);
    console.log('createJob Request', requestData);
    return await axios.post(EDIT_JOB, requestData);
  }

  static async acceptORrejectJob(requestData) {
    console.log('Accept reject job  Url', ACCEPT_REJECT_JOB);
    console.log('Accept reject job Request', requestData);
    return await axios.post(ACCEPT_REJECT_JOB, requestData);
  }

  static async addJobByJobCode(requestData) {
    console.log('addJobByJobCode  Url', ADD_JOB_BY_JOBCODE);
    console.log('addJobByJobCode Request', requestData);
    return await axios.post(ADD_JOB_BY_JOBCODE, requestData);
  }

  static async cancelJob(requestData) {
    console.log('cancelJob  Url', CANCEL_JOB);
    console.log('cancelJob Request', requestData);
    return await axios.post(CANCEL_JOB, requestData);
  }

  static async deleteJob(requestData) {
    console.log('deleteJob  Url', DELETE_JOB);
    console.log('deleteJob Request', requestData);
    return await axios.post(DELETE_JOB, requestData);
  }

  // Milestone
  static async getAllMilestone(requestData) {
    console.log('getAllMilestone Url', GET_ALL_MILESTONE);
    console.log('getAllMilestone Request', requestData);
    return await axios.post(GET_ALL_MILESTONE, requestData);
  }

  static async createMilestone(requestData) {
    console.log('createMilestone Url', CREATE_MILESTONE);
    console.log('createMilestone Request', requestData);
    return await axios.post(CREATE_MILESTONE, requestData);
  }

  static async submitMilestone(requestData) {
    console.log('submitMilestone Url', SUBMIT_MILESTONE);
    console.log('submitMilestone Request', requestData);
    return await axios.post(SUBMIT_MILESTONE, requestData);
  }

  static async acceptMilestones(requestData) {
    console.log('acceptMilestone Url', ACCEPT_MILESTONES);
    console.log('acceptMilestone Request', requestData);
    return await axios.post(ACCEPT_MILESTONES, requestData);
  }

  static async updateMilestones(requestData) {
    console.log('updateMilestones Url', UPDATE_MILESTONES);
    console.log('updateMilestones Request', requestData);
    return await axios.post(UPDATE_MILESTONES, requestData);
  }

  static async deleteMilestone(requestData) {
    console.log('deleteMilestone Url', DELETE_MILESTONES);
    console.log('deleteMilestone Request', requestData);
    return await axios.post(DELETE_MILESTONES, requestData);
  }

  //modification request
  static async createModificationRequest(requestData) {
    console.log('createModificationRequest Url', CREATE_MODIFICATION_REQUEST);
    console.log('createModificationRequest Request', requestData);
    return await axios.post(CREATE_MODIFICATION_REQUEST, requestData);
  }

  static async getModificationRequest(requestData) {
    console.log('getModificationRequest Url', GET_MODIFICATION_REQUESTS);
    console.log('getModificationRequest Request', requestData);
    return await axios.post(GET_MODIFICATION_REQUESTS, requestData);
  }

  static async updateModificationRequest(requestData) {
    console.log('updateModificationRequest Url', UPDATE_MODIFICATION_REQUESTS);
    console.log('updateModificationRequest Request', requestData);
    return await axios.post(UPDATE_MODIFICATION_REQUESTS, requestData);
  }

  //Chat
  static async addChat(requestData) {
    console.log('addChat Url', ADD_CHAT);
    console.log('addChat Request', requestData);
    return await axios.post(ADD_CHAT, requestData);
  }
  static async getAdminAndEmployee() {
    console.log('getAdminAndEmployee Url', ADD_CHAT);
    return await axios.get(GET_ADMIN_EMPLOYEE);
  }

  static async uploadImage(requestData) {
    console.log('uploadImage Url', UPLOAD_IMAGE);
    console.log('uploadImage Request', requestData);
    return await axios.post(UPLOAD_IMAGE, requestData);
  }

  //Milestone
  static async getWorkProgressList(requestData) {
    console.log('getWorkProgressList Request', requestData);
    return await axios.post(GET_ALL_WORK_PROGRESS, requestData);
  }
  static async addWorkProgress(requestData) {
    console.log('getWorkProgressList Request', requestData);

    return await axios.post(ADD_WORK_PROGRESS, requestData);
  }
  static async updateIssueStatus(requestData) {
    console.log('getWorkProgressList Request', requestData);

    return await axios.post(CHANGE_ISSUE_STATUS, requestData);
  }
  static async updateImages(requestData) {
    console.log('update Request', requestData);
    return await axios.post(UPDATE_IMAGES, requestData);
  }
  static async milestoneReviewRequest(requestData) {
    console.log('milestoneReviewRequest Url', REVIEW_REQUEST);
    console.log('milestoneReviewRequest Request', requestData);
    return await axios.post(REVIEW_REQUEST, requestData);
  }
  static async milestoneCompleted(requestData) {
    console.log('milestoneCompleted Url', APPROVE_MILESTONE);
    console.log('milestoneCompleted Request', requestData);
    return await axios.post(APPROVE_MILESTONE, requestData);
  }
  static async milestoneStarted(requestData) {
    console.log('milestoneStarted Url', ESCROW_MILESTONE);
    console.log('milestoneStarted Request', requestData);
    return await axios.post(ESCROW_MILESTONE, requestData);
  }
  static async rejectMilestoneWithoutDispute(requestData) {
    console.log('rejectMilestoneWithoutDispute Url', REJECT_WITHOUT_DISPUTE);
    console.log('rejectMilestoneWithoutDispute Request', requestData);
    return await axios.post(REJECT_WITHOUT_DISPUTE, requestData);
  }
  static async getAllRejectCommentRequest(requestData) {
    console.log('getAllRejectCommentRequest Url', GET_REJECTION_COMMENTS);
    console.log('getAllRejectCommentRequest Request', requestData);
    return await axios.post(GET_REJECTION_COMMENTS, requestData);
  }
  static async raiseDispute(requestData) {
    console.log('raiseDispute Url', RAISE_DISPUTE);
    console.log('raiseDispute Request', requestData);
    return await axios.post(RAISE_DISPUTE, requestData);
  }
  static async updateDisputeChatDetail(requestData) {
    console.log('updateDisputeChatDetail Url', UPDATE_CHAT);
    console.log('updateDisputeChatDetail Request', requestData);
    return await axios.post(UPDATE_CHAT, requestData);
  }
  static async acceptRejectDecision(requestData) {
    console.log('acceptRejectDecision Url', ACCEPT_REJECT_DECISION);
    console.log('acceptRejectDecision Request', requestData);
    return await axios.post(ACCEPT_REJECT_DECISION, requestData);
  }
  static async pendingNextPaymentStage(requestData) {
    console.log('pendingNextPaymentStage Url', PENDING_MILESTONES);
    console.log('pendingNextPaymentStage Request', requestData);
    return await axios.put(PENDING_MILESTONES, requestData);
  }
  static async reminderForPayment(requestData) {
    console.log('reminderForPayment Url', REMINDER_PAYMENT);
    console.log('reminderForPayment Request', requestData);
    return await axios.put(REMINDER_PAYMENT, requestData);
  }

  //Notification
  static async getNotification(requestData) {
    console.log('getUserProfile Url', GET_ALL_NOTIFICATION, requestData);
    return await axios.post(GET_ALL_NOTIFICATION, requestData);
  }
  static async markNotificationAsRead(requestData) {
    console.log('getUserProfile Url', MARK_AS_READ, requestData);
    return await axios.post(MARK_AS_READ, requestData);
  }

  static async clearAllNotifications(requestData) {
    return await axios.post(CLEAR_ALL_NOTIFICATION, requestData);
  }
  static async addNotification(requestData) {
    return await axios.post(ADD_NOTIFICATION, requestData);
  }

  //Mangopay
  static async registerCardMangopay(url, requestData) {
    return await axios.post(url, requestData, {
      headers: {Authorization: MANGOPAY.AUTH},
    });
  }

  static async getCardToken(url, requestData) {
    console.log(requestData, '==========');
    console.log(url, '==========');
    return await axios.post(url, qs.stringify(requestData));
  }

  static async updateCard(url, requestData) {
    return await axios.put(url, requestData, {
      headers: {Authorization: MANGOPAY.AUTH},
    });
  }

  static async getCard(url) {
    return await axios.get(url, {headers: {Authorization: MANGOPAY.AUTH}});
  }

  static async getBankAccount(url) {
    return await axios.get(url, {headers: {Authorization: MANGOPAY.AUTH}});
  }

  //TrueLayer
  static async generateTrueLayerToken(url, requestData) {
    console.log('generateTrueLayerToken Url', url);
    console.log('generateTrueLayerToken Request', requestData);
    return await axios.post(url, requestData);
  }

  static async singleImmediatePayment(url, requestData, token) {
    console.log('singleImmediatePayment Url', url);
    console.log('singleImmediatePayment Request', requestData);
    return await axios.post(url, requestData, {
      headers: {Authorization: token},
    });
  }
}
