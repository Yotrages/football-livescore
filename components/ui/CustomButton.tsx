import { Button, ButtonProps } from "@mantine/core";
import React, { MouseEventHandler, ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface CustomButtonProps extends ButtonProps {
  type?: "button" | "submit" | "reset";
  text: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  py?: string;
  px?: string;
  fullWidth?: boolean;
  variant?: "outline" | "filled" | "primary-outline" | "auth";
  width?: string;
  height?: string;
  textSize?: string;
  textColor?: string;
  iconColor?: string;
  textWeight?: number;
  withArrowRight?: boolean;
  withAddIcon?: boolean;
  withCloseIcon?: boolean;
  isActionButton?: boolean;
}

const buttonStyles = {
  outline: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    color: "#374151",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  filled: {
    backgroundColor: "#EB5017",
    color: "#fff",
  },
  "primary-outline": {
    backgroundColor: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#F56630",
    color: "#0070f3",
  },
  auth: {
    backgroundColor: "none",
    backgroundImage:
      "linear-gradient(0deg, #F56630, #F56630),radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    color: "white",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#CD6B41",
  },
};

export const CustomButton = ({
  text,
  onClick,
  px = "12px",
  py = "8px",
  fullWidth,
  variant = "filled",
  width,
  height,
  textSize = "14px",
  textWeight = 600,
  textColor,
  withArrowRight,
  withAddIcon,
  withCloseIcon,
  iconColor,
  isActionButton,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      onClick={onClick}
      style={{
        minHeight: "fit-content",
        height: height ?? "fit-content",
        width: width ?? "fit-content",
        borderRadius: "8px",
        paddingInline: px,
        paddingBlock: isActionButton ? undefined : py,
        ...buttonStyles[variant],
        backgroundColor: props?.disabled
          ? "#D0D5DD"
          : buttonStyles[variant].backgroundColor,
      }}
      styles={{
        section: {
          height: isActionButton ? "100%" : undefined,
        },
        inner: {
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          // gap: "8px",
        },
      }}
      fullWidth={fullWidth}
      rightSection={
        isActionButton ? (
          <span
            className="border-l-[0.3px] border-l-white pl-[3px]"
            style={{
              color: textColor,
              paddingBlock: isActionButton ? py : undefined,
            }}
          >
          </span>
        ) : (
          <span style={{ color: textColor }}>
            {withAddIcon ? (
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3333 3.33333C11.3333 2.8731 10.9602 2.5 10.5 2.5C10.0398 2.5 9.66667 2.8731 9.66667 3.33333V9.16667H3.83333C3.3731 9.16667 3 9.53976 3 10C3 10.4602 3.3731 10.8333 3.83333 10.8333H9.66667V16.6667C9.66667 17.1269 10.0398 17.5 10.5 17.5C10.9602 17.5 11.3333 17.1269 11.3333 16.6667V10.8333H17.1667C17.6269 10.8333 18 10.4602 18 10C18 9.53976 17.6269 9.16667 17.1667 9.16667H11.3333V3.33333Z"
                  fill={iconColor ? iconColor : textColor ? textColor : "white"}
                />
              </svg>
            ) : withArrowRight ? (
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.3332 10.4998L4.6665 10.4998M16.3332 10.4998L10.4998 4.6665M16.3332 10.4998L10.4998 16.3332"
                  stroke={
                    iconColor ? iconColor : textColor ? textColor : "white"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              props?.rightSection
            )}
          </span>
        )
      }
      leftSection={
        withCloseIcon ? <MdClose color={iconColor} /> : props?.leftSection
      }
      {...props}
    >
      <span
        style={{
          color: textColor ?? buttonStyles[variant].color,
          fontSize: textSize,
          fontWeight: textWeight,
        }}
        className="h-fit"
      >
        {text}
      </span>
    </Button>
  );
};
