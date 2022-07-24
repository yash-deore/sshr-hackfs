import { Button, createStyles } from "@mantine/core";
import { useAccount } from "wagmi";
import { useGlobalContext } from "../global/store";
import { PatientInformation } from "./patient-information";
import { NewPatient } from "./new-patient";
import { authenticateAndGetData } from "../functions/authenticateAndGetData";

const useStyles = createStyles((theme) => ({
  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    marginBottom: theme.spacing.lg,
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      height: 42,
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));



export function CeramicConnect() {
  const { classes } = useStyles();
  const { data } = useAccount();

  const [globalStore, setGlobalStore] = useGlobalContext();

  async function connectIdentityCeramic() {
    const authData = await authenticateAndGetData();
    const { authenticate, PBI, PPI, PMI, PSI } = authData;

    setGlobalStore({
      authenticated: authenticate,
      patientBasic: PBI,
      patientPersonal: PPI,
      patientMedical: PMI,
      patientShares: PSI,
    });
  }

  function DisplayPatient() {
    const { authenticated, patientBasic, patientPersonal, patientMedical } =
      globalStore;
    if (authenticated) {
      //initializeChat();
      if (patientBasic === null || patientPersonal === null)
        return <NewPatient />;
      else {
        const { name, gender, dateOfBirth, maritalStatus } = patientBasic;
        const { countryCode, phoneNumber, emailAddress } = patientPersonal;
        const {
          allergies,
          currentMedications,
          symptoms,
          progressNotes,
          vitalSigns,
        } = patientMedical;
        let completePhoneNumber = phoneNumber;
        if(countryCode){ // Fix NaN in Phone number
          completePhoneNumber = countryCode + " " + phoneNumber;
        }
        const dateConversion = new Date(dateOfBirth);
        const convertedDateOfBirth = dateConversion.toString().substring(4, 15);

        return (
          <PatientInformation
            name={name}
            gender={gender}
            date={convertedDateOfBirth}
            maritalStatus={maritalStatus}
            phone={completePhoneNumber}
            mail={emailAddress}
            allergies={allergies}
            currentMedications={currentMedications}
            symptoms={symptoms}
            progressNotes={progressNotes}
            vitalSigns={vitalSigns}
          />
        );
      }
    }
  }

  function CeramicConnectButton() {
    if (globalStore.authenticated === false)
      return (
        <Button
          className={classes.control}
          size="lg"
          onClick={connectIdentityCeramic}
        >
          Connect Identity
        </Button>
      );
  }

  if (data) {
    return (
      <div>
        <div className={classes.controls}>{CeramicConnectButton()}</div>

        {DisplayPatient()}
      </div>
    );
  }
}
