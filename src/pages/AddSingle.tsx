import { Container, Paper, Button } from "@mui/material";
import { getPageData } from "../utils/getDataUtil";
import { useEffect, useRef } from "react";
import { InputRow } from "../components/InputRow";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { fillInput, getFormData, isValueElement } from "../utils/genericUtil";

export function AddSingle() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;

    const id = searchParams.get("id");
    if (!id) return;

    const jobOfferStr = localStorage.getItem("job-offers");
    const jobOffers = jobOfferStr ? JSON.parse(jobOfferStr) : [];
    const jobOffer = jobOffers.find(
      (obj: Record<string, string | undefined>) => obj.id === id
    );
    if (!jobOffer) return;

    Object.keys(getFormData(formRef.current)).forEach((key) => {
      const input = formRef.current?.elements.namedItem(key);
      if (isValueElement(input)) {
        fillInput(input, jobOffer[key] ?? "");
      }
    });
  }, [searchParams]);

  return (
    <Container
      ref={formRef}
      component="form"
      sx={{
        height: "100%",
      }}
      onSubmit={(ev) => {
        ev.preventDefault();
        if (!formRef.current) return;

        console.log(getFormData(formRef.current));
        // get current data from local storage
        const jobOffersStr = localStorage.getItem("job-offers");
        let jobOffers: Record<string, string>[] = jobOffersStr
          ? JSON.parse(jobOffersStr)
          : [];

        // append new value and save in localStorage
        const newFormData = getFormData(formRef.current);
        jobOffers = jobOffers.filter(
          (obj: Record<string, string>) => obj.id !== newFormData.id
        );
        jobOffers.unshift({
          ...newFormData,
          id: !newFormData.id ? v4() : newFormData.id,
        });
        localStorage.setItem("job-offers", JSON.stringify(jobOffers));

        navigate("/");
      }}
    >
      <Paper
        sx={{
          padding: 2,
        }}
      >
        <input type="hidden" name="id" />
        <InputRow name="url" label="URL">
          <Button
            type="button"
            sx={{
              marginLeft: 1,
            }}
            onClick={() => {
              if (!formRef.current) return;
              getPageData(getFormData(formRef.current).url).then((data) => {
                Object.entries(data).forEach(([key, value]) => {
                  const input = formRef.current?.elements.namedItem(key);
                  if (isValueElement(input)) {
                    fillInput(input, value ?? "");
                  }
                });
              });
            }}
          >
            Fill from URL
          </Button>
        </InputRow>

        <InputRow name="position" label="Position" />

        <InputRow name="company" label="Company" />

        <InputRow
          name="status"
          label="Status"
          type="autocomplete"
          options={["Applied", "Declined"]}
        />

        <InputRow name="salary" label="Salary" multiline />

        <InputRow type="date" name="appliedDate" label="Applied Date" />

        <InputRow
          name="location"
          label="Location"
          type="autocomplete"
          options={["Remote", "Wrocław"]}
        />

        <InputRow
          name="description"
          label="Description"
          multiline
          sx={{
            marginBottom: 4,
          }}
        />

        <Button variant="contained" type="submit">
          Save
        </Button>
      </Paper>
    </Container>
  );
}
