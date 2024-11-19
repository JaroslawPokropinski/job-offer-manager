import { Container, Paper, Button } from "@mui/material";
import { getPageData } from "../utils/getDataUtil";
import { useEffect, useRef } from "react";
import { InputRow } from "../components/InputRow";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { v4 } from "uuid";
import { fillInput, getFormData, isValueElement } from "../utils/genericUtil";

export function AddMultiple() {
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
      onSubmit={async (ev) => {
        ev.preventDefault();
        if (!formRef.current) return;

        const newFormData = getFormData(formRef.current);

        // get values from the pages
        const urls = newFormData.urls
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean);
        const promises = urls.map((url) =>
          getPageData(url).then((data) => ({ ...data, url }))
        );
        const importedData = await Promise.all(promises);

        // get current data from local storage
        const jobOffersStr = localStorage.getItem("job-offers");
        const jobOffers: Record<string, string>[] = jobOffersStr
          ? JSON.parse(jobOffersStr)
          : [];

        // append new values and save in localStorage
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { urls: _formUrls, ...sharedData } = newFormData;
        importedData.reverse().forEach((data) => {
          jobOffers.unshift({
            ...data,
            ...sharedData,
            id: v4(),
          });
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
        <InputRow name="urls" label="URLs" multiline />

        <InputRow
          name="status"
          label="Status"
          type="autocomplete"
          options={["Applied", "Declined"]}
        />

        <InputRow type="date" name="appliedDate" label="Applied Date" />

        <InputRow
          name="location"
          label="Location"
          type="autocomplete"
          options={["Remote", "Wrocław"]}
        />

        <Button variant="contained" type="submit">
          Save
        </Button>
      </Paper>
    </Container>
  );
}
