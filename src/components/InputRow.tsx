import { Autocomplete, Box, SxProps, TextField, Theme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useRef, useState } from "react";
import { parse } from "date-fns";

type InputRowProps = {
  name: string;
  label: string;
  type?: "text" | "date" | "autocomplete";
  multiline?: boolean;
  options?: string[];
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
};

function InputRowBody({
  type,
  name,
  label,
  options,
  multiline,
}: InputRowProps) {
  const [value, setValue] = useState<string | null>("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const current = inputRef.current;

    const listener = () => {
      const element = current as HTMLInputElement | null;
      if (type === "date") {
        setDateValue(parse(element?.value ?? "", "P", new Date()));
        return;
      }
      setValue(element?.value ?? "");
    };

    inputRef.current.addEventListener("input", listener);

    return () => {
      current.removeEventListener("input", listener);
    };
  }, [name, type, value]);

  if (type === "date") {
    return (
      <DatePicker
        name={name}
        label={label}
        value={dateValue}
        onChange={(newValue) => {
          setDateValue(newValue);
        }}
        inputRef={inputRef}
        sx={{
          flexGrow: 1,
        }}
      />
    );
  }

  if (type === "autocomplete" && options) {
    return (
      <Autocomplete
        options={options}
        freeSolo
        value={value}
        onChange={(_ev, newValue) => {
          setValue(newValue ?? "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
            name={name}
            label={label}
          />
        )}
        sx={{
          flexGrow: 1,
        }}
      />
    );
  }

  return (
    <TextField
      name={name}
      label={label}
      value={value}
      inputRef={inputRef}
      multiline={multiline}
      minRows={2}
      maxRows={8}
      onChange={(ev) => {
        setValue(ev.target.value);
      }}
      sx={{
        flexGrow: 1,
      }}
    />
  );
}

export function InputRow({ sx, children, ...props }: InputRowProps) {
  return (
    <Box sx={sx}>
      <Box
        sx={{
          display: "flex",
          marginBottom: 2,
        }}
      >
        <InputRowBody {...props} />
        {children}
      </Box>
    </Box>
  );
}
