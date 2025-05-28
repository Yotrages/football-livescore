import { PasswordInput, PasswordInputProps} from "@mantine/core";
import React from "react";

interface Props extends PasswordInputProps {
  width?: string;
  height?: string;
  withShadow?: boolean;
}

export const CustomPasswordInput = ({
  width = "w-[384px]",
  height,
  withShadow,
  ...props
}: Props) => {
  return (
    <PasswordInput
      {...props}
      classNames={{
        input: `${
          height ?? "!h-11"
        } border placeholder:!text-sm placeholder:!text-grey-400 focus-within:border-primary border-[#D0D5DD] !px-4 !rounded-lg ${width} ${withShadow ? "shadow-2" : ""}`,
         innerInput: `${props?.leftSection ? "!pl-8" : "!pl-4"} !text-sm !text-grey-900`
      }}
    />
  );
};
