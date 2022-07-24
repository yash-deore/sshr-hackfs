import { CeramicClient } from "@ceramicnetwork/http-client";

export const CHAIN = "mumbai"

export const API_URL = "https://ceramic-clay.3boxlabs.com";
//export const MESSENGER_URL = "http://localhost:3001";
export const MESSENGER_URL = "https://xmtp-humanfs-mikepsinn.vercel.app";

const PATIENT_BASIC_INFORMATION =
  "ceramic://k3y52l7qbv1fryb4jsy2lh9ppgfvzn7opmzhmcy4remy5gcagydltb6bkyt9j58n4";
const PATIENT_BASIC_DEFINITION =
  "k3y52l7qbv1fryijn6j2t49khorxu1wfmzlhkmp2rof5xt5e5d5iyc92tm8aoqpkw";

const PATIENT_PERSONAL_INFORMATION =
  "ceramic://k3y52l7qbv1fryla5pix66t31k9vv1ei2byym3zh47lbrab8rnm5fghko2p49jjls";
const PATIENT_PERSONAL_DEFINITION =
  "k3y52l7qbv1fryqdnnzx6zv4arcmmav0tfeyqgwmrg7oy3e7vj0hp7lpu0v9lxzi8";

const PATIENT_MEDICAL_INFORMATION =
  "ceramic://k3y52l7qbv1fryc8atwt743xa8epcapgjmy1lj6l2vq5vbmotq08pxmftknsp7ytc";
const PATIENT_MEDICAL_DEFINITION =
  "k3y52l7qbv1frxwph8vksd841hts3lpyktvucn3upk3u5i1f0pzv9uy77cu769m2o";

const PATIENT_DATA_SHARE =
  "ceramic://k3y52l7qbv1fryoya5ieztbsm2k0ulyh2cyke29eh7uso2p3shx2n96n556vcer5s";
const PATIENT_DATA_SHARE_DEFINITION =
  "k3y52l7qbv1fryixhztq0znzyzbbwgvxgf795ncxzonfh3mtx4u2gvs5trg1380sg";

export const aliases = {
  schemas: {
    PatientBasicInformation: PATIENT_BASIC_INFORMATION,
    PatientPersonalInformation: PATIENT_PERSONAL_INFORMATION,
    PatientMedicalInformation: PATIENT_MEDICAL_INFORMATION,
    PatientDataShare: PATIENT_DATA_SHARE,
  },
  definitions: {
    patientBasicInformation: PATIENT_BASIC_DEFINITION,
    patientPersonalInformation: PATIENT_PERSONAL_DEFINITION,
    patientMedicalInformation: PATIENT_MEDICAL_DEFINITION,
    patientDataShare: PATIENT_DATA_SHARE_DEFINITION,
  },
  tiles: {},
};

export const ceramic = new CeramicClient(API_URL);
