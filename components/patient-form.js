import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useGlobalContext } from "../global/store";
import {
  Button,
  createStyles,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { ceramic, aliases } from "../constants";
import { auth } from "../functions/authenticate";
import { DIDDataStore } from "@glazed/did-datastore";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { authenticateAndGetData } from "../functions/authenticateAndGetData";
import { AlertCircle, Check } from "tabler-icons-react";
import RichTextEditor from "./rich-text-editor";
import { DropzoneButton } from "./file-upload-dropzone";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));

export default function PatientForm() {
  const dataStore = new DIDDataStore({ ceramic, model: aliases });
  const { classes } = useStyles();
  const router = useRouter();
  const [globalStore, setGlobalStore] = useGlobalContext();
  const [allergies, setAllergies] = useState([]);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [respiratoryRate, setRespiratoryRate] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [progressNotes, setProgressNotes] = useState("");

  const form = useForm({
    initialValues: {
      name: "",
      gender: "",
      dateOfBirth: "",
      maritalStatus: "",
      countryCode: "",
      phoneNumber: "",
      emailAddress: "",
      weight: "",
      height: "",
      temperature: "",
      // respiratoryRate: 0,
      // heartRate: 0,
      bloodPressurePosition: "",
      systolicBloodPressure: "",
      diastolicBloodPressure: "",
      // progressNotes: "",
    },

    validate: {
      phoneNumber: (value) =>
        value.toString().length === 10 ? null : "Invalid Phone Number",
      emailAddress: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
    },
  });

  const handleSubmit = async (values) => {
    const {
      name,
      gender,
      dateOfBirth,
      maritalStatus,
      countryCode,
      phoneNumber,
      emailAddress,
      weight,
      height,
      temperature,
      // respiratoryRate,
      // heartRate,
      bloodPressurePosition,
      systolicBloodPressure,
      diastolicBloodPressure,
    } = values;

    const patientBasicInfo = {
      name,
      gender,
      dateOfBirth,
      maritalStatus,
    };

    const patientPersonalInfo = {
      countryCode: countryCode.toString(),
      phoneNumber: phoneNumber.toString(),
      emailAddress,
    };

    const bloodPressure = {
      position: `${
        bloodPressurePosition === null ? "" : bloodPressurePosition
      }`,
      measurement: {
        systolic: systolicBloodPressure === "" ? 0 : systolicBloodPressure,
        diastolic: diastolicBloodPressure === "" ? 0 : diastolicBloodPressure,
      },
    };

    console.log(bloodPressure);

    const vitalSigns = {
      weight,
      height,
      temperature,
      respiratoryRate,
      heartRate,
      bloodPressure,
    };

    const patientMedicalInfo = {
      allergies,
      currentMedications,
      symptoms,
      progressNotes,
      vitalSigns,
    };

    try {
      await auth();
      await dataStore.set("patientBasicInformation", patientBasicInfo);
      await dataStore.set("patientPersonalInformation", patientPersonalInfo);
      await dataStore.set("patientMedicalInformation", patientMedicalInfo);

      setGlobalStore({
        ...globalStore,
        patientBasic: patientBasicInfo,
        patientPersonal: patientPersonalInfo,
        patientMedical: patientMedicalInfo,
      });

      showNotification({
        color: "teal",
        title: "Data Edited Successfully",
        message: "Patient's information updated",
        icon: <Check />,
        autoClose: 3000,
      });

      router.push("/profile", null, { shallow: true });
    } catch (err) {
      console.log(err);
      showNotification({
        color: "red",
        title: "Error while editing",
        message: "Patient's information not updated. Please try again.",
        icon: <AlertCircle />,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const { authenticated, patientBasic, patientPersonal, patientMedical } =
      globalStore;
    if (authenticated === false)
      router.push("/profile", null, { shallow: true });
    else {
      if (
        patientBasic !== null &&
        patientPersonal !== null &&
        patientMedical !== null
      ) {
        const { name, gender, dateOfBirth, maritalStatus } = patientBasic;
        const { countryCode, phoneNumber, emailAddress } = patientPersonal;
        const {
          allergies,
          currentMedications,
          symptoms,
          vitalSigns,
          progressNotes,
        } = patientMedical;
        const {
          weight,
          height,
          temperature,
          respiratoryRate,
          heartRate,
          bloodPressure,
        } = vitalSigns;

        const integerCountryCode = parseInt(countryCode);
        const integerPhoneNumber = parseInt(phoneNumber);
        const formattedDateofBirth = new Date(dateOfBirth);

        setRespiratoryRate(respiratoryRate);
        setHeartRate(heartRate);
        setAllergies(allergies);
        setCurrentMedications(currentMedications);
        setSymptoms(symptoms);
        setProgressNotes(progressNotes);

        form.setValues({
          name,
          gender,
          dateOfBirth: formattedDateofBirth,
          maritalStatus,
          countryCode: integerCountryCode,
          phoneNumber: integerPhoneNumber,
          emailAddress,
          weight,
          height,
          temperature,
        });

        if (bloodPressure.position !== undefined) {
          if (
            bloodPressure.measurement.systolic !== undefined &&
            bloodPressure.measurement.diastolic !== undefined
          ) {
            const { position, measurement } = bloodPressure;
            const { systolic, diastolic } = measurement;
            console.log("Blood Pressure => ", position, systolic, diastolic);
            form.setValues({
              name,
              gender,
              dateOfBirth: formattedDateofBirth,
              maritalStatus,
              countryCode: integerCountryCode,
              phoneNumber: integerPhoneNumber,
              emailAddress,
              weight,
              height,
              temperature,
              bloodPressurePosition: position,
              systolicBloodPressure: systolic,
              diastolicBloodPressure: diastolic,
            });
          } else {
            form.setValues({
              name,
              gender,
              dateOfBirth: formattedDateofBirth,
              maritalStatus,
              countryCode: integerCountryCode,
              phoneNumber: integerPhoneNumber,
              emailAddress,
              weight,
              height,
              temperature,
            });
          }
        } else {
          form.setValues({
            name,
            gender,
            dateOfBirth: formattedDateofBirth,
            maritalStatus,
            countryCode: integerCountryCode,
            phoneNumber: integerPhoneNumber,
            emailAddress,
            weight,
            height,
            temperature,
          });
        }
      }
    }
  }, []);

  if (globalStore.patientMedical !== null) {
    return (
      <div style={{ margin: "0 5%" }}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Basic Information
          </Title>

          <TextInput
            required
            label="Name"
            placeholder="Your Full Name"
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            required
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Male", "Female", "Transgender"]}
            placeholder="Select your gender"
            label="Gender"
            classNames={classes}
            {...form.getInputProps("gender")}
          />

          <DatePicker
            required
            dropdownType="modal"
            style={{ marginTop: 20 }}
            label="Date of Birth"
            placeholder="Select your date of birth"
            classNames={classes}
            clearable={false}
            {...form.getInputProps("dateOfBirth")}
          />

          <Select
            required
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Single", "Married", "Divorced"]}
            placeholder="Select your Marital Status"
            label="Marital status"
            classNames={classes}
            {...form.getInputProps("maritalStatus")}
          />

          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Private Information
          </Title>

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: "sm", cols: 1, margin: "50px" }]}
          >
            <NumberInput
              required
              label="Country Code"
              placeholder="Your Country Code"
              classNames={classes}
              {...form.getInputProps("countryCode")}
            />

            <NumberInput
              required
              label="Phone Number"
              placeholder="Your Phone Number"
              classNames={classes}
              {...form.getInputProps("phoneNumber")}
            />
          </SimpleGrid>
          <br />
          <TextInput
            required
            label="Email Id"
            placeholder="Your Email Id"
            classNames={classes}
            {...form.getInputProps("emailAddress")}
          />

          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Medical Information
          </Title>

          <NumberInput
            required
            label="Weight (kg)"
            placeholder="Your Weight"
            classNames={classes}
            {...form.getInputProps("weight")}
          />
          <br />

          <NumberInput
            required
            label="Height (cm)"
            placeholder="Your Height"
            classNames={classes}
            {...form.getInputProps("height")}
          />
          <br />

          <NumberInput
            required
            label="Temperature (Celsius)"
            placeholder="Your Body Temperature"
            classNames={classes}
            {...form.getInputProps("temperature")}
          />
          <br />

          <NumberInput
            label="Respiratory Rate (per min)"
            placeholder="Your Respiratory Rate"
            classNames={classes}
            value={respiratoryRate}
            onChange={(val) => setRespiratoryRate(val)}
          />
          <br />

          <NumberInput
            label="Heart Rate (bpm)"
            placeholder="Your Heart Rate"
            classNames={classes}
            value={heartRate}
            onChange={(val) => setHeartRate(val)}
          />
          <br />

          <MultiSelect
            label="Allergies"
            data={globalStore.patientMedical.allergies}
            value={allergies}
            onChange={setAllergies}
            defaultValue={globalStore.patientMedical.allergies}
            placeholder="Select Allergies"
            searchable
            creatable
            clearable
            getCreateLabel={(query) => `+ Create ${query}`}
          />
          <br />

          <MultiSelect
            label="Current Medications"
            data={globalStore.patientMedical.currentMedications}
            value={currentMedications}
            onChange={setCurrentMedications}
            defaultValue={globalStore.patientMedical.currentMedications}
            placeholder="Select Current Medications"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
          />
          <br />

          <MultiSelect
            label="Symptoms"
            data={globalStore.patientMedical.symptoms}
            value={symptoms}
            onChange={setSymptoms}
            defaultValue={globalStore.patientMedical.symptoms}
            placeholder="Select Symptoms"
            searchable
            creatable
            clearable
            getCreateLabel={(query) => `+ Create ${query}`}
          />

          <Select
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Sitting", "Supine", "Standing"]}
            clearable
            placeholder="Select your Blood Pressure measuring position"
            label="Blood Pressure Measuring Position"
            classNames={classes}
            {...form.getInputProps("bloodPressurePosition")}
          />
          <br />

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: "sm", cols: 1, margin: "50px" }]}
          >
            <NumberInput
              label="Systolic Blood Pressure (mmHg)"
              placeholder="Systolic Blood Pressure"
              classNames={classes}
              {...form.getInputProps("systolicBloodPressure")}
            />

            <NumberInput
              label="Diastolic Blood Pressure (mmHg)"
              placeholder="Diastolic Blood Pressure"
              classNames={classes}
              {...form.getInputProps("diastolicBloodPressure")}
            />
          </SimpleGrid>

          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Progress Notes
          </Title>

          <RichTextEditor
            value={globalStore.patientMedical.progressNotes}
            onChange={setProgressNotes}
          />

          <Button type="submit" size="lg" fullWidth style={{ margin: "2% 0" }}>
            Save
          </Button>
        </form>
      </div>
    );
  } else {
    return (
      <div style={{ margin: "0 5%" }}>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Basic Information
          </Title>

          <TextInput
            required
            label="Name"
            placeholder="Your Full Name"
            classNames={classes}
            {...form.getInputProps("name")}
          />

          <Select
            required
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Male", "Female", "Transgender"]}
            placeholder="Select your gender"
            label="Gender"
            classNames={classes}
            {...form.getInputProps("gender")}
          />

          <DatePicker
            required
            dropdownType="modal"
            style={{ marginTop: 20 }}
            label="Date of Birth"
            placeholder="Select your date of birth"
            classNames={classes}
            clearable={false}
            {...form.getInputProps("dateOfBirth")}
          />

          <Select
            required
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Single", "Married", "Divorced"]}
            placeholder="Select your Marital Status"
            label="Marital status"
            classNames={classes}
            {...form.getInputProps("maritalStatus")}
          />

          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Private Information
          </Title>

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: "sm", cols: 1, margin: "50px" }]}
          >
            <NumberInput
              required
              label="Country Code"
              placeholder="Your Country Code"
              classNames={classes}
              {...form.getInputProps("countryCode")}
            />

            <NumberInput
              required
              label="Phone Number"
              placeholder="Your Phone Number"
              classNames={classes}
              {...form.getInputProps("phoneNumber")}
            />
          </SimpleGrid>
          <br />
          <TextInput
            required
            label="Email Id"
            placeholder="Your Email Id"
            classNames={classes}
            {...form.getInputProps("emailAddress")}
          />

          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Medical Information
          </Title>

          <NumberInput
            required
            label="Weight (kg)"
            placeholder="Your Weight"
            classNames={classes}
            {...form.getInputProps("weight")}
          />
          <br />

          <NumberInput
            required
            label="Height (cm)"
            placeholder="Your Height"
            classNames={classes}
            {...form.getInputProps("height")}
          />
          <br />

          <NumberInput
            required
            label="Temperature (Celsius)"
            placeholder="Your Body Temperature"
            classNames={classes}
            {...form.getInputProps("temperature")}
          />
          <br />

          <NumberInput
            label="Respiratory Rate (per min)"
            placeholder="Your Respiratory Rate"
            classNames={classes}
            value={respiratoryRate}
            onChange={(val) => setRespiratoryRate(val)}
          />
          <br />

          <NumberInput
            label="Heart Rate (bpm)"
            placeholder="Your Heart Rate"
            classNames={classes}
            value={heartRate}
            onChange={(val) => setHeartRate(val)}
          />
          <br />

          <MultiSelect
            label="Allergies"
            data={allergies}
            value={allergies}
            onChange={setAllergies}
            placeholder="Select Allergies"
            searchable
            creatable
            clearable
            getCreateLabel={(query) => `+ Create ${query}`}
          />
          <br />

          <MultiSelect
            label="Current Medications"
            data={currentMedications}
            value={currentMedications}
            onChange={setCurrentMedications}
            placeholder="Select Current Medications"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
          />
          <br />

          <MultiSelect
            label="Symptoms"
            data={symptoms}
            value={symptoms}
            onChange={setSymptoms}
            placeholder="Select Symptoms"
            searchable
            creatable
            clearable
            getCreateLabel={(query) => `+ Create ${query}`}
          />

          <Select
            style={{ marginTop: 20, zIndex: 2 }}
            data={["Sitting", "Supine", "Standing"]}
            clearable
            placeholder="Select your Blood Pressure measuring position"
            label="Blood Pressure Measuring Position"
            classNames={classes}
            {...form.getInputProps("bloodPressurePosition")}
          />
          <br />

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: "sm", cols: 1, margin: "50px" }]}
          >
            <NumberInput
              label="Systolic Blood Pressure (mmHg)"
              placeholder="Systolic Blood Pressure"
              classNames={classes}
              {...form.getInputProps("systolicBloodPressure")}
            />

            <NumberInput
              label="Diastolic Blood Pressure (mmHg)"
              placeholder="Diastolic Blood Pressure"
              classNames={classes}
              {...form.getInputProps("diastolicBloodPressure")}
            />
          </SimpleGrid>

          <Title style={{ margin: "3% 0 1% 0" }} order={2}>
            Progress Notes
          </Title>

          <RichTextEditor onChange={setProgressNotes} />

          <Button type="submit" size="lg" fullWidth style={{ margin: "2% 0" }}>
            Save
          </Button>
        </form>
      </div>
    );
  }
}
