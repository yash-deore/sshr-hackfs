import {
  RingProgress,
  Text,
  SimpleGrid,
  Paper,
  Center,
  Group,
  Title,
} from "@mantine/core";
import {
  Scale,
  LineHeight,
  TemperaturePlus,
  HeartRateMonitor,
  Run,
  Accessible,
  MedicalCross,
} from "tabler-icons-react";
import RichTextEditor from "./rich-text-editor";

function WeightDisplay({ weight }) {
  return (
    <Paper withBorder radius="md" p="xs" key="weight">
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: 100, color: "#4fcdf7" }]}
          label={
            <Center>
              <Scale size={22} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Weight
          </Text>
          <Text weight={700} size="xl">
            {weight} kg
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

function HeightDisplay({ height }) {
  return (
    <Paper withBorder radius="md" p="xs" key="height">
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: 100, color: "#47d6ab" }]}
          label={
            <Center>
              <LineHeight size={22} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Height
          </Text>
          <Text weight={700} size="xl">
            {height} cm
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

function TemperatureDisplay({ temperature }) {
  return (
    <Paper withBorder radius="md" p="xs" key="temperature">
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: 100, color: "#4fcdf7" }]}
          label={
            <Center>
              <TemperaturePlus size={22} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Temperature
          </Text>
          <Text weight={700} size="xl">
            {temperature} &deg;C
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

function HeartRate({ heartRate }) {
  return (
    <Paper withBorder radius="md" p="xs" key="heartRate">
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: 100, color: "#47d6ab" }]}
          label={
            <Center>
              <HeartRateMonitor size={22} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Heart Rate
          </Text>
          <Text weight={700} size="xl">
            {heartRate === 0 || heartRate === undefined || heartRate === "NA"
              ? "NA"
              : heartRate + " bpm"}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

function RespiratoryRate({ respiratoryRate }) {
  return (
    <Paper withBorder radius="md" p="xs" key="respiratoryRate">
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: 100, color: "#4fcdf7" }]}
          label={
            <Center>
              <Run size={22} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Respiratory Rate
          </Text>
          <Text weight={700} size="xl">
            {respiratoryRate === 0 ||
            respiratoryRate === undefined ||
            respiratoryRate === "NA"
              ? "NA"
              : respiratoryRate + " per min"}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

function BloodPressure({ bloodPressure }) {
  let pos, sys, dia;
  if (bloodPressure.position === undefined || bloodPressure.position === "")
    pos = "NA";
  else pos = bloodPressure.position;

  if (
    !bloodPressure.measurement ||
    typeof bloodPressure.measurement === "string"
  ) {
    console.error("No bloodPressure.measurement.  Got: ", {
      bloodPressure,
    });
    if (typeof bloodPressure === "string") {
      bloodPressure = {};
    }
    bloodPressure.measurement = {};
  }

  if (
    bloodPressure.measurement.systolic === undefined ||
    bloodPressure.measurement.systolic === 0
  ) {
    sys = "NA";
    dia = "NA";
  } else {
    sys = bloodPressure.measurement.systolic + " mmHg";
    dia = bloodPressure.measurement.diastolic + " mmHg";
  }

  return (
    <>
      <Paper withBorder radius="md" p="xs" key="position">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color: "#47d6ab" }]}
            label={
              <Center>
                <Accessible size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              BP Position
            </Text>
            <Text weight={700} size="xl">
              {pos}
            </Text>
          </div>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="xs" key="systolic">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color: "#4fcdf7" }]}
            label={
              <Center>
                <MedicalCross size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Systolic BP
            </Text>
            <Text weight={700} size="xl">
              {sys}
            </Text>
          </div>
        </Group>
      </Paper>

      <Paper withBorder radius="md" p="xs" key="diastolic">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color: "#47d6ab" }]}
            label={
              <Center>
                <MedicalCross size={22} />
              </Center>
            }
          />

          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Diastolic BP
            </Text>
            <Text weight={700} size="xl">
              {dia}
            </Text>
          </div>
        </Group>
      </Paper>
    </>
  );
}

function ArrayInRichTextEditor({ array }) {
  if (!array || array.length === 0)
    return <RichTextEditor readOnly value="<strong>None</strong>" />;

  let display = "";
  array.forEach((element) => {
    display += `<li><strong>${element}</strong></li>`;
  });
  const value = `<ul>${display}</ul>`;
  console.log(value);

  return <RichTextEditor readOnly value={value} />;
}

export function PatientMedicalInformation({
  allergies,
  currentMedications,
  symptoms,
  progressNotes,
  vitalSigns,
}) {
  if (!vitalSigns) {
    vitalSigns = {};
  }
  if (!vitalSigns.weight) {
    vitalSigns.weight = "NA";
  }
  if (!vitalSigns.height) {
    vitalSigns.height = "NA";
  }
  if (!vitalSigns.temperature) {
    vitalSigns.temperature = "NA";
  }
  if (!vitalSigns.respiratoryRate) {
    vitalSigns.respiratoryRate = "NA";
  }
  if (!vitalSigns.heartRate) {
    vitalSigns.heartRate = "NA";
  }
  if (!vitalSigns.bloodPressure) {
    vitalSigns.bloodPressure = "NA";
  }
  const {
    weight,
    height,
    temperature,
    respiratoryRate,
    heartRate,
    bloodPressure,
  } = vitalSigns;

  return (
    <div>
      <Title style={{ margin: "3% 0 1% 0", fontWeight: 600 }} order={2}>
        Vital Signs
      </Title>

      <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <WeightDisplay weight={weight} />
        <HeightDisplay height={height} />
        <TemperatureDisplay temperature={temperature} />
        <HeartRate heartRate={heartRate} />
        <RespiratoryRate respiratoryRate={respiratoryRate} />
        <BloodPressure bloodPressure={bloodPressure} />
      </SimpleGrid>

      <Title style={{ margin: "3% 0 1% 0", fontWeight: 600 }} order={2}>
        Allergies
      </Title>

      <ArrayInRichTextEditor array={allergies} />

      <Title style={{ margin: "3% 0 1% 0", fontWeight: 600 }} order={2}>
        Current Medications
      </Title>

      <ArrayInRichTextEditor array={currentMedications} />

      <Title style={{ margin: "3% 0 1% 0", fontWeight: 600 }} order={2}>
        Symptoms
      </Title>

      <ArrayInRichTextEditor array={symptoms} />

      <Title style={{ margin: "3% 0 1% 0", fontWeight: 600 }} order={2}>
        Progress Notes
      </Title>

      <RichTextEditor readOnly value={progressNotes} />
    </div>
  );
}
