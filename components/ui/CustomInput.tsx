import { TextInput, TextInputProps } from "@mantine/core";
import React from "react";

interface Props extends TextInputProps {
  width?: string;
  height?: string;
  withShadow?: boolean;
}

export const CustomInput = ({
  width = "w-[384px]",
  height,
  withShadow,
  ...props
}: Props) => {
  return (
    <TextInput
      {...props}
      classNames={{
        input: `${
          height ?? "!h-11"
        } border placeholder:!text-sm placeholder:!text-grey-400 focus:border-primary border-[#D0D5DD] !px-4 ${
          props?.leftSection ? "!pl-8" : "!pl-4"
        } !rounded-lg ${width} ${withShadow ? "shadow-2" : ""} !text-sm !text-grey-900`,
      }}
    />
  );
};
