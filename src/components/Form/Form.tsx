import objectPath from "object-path";
import { ChangeEvent, useCallback, useState } from "react";
import styles from "./Form.module.css";
import { Segment } from "../../global.types";

interface IForm {
  segment1: Segment;
  segment2: Segment;
}

interface IFormProps {
  onSuccess: (form: IForm) => void;
}

const isEmptyString = (value: number | "") => value === "";
const isFormValid = ({ segment1, segment2 }: IForm) => {
  const points = [
    segment1.start.x,
    segment1.start.y,
    segment1.end.x,
    segment1.end.y,

    segment2.start.x,
    segment2.start.y,
    segment2.end.x,
    segment2.end.y,
  ];
  return !points.some(isEmptyString);
};
const Form = ({ onSuccess }: IFormProps) => {
  const [form, setForm] = useState<IForm>({
    segment1: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    segment2: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
  });
  const [isValidForm, setIsValidForm] = useState(true);

  const validateForm = (form: IForm) => setIsValidForm(isFormValid(form));

  const handleFormChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setForm((previousForm) => {
      const newForm = { ...previousForm };
      const value = e.target.valueAsNumber;
      objectPath.set(newForm, e.target.name, isNaN(value) ? "" : value);
      validateForm(newForm);
      return newForm;
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "24px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "24px",
        }}
      >
        <div className={styles.segmentContainer}>
          <label>Segment 1:</label>
          <div>
            <div>
              <span>początek</span>
              <div>
                <label>x1</label>
                <input
                  type="number"
                  name="segment1.start.x"
                  value={form.segment1.start.x}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>y1</label>
                <input
                  type="number"
                  name="segment1.start.y"
                  value={form.segment1.start.y}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                columnGap: "24px",
                justifyContent: "space-evenly",
              }}
            >
              <span>koniec</span>
              <div>
                <label>x2</label>
                <input
                  type="number"
                  name="segment1.end.x"
                  value={form.segment1.end.x}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>y2</label>
                <input
                  type="number"
                  name="segment1.end.y"
                  value={form.segment1.end.y}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.segmentContainer}>
          <label>Segment 2:</label>
          <div>
            <div>
              <span>początek</span>

              <div>
                <label>x1</label>
                <input
                  type="number"
                  name="segment2.start.x"
                  value={form.segment2.start.x}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>y1</label>
                <input
                  type="number"
                  name="segment2.start.y"
                  value={form.segment2.start.y}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div>
              <span>koniec</span>
              <div>
                <label>x2</label>
                <input
                  type="number"
                  name="segment2.end.x"
                  value={form.segment2.end.x}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>y2</label>
                <input
                  type="number"
                  name="segment2.end.y"
                  value={form.segment2.end.y}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => onSuccess(form)} disabled={!isValidForm}>
        Oblicz przecięcie
      </button>
    </div>
  );
};

export default Form;
