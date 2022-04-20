import color from './color';
import Globals from './Globals';

export const getJobStatus = value => {
  let jobStatus = '';
  let jobColor = '';
  let jobImage = '';
  switch (value) {
    case 0:
      jobStatus = 'Incomplete Payment Stages'; // green
      jobColor = color.LightBlue;
      jobImage = 'information';
      break;
    case 1:
      // jobStatus = "New Job Request" // green
      jobStatus = 'New Job Invitation'; // green
      jobColor = color.LightBlue;
      jobImage = 'check';
      break;
    case 2:
      jobStatus = Globals.isBuilder ? 'Waiting For Client To Accept Job' : 'Waiting For You to Accept Job'; // green
      jobColor = color.LightBlue;
      jobImage = 'check';
      break;
    // case 3:
    //   jobStatus = 'Waiting To Fund Deposit Box'; // green
    //   jobColor = color.Green;
    //   jobImage = 'check';
    //   break;
    case 3:
      jobStatus = Globals.isBuilder ? 'Waiting For Client To Fund Deposit Box' : 'Waiting For You To Fund Deposit Box'; // green
      jobColor = color.LightBlue;
      jobImage = 'check';
      break;

    // case 4:
    //   jobStatus = 'Job Ongoing'; // green
    //   jobColor = color.Green;
    //   jobImage = 'check';
    //   break;

    case 4:
      jobStatus = 'Payment In Deposit Box'; // green
      jobColor = color.LightBlue;
      jobImage = 'check';
      break;

    case 5:
      jobStatus = 'The Client Has Rejected Your Job Request'; // red
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;
    case 6:
      jobStatus = 'In Dispute';
      jobColor = color.Red;
      jobImage = 'check';
      break;
    case 7:
      jobStatus = 'Job Complete'; // red
      jobColor = color.Green;
      jobImage = 'exclamation';
      break;
    // case 7:
    //   jobStatus = 'Paid'; // red
    //   jobColor = color.Green;
    //   jobImage = 'exclamation';
    //   break;

    case 8:
      jobStatus = 'Resolved Dispute'; // red
      jobColor = color.Green;
      jobImage = 'exclamation';
      break;
    case 9:
      jobStatus = 'Dormant'; // gray
      jobColor = color.Grey;
      jobImage = '';
      break;
    case 10:
      jobStatus = 'Cancelled'; // gray
      jobColor = color.Red;
      jobImage = '';
      break;
    case 11:
      jobStatus = 'In Arbitration'; // red
      jobColor = color.Grey;
      jobImage = 'exclamation';
      break;
    case 12:
      jobStatus = 'The Tradesperson Has Created Cancellation Request'; // red
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;
    case 13:
      jobStatus = 'The Client Has Created Cancellation Request'; // red
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;
    case 14:
      jobStatus = 'Cancellation Request Accepted'; // red
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;
    case 15:
      jobStatus = 'Processing Deposit'; // red
      jobColor = color.DarkBlue;
      jobImage = 'exclamation';
      break;
    //  case 15:
    // jobStatus = 'Payment Confirmation Pending'; // red
    // jobColor = color.DarkBlue;
    // jobImage = 'exclamation';
    // break;
    // case 16:
    //   jobStatus = 'Payment Is Rejected By Payment Gateway'; // red
    //   jobColor = color.Red;
    //   jobImage = 'exclamation';
    //   break;
    case 16:
      jobStatus = Globals.isBuilder ? 'Client Card Payment Failed' : 'Payment Rejected'; // red
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;
    case 17:
      jobStatus = 'The Tradesperson Has Rejected Your Job Request'; // red
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;
    case 18:
      jobStatus = 'Waiting For Tradesperson To Add Payment Information';
      jobColor = color.LightBlue;
      jobImage = 'exclamation';
      break;
    case 19:
      jobStatus = 'Client has requested a change to the proposal';
      jobColor = color.LightBlue;
      jobImage = 'exclamation';
      break;
    case 20:
      jobStatus = 'On-Hold';
      jobColor = color.Grey;
      jobImage = 'exclamation';
      break;
    case 21:
      jobStatus = Globals.isBuilder ? "Waiting For Client to Fund Next Payment Stage" : "Waiting For You to Fund Next Payment Stage";
      jobColor = color.LightBlue;
      jobImage = 'exclamation';
      break;
    case 22:
      jobStatus = 'Ready To Submit';
      jobColor = color.DarkBlue;
      jobImage = 'exclamation';
      break;
    case 23:
      jobStatus = 'Payment Release Requested';
      jobColor = color.DarkBlue;
      jobImage = 'exclamation';
      break;

    case 24:
      jobStatus = 'Proccessing Payment Release';
      jobColor = color.DarkBlue;
      jobImage = 'exclamation';
      break;

    case 25:
      jobStatus = Globals.isBuilder ? 'The Client Has Requested Further Action' : "Further Action Requested";
      jobColor = color.Red;
      jobImage = 'exclamation';
      break;

    default:
      jobStatus = 'Incomplete Payment Stages'; // blue
      jobColor = color.LightBlue;
      jobImage = 'information';
      break;
  }
  return [jobStatus, jobColor, jobImage];
};

export const getMilestoneStatus = value => {
  let milestoneStatus = '';
  let milestone = {
    // milestoneStatus: "",
    // milestoneColor: "",
    // milestoneImage: ""
  };
  switch (value) {
    case 1:
      milestone.milestoneStatus = 'Upcoming'; // green
      milestone.milestoneColor = color.WHITE;
      milestone.milestoneImage = '';
      milestone.TextColor = color.LightBlue;
      milestone.BuilderDescription = 'This payment stage has not yet begun.';
      milestone.ClientDescription = 'This payment stage has not yet begun.';
      break;
    case 2:
      milestone.milestoneStatus = 'Payment In Deposit Box'; // green
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = 'exclamation';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Good news! Payment is now in the Safe Deposit Box. Please complete work as agreed.';
      milestone.ClientDescription =
        'Good news! Your payment is now in the Safe Deposit Box and work can begin.';
      break;
    case 3:
      // milestone.milestoneStatus = "Payment Requested" //
      milestone.milestoneStatus = 'Payment Release Requested'; //
      milestone.milestoneColor = color.WHITE;
      milestone.milestoneImage = '';
      milestone.TextColor = color.LightBlue;
      milestone.BuilderDescription =
        'Waiting for client to release funds from the Safe Deposit Box.';
      milestone.ClientDescription =
        'Your Tradesperson has requested you release funds for this payment stage. Please review the work and release funds from the Safe Deposit Box.';
      break;
    case 4:
      // milestone.milestoneStatus = "Paid to Tradesperson" // gray
      milestone.milestoneStatus =
        Globals.isBuilder ? 'Payment Stage Paid. Waiting For Client To Fund Next Payment Stage.' : 'Payment Stage Paid. Waiting For You To Fund Next Payment Stage.'; // gray
      // milestone.milestoneStatus =
      //   Globals.isBuilder ? 'Payment Stage X Paid. Waiting For Client To Fund Payment Stage Z.' : 'Payment Stage X Paid. Waiting For You To Fund Payment Stage Z.'; // gray
      milestone.milestoneColor = color.Green;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Complete! Swipe left to view next payment stage. / Your client has not yet transferred funds into the Safe Deposit Box.';
      milestone.ClientDescription =
        "Complete! Swipe left to view next payment stage. / It's time to fund the Safe Deposit Box.";
      break;
    case 5:
      milestone.milestoneStatus = Globals.isBuilder ? 'The Client Has Requested Further Action' : "Further Action Requested"; // red
      milestone.milestoneColor = color.Red;
      milestone.milestoneImage = 'exclamation';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Your client has requested further action. Please contact them to resolve this so the payment can be released.';
      milestone.ClientDescription =
        'Please contact your tradesperson to resolve the request.';
      break;
    case 6:
      milestone.milestoneStatus = 'A Dispute Has Been Raised'; // red
      milestone.milestoneColor = color.Red;
      milestone.milestoneImage = 'exclamation';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'A PongoPay mediator will be in touch to help resolve your dispute.';
      milestone.ClientDescription =
        'A PongoPay mediator will be in touch to help resolve your dispute.';
      break;
    case 7:
      milestone.milestoneStatus = 'A Dispute Has Been Resolved'; // red
      milestone.milestoneColor = color.Green;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription = '';
      milestone.ClientDescription = '';
      break;
    case 8:
      // BG
      // milestone.milestoneStatus = "Deposit Payment In-Process" // red
      milestone.milestoneStatus = 'Processing Deposit'; // red
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        "Your client's payment is being processed and will soon be in the Safe Deposit Box.";
      milestone.ClientDescription =
        'Your payment is being processed and will soon be in the Safe Deposit Box.';
      break;
    case 9:
      // milestone.milestoneStatus = "Payment Is Rejected By Payment Gateway	" // red
      milestone.milestoneStatus = Globals.isBuilder ? "Client Card Payment Failed" : 'Payment Rejected. Please Contact Us On 01334 806113.'; // red
      milestone.milestoneColor = color.Red;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription = 'Your client has tried initializing a card payment but failed. Waiting for client to retry.';
      milestone.ClientDescription = 'Your card payment has failed. Please retry or use a different payment method.';
      break;
    case 10:
      // milestone.milestoneStatus = "Waiting for Client to make payment" // red
      // milestone.milestoneStatus = 'Waiting For Client To Fund Deposit Box'; // red
      milestone.milestoneStatus = Globals.isBuilder ? 'Waiting For Client To Fund Deposit Box' : 'Waiting For You To Fund Deposit Box';
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Your client has not yet transferred funds into the Safe Deposit Box.';
      milestone.ClientDescription = "Please now fund the deposit box. Once your builder completes each stage, you’ll have 24 hours to review work and either release funds or request changes.";
      break;
    case 11:
      milestone.milestoneStatus = Globals.isBuilder ? "Client Card Payment Failed" :'Card Payment Failed'; // red
      milestone.milestoneColor = color.Red;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription = 'Your client has tried initializing a card payment but failed. Waiting for client to retry.';
      milestone.ClientDescription = 'Your card payment has failed. Please retry or use a different payment method.';
      break;
    case 12:
      milestone.milestoneStatus = 'Ready To Submit';
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription = '';
      milestone.ClientDescription = '';
      break;
    case 13:
      milestone.milestoneStatus = 'Proccessing Payment Release';
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Success! Your client has released the funds. Payments are processed each day at 10:00am and 4:00pm Mon-Fri.';
      milestone.ClientDescription =
        'Your payment has been released and is being processed.';
      break;
    case 14:
      milestone.milestoneStatus = 'Payment Release Failed';
      milestone.milestoneColor = color.Red;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription = '';
      milestone.ClientDescription = '';
      break;
    case 15:
      milestone.milestoneStatus = 'Job Complete';
      milestone.milestoneColor = color.Red;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Congratulations! This job is now complete.';
      milestone.ClientDescription =
        'Congratulations! This job is now complete.';
      break;
    case 16:
      milestone.milestoneStatus = Globals.isBuilder ? 'Waiting For Client Approval' : 'Waiting For Your Approval';
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = 'check';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Your client has not yet approved the job.';
      milestone.ClientDescription =
        "It's time to approve the job.";
      break;
    default:
      // milestone.milestoneStatus = "Waiting for Client to Accept Job" // blue
      milestone.milestoneStatus = 'Incomplete Payment Stages'; // blue
      milestone.milestoneColor = color.LightBlue;
      milestone.milestoneImage = '';
      milestone.TextColor = color.WHITE;
      milestone.BuilderDescription =
        'Please make sure that your payment stages add up to the total job amount.';
      milestone.ClientDescription = '';
      break;
  }
  return milestone;
};

export const getAcceptRejectStatus = value => {
  let acceptRejectStatus = '';
  switch (value) {
    case 1:
      acceptRejectStatus = 'Accept'; // green
      break;
    case 2:
      acceptRejectStatus = 'Reject'; // red
      break;
    default:
      acceptRejectStatus = 'Pending'; // blue
      break;
  }
  return acceptRejectStatus;
};

export const getModificationStatus = value => {
  let status = '';
  switch (value) {
    case 0:
      status = 'Pending'; // green
      break;
    case 1:
      status = 'Accepted'; // green
      break;
    case 2:
      status = 'Rejected'; // red
      break;
    default:
      status = 'Pending'; // blue
      break;
  }
  return status;
};

export const getStatus = value => {
  let status = '';
  switch (value) {
    case 1:
      status = 'Enable';
      break;
    case 2:
      status = 'Reject'; // red
      break;
    default:
      status = 'Delete';
      break;
  }
  return status;
};

export const getJobAmount = jobDetails => {
  if (Globals.isBuilder && jobDetails.nJobBuilderAmount) {
    return jobDetails.nJobBuilderAmount;
  } else {
    return jobDetails.nJobAmount;
  }
};

export const getKycStatus = kycStatus => {
  let status = '';
  switch (kycStatus) {
    case 'VALIDATION_ASKED':
      status = 'Submitted';
      break;
    case 'VALIDATED':
      status = 'Approved';
      break;
    case 'REFUSED':
      status = 'Rejected';
      break;
    case 'OUT_OF_DATE':
      status = 'Document Expired';
      break;
    default:
      status = kycStatus;
      break;
  }
  return status;
};

/** Milestone status
 * PENDING: 0,
    APPROVED: 1,
    ON_GOING: 2,
    WORK_REVIEW_REQUEST: 3,
    COMPLETED: 4,
    REJECT_WITHOUT_DISPUTE: 5,
    DISPUTE: 6,
    RESOLVED_DISPUTE: 7,
    PAYMENT_PROCESSING: 8, / when payment is done bt is not accepted/rejected by mangopay  /
    PAYMENT_REJECTED: 9, / when payment is done bt rejected by mangopay  /
    AWAITING_PAYMENT: 10, / when job is accepted but escrow payment pending /
    CARD_PAYMENT_FAILED: 11  / when job is accepted but card payment failed /
 */
